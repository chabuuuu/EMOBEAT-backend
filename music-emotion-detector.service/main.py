import os
import sys
import tempfile
from dotenv import load_dotenv

import psycopg2
from minio import Minio
from minio.error import S3Error
from urllib.parse import urlparse, parse_qs
import numpy as np
import librosa
import joblib

# Tải các biến môi trường từ file .env
load_dotenv()

# --- PHẦN 1: THIẾT LẬP KẾT NỐI VÀ CẤU HÌNH ---

# Cấu hình MinIO
MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT')
MINIO_ACCESS_KEY = os.getenv('MINIO_ACCESS_KEY')
MINIO_SECRET_KEY = os.getenv('MINIO_SECRET_KEY')
MINIO_BUCKET = os.getenv('MINIO_BUCKET')

# Cấu hình PostgreSQL
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

# Khởi tạo MinIO Client
# Tách endpoint và port, xử lý trường hợp không có port
minio_endpoint_parts = MINIO_ENDPOINT.split(':')
minio_host = minio_endpoint_parts[0]
minio_port = int(minio_endpoint_parts[1]) if len(minio_endpoint_parts) > 1 else 9000

minio_client = Minio(
    f"{minio_host}:{minio_port}",
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False  # Đặt là True nếu bạn dùng HTTPS
)

# --- PHẦN 2: CODE PHÂN TÍCH CẢM XÚC (Lấy từ code của bạn) ---

# Tải mô hình và scaler đã được huấn luyện
try:
    model_valence = joblib.load('./TrainedModel/random_forest_regressor/random_forest_valence_model.pkl')
    model_arousal = joblib.load('./TrainedModel/random_forest_regressor/random_forest_arousal_model.pkl')
    scaler = joblib.load('./TrainedModel/random_forest_regressor/random_forest_scaler.pkl')
except FileNotFoundError as e:
    print(f"Lỗi: Không tìm thấy file model hoặc scaler. Vui lòng kiểm tra lại đường dẫn. {e}")
    sys.exit(1)


def map_to_emotion(valence, arousal):
    """Định nghĩa hàm ánh xạ valence và arousal sang nhãn cảm xúc."""
    if valence > 5 and arousal > 7:
        return 'ENERGY'
    elif valence > 5 and arousal > 5:
        return 'HAPPY'
    elif valence > 5 and 3 < arousal < 7:
        return 'ROMANTIC'
    elif 3 < valence < 7 and arousal < 3:
        return 'CHILL'
    elif valence < 5 and arousal < 5:
        return 'SAD'
    else:
        return 'OTHER'
    
def map_to_emotion_id(emotion):
    """Chuyển đổi nhãn cảm xúc thành ID."""
    emotion_map = {
        'ENERGY': 1,
        'HAPPY': 2,
        'ROMANTIC': 3,
        'CHILL': 4,
        'SAD': 5,
        'OTHER': 0
    }
    return emotion_map.get(emotion, 0)  # Trả về 0 nếu không tìm thấy nhãn

# Hàm trích xuất đặc trưng từ file MP3
def extract_features_from_mp3(mp3_path):
    try:
        y, sr = librosa.load(mp3_path, sr=None)
        mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13), axis=1)  # 13 đặc trưng
        chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr), axis=1)     # 12 đặc trưng
        spectral_contrast = np.mean(librosa.feature.spectral_contrast(y=y, sr=sr), axis=1)  # 7 đặc trưng
        tempo = librosa.beat.tempo(y=y, sr=sr)[0]                         # 1 đặc trưng
        rms = np.mean(librosa.feature.rms(y=y))                            # 1 đặc trưng
        zcr = np.mean(librosa.feature.zero_crossing_rate(y=y))            # 1 đặc trưng
        features = np.concatenate((mfcc, chroma, spectral_contrast, [tempo, rms, zcr]))
        return features  # Tổng cộng 35 đặc trưng
    except Exception as e:
        print(f"Error processing {mp3_path}: {e}")
        return None

# Hàm dự đoán valence, arousal và chuyển thành emotion
def predict_emotion(mp3_path, model_valence, model_arousal, scaler):
    features = extract_features_from_mp3(mp3_path)
    if features is not None:
        features = scaler.transform([features])  # Chuẩn hóa đặc trưng
        valence = model_valence.predict(features)[0]
        arousal = model_arousal.predict(features)[0]
        emotion = map_to_emotion(valence, arousal)
        return emotion, valence, arousal
    else:
        return "Error", None, None

# --- PHẦN 3: QUY TRÌNH XỬ LÝ CHÍNH ---

def process_music_emotions():
    """
    Hàm chính để lấy nhạc từ DB, tải từ MinIO, phân tích và cập nhật lại DB.
    """
    db_conn = None
    try:
        # Kết nối tới database PostgreSQL
        print("Đang kết nối tới PostgreSQL...")
        db_conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = db_conn.cursor()
        print("Kết nối PostgreSQL thành công.")

        # 1. Lấy danh sách bài hát chưa có nhãn cảm xúc
        # media_id được giả định là object_name trong MinIO
        query_fetch = "SELECT id, resource_link FROM mucis WHERE emotion IS NULL AND resource_link IS NOT NULL"
        cursor.execute(query_fetch)
        songs_to_process = cursor.fetchall()

        if not songs_to_process:
            print("Không có bài hát mới nào cần phân tích cảm xúc.")
            return

        print(f"Tìm thấy {len(songs_to_process)} bài hát cần được gán nhãn.")

        # 2. Lặp qua từng bài hát để xử lý
        for song_id, resource_link in songs_to_process:
            object_name = None
            
            # <<< THAY ĐỔI: Phân tích resource_link để lấy object_name >>>
            try:
                parsed_url = urlparse(resource_link)
                query_params = parse_qs(parsed_url.query)
                
                media_category = query_params.get('mediaCategory', [None])[0]
                file_name = query_params.get('fileName', [None])[0]

                if not media_category or not file_name:
                    raise ValueError("URL không chứa 'mediaCategory' hoặc 'fileName'")
                
                object_name = f"{media_category}/128/{file_name}"  # 128 tức 128kbps bitrate
                print(f"  -> Trích xuất Object Name: '{object_name}'")

            except (ValueError, KeyError, IndexError) as e:
                print(f"  -> LỖI: Không thể phân tích object name từ resource_link: '{resource_link}'. Lỗi: {e}. Bỏ qua bài hát này.")
                continue # Bỏ qua và xử lý bài hát tiếp theo
            # <<< KẾT THÚC THAY ĐỔI >>>


            print(f"\nĐang xử lý bài hát ID: {song_id}, Object Name: {object_name}")
            temp_file_path = None
            try:
                # 3. Tải file nhạc từ MinIO
                print(f"  -> Đang tải '{object_name}' từ bucket '{MINIO_BUCKET}'...")
                response = minio_client.get_object(MINIO_BUCKET, object_name)
                
                # Tạo file tạm thời để lưu nội dung nhạc
                with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
                    temp_file.write(response.read())
                    temp_file_path = temp_file.name
                
                response.close()
                response.release_conn()
                print(f"  -> Đã tải thành công về file tạm: {temp_file_path}")

                # 4. Phân tích cảm xúc từ file tạm
                predicted_emotion, valence, arousal  = predict_emotion(temp_file_path, model_valence, model_arousal, scaler)

                print(f"  -> Cảm xúc dự đoán: {predicted_emotion} (Valence: {valence}, Arousal: {arousal})")

                predicted_emotion = map_to_emotion_id(predicted_emotion)

                # 5. Cập nhật nhãn cảm xúc vào PostgreSQL
                if predicted_emotion:
                    query_update = "UPDATE mucis SET emotion = %s, update_at = now() WHERE id = %s"
                    cursor.execute(query_update, (predicted_emotion, song_id))
                    db_conn.commit()
                    print(f"  -> Đã cập nhật cảm xúc '{predicted_emotion}' cho bài hát ID {song_id} vào database.")
                else:
                    print(f"  -> Không thể phân tích cảm xúc cho bài hát ID {song_id}.")

            except S3Error as exc:
                print(f"  -> Lỗi khi tải file từ MinIO: {exc}")
            except Exception as e:
                print(f"  -> Xảy ra lỗi không xác định trong quá trình xử lý: {e}")
            finally:
                # 6. Xóa file tạm sau khi xử lý xong
                if temp_file_path and os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
                    print(f"  -> Đã xóa file tạm: {temp_file_path}")

    except psycopg2.Error as e:
        print(f"Lỗi kết nối hoặc thao tác với PostgreSQL: {e}")
    except Exception as e:
        print(f"Lỗi không mong muốn: {e}")
    finally:
        if db_conn:
            cursor.close()
            db_conn.close()
            print("\nĐã đóng kết nối PostgreSQL.")


if __name__ == "__main__":
    process_music_emotions()