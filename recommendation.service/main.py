import random
import numpy as np
from MusicRecommendation import MusicRecommendation
from RBMAlgorithm import RBMAlgorithm
from ContentKNNAlgorithm import ContentKNNAlgorithm
from HybridAlgorithm import HybridAlgorithm
from Evaluator import Evaluator

# Ánh xạ ID cảm xúc sang tên để log thông tin
emotion_map = {
1: "neutral",
2: "happy",
3: "sad",
4: "angry",
5: "fearful",
6: "disgusted",
7: "surprised"
}

# Đặt seed để đảm bảo kết quả có thể tái tạo
np.random.seed(0)
random.seed(0)

# --- BƯỚC 1: KHỞI TẠO VÀ TẢI DỮ LIỆU CHUNG ---

# Khởi tạo lớp MusicRecommendation một lần duy nhất
musicData = MusicRecommendation()

# Tải toàn bộ dữ liệu. `all_datasets` là một dict {emotion_id: Dataset}
# Thông tin chi tiết bài hát cũng được tải và lưu trong đối tượng musicData
print("Loading all datasets from databases...")
all_datasets = musicData.loadMusicData()
all_users = musicData.loadListeners()
print(f"Found {len(all_datasets)} emotions with data and {len(all_users)} unique users.")

# Chuẩn bị một dictionary để lưu trữ tất cả các gợi ý
all_recommendations_to_save = {}


# --- BƯỚC 2: LẶP QUA TỪNG CẢM XÚC ĐỂ TẠO GỢI Ý ---

for emotion_id, emotion_name in emotion_map.items():
    try:  # Bắt đầu khối xử lý lỗi
        print(f"\n{'='*20} PROCESSING EMOTION: {emotion_name.upper()} (ID: {emotion_id}) {'='*20}")

        # Lấy dữ liệu dành riêng cho cảm xúc này
        evaluation_data_for_emotion = all_datasets.get(emotion_id)

        # Nếu không có dữ liệu cho cảm xúc này, bỏ qua
        if not evaluation_data_for_emotion:
            print(f"No rating data found for emotion '{emotion_name}'. Skipping.")
            continue

        # Lấy bảng xếp hạng độ phổ biến cho cảm xúc này
        rankings_for_emotion = musicData.getPopularityRanks(emotion=emotion_id)

        # Khởi tạo Evaluator với dữ liệu của cảm xúc hiện tại
        # Lưu ý: Lỗi "Could not build any trainset" có thể xảy ra ở đây nếu dữ liệu không đủ
        evaluator = Evaluator(evaluation_data_for_emotion, rankings_for_emotion)

        # Khởi tạo lại các thuật toán để chúng được huấn luyện trên dataset mới
        print(f"Initializing algorithms for '{emotion_name}'...")
        SimpleRBM = RBMAlgorithm(epochs=40)
        ContentKNN = ContentKNNAlgorithm(10, {}, musicData)
        Hybrid = HybridAlgorithm([SimpleRBM, ContentKNN], [0.2, 0.8])

        # Thêm thuật toán vào Evaluator
        evaluator.AddAlgorithm(Hybrid, "Hybrid")

        # Tạo gợi ý cho tất cả người dùng với cảm xúc hiện tại
        print(f"Generating recommendations for all users based on '{emotion_name}' mood...")
        recommendations_for_emotion = evaluator.RecommendForEachUser(musicData, all_users)
        print(f"Generated recommendations for {len(recommendations_for_emotion)} users.")

        # Lưu kết quả gợi ý của cảm xúc này vào dictionary chung
        all_recommendations_to_save[emotion_id] = recommendations_for_emotion

    except Exception as e:
        # Nếu có bất kỳ lỗi nào xảy ra trong khối `try`, nó sẽ được bắt ở đây
        print(f"\n[ERROR] An unexpected error occurred while processing emotion '{emotion_name}' (ID: {emotion_id}).")
        # In ra chi tiết lỗi để gỡ rối
        print(f"  > Error Details: {e}")
        print("  > Skipping to the next emotion...")
        # Lệnh continue sẽ bỏ qua lần lặp hiện tại và chuyển sang cảm xúc tiếp theo
        continue

# --- BƯỚC 3: LƯU TẤT CẢ KẾT QUẢ VÀO REDIS ---

if all_recommendations_to_save:
    print(f"\n{'='*20} SAVING ALL RECOMMENDATIONS TO REDIS {'='*20}")
    # Gọi hàm saveAllRecommendationsToRedis với dictionary chứa tất cả kết quả
    musicData.saveAllRecommendationsToRedis(all_recommendations_to_save)
    print("Successfully saved all recommendations to Redis.")
else:
    print("\nNo recommendations were generated to save.")