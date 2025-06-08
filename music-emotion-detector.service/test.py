import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
import librosa
import os
import joblib

# Định nghĩa hàm ánh xạ valence và arousal sang nhãn cảm xúc
def map_to_emotion(valence, arousal):
    # Các điều kiện cụ thể và năng lượng cao nhất nên được ưu tiên
    if valence > 5 and arousal > 7:
        return 'ENERGY'  # Năng lượng cao, vui vẻ (VD: Rock, Dance)
    elif valence > 5 and arousal > 5:
        return 'HAPPY'   # Vui vẻ, tích cực (VD: Pop)
    elif valence > 5 and 3 < arousal < 7:
        return 'ROMANTIC'# Lãng mạn, dễ chịu (VD: Ballad, R&B)
    elif 3 < valence < 7 and arousal < 3:
        return 'CHILL'   # Thư giãn, yên tĩnh (VD: Lofi, Acoustic)
    elif valence < 5 and arousal < 5:
        return 'SAD'     # Buồn, trầm lắng (VD: Ballad buồn)
    else:
        return 'OTHER'   # Các thể loại khác không rõ ràng

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

# Chuẩn bị dữ liệu huấn luyện
def prepare_training_data(annotation_path, audio_dir, feature_save_dir="/media/haphuthinh/Data/Workspace/UIT/DO_AN_2/MusicEmotionDetection/TrainedModel/random_forest_regressor"):
    # Tạo thư mục lưu đặc trưng nếu chưa tồn tại
    if not os.path.exists(feature_save_dir):
        os.makedirs(feature_save_dir)
    
    # Đường dẫn file lưu đặc trưng
    features_file = os.path.join(feature_save_dir, "features.npy")
    valence_file = os.path.join(feature_save_dir, "valence.npy")
    arousal_file = os.path.join(feature_save_dir, "arousal.npy")

    # Kiểm tra xem các file đặc trưng đã tồn tại chưa
    if (os.path.exists(features_file) and 
        os.path.exists(valence_file) and 
        os.path.exists(arousal_file)):
        print("Tải các đặc trưng đã lưu trước đó...")
        X = np.load(features_file)
        y_valence = np.load(valence_file)
        y_arousal = np.load(arousal_file)
        print(f"Đã tải: {X.shape[0]} mẫu")
        return X, y_valence, y_arousal

    # Nếu chưa có file đặc trưng, tiến hành trích xuất
    annotations = pd.read_csv(annotation_path)
    annotations.columns = annotations.columns.str.strip()

    X = []
    y_valence = []
    y_arousal = []

    for index, row in annotations.iterrows():
        if (index + 1) % 10 == 0:
            print(f"Đang xử lý bài hát {index + 1}/{len(annotations)}: {row['song_id']}")

        song_id = row['song_id']
        mp3_path = os.path.join(audio_dir, f"{int(song_id)}.mp3")
        if os.path.exists(mp3_path):
            features = extract_features_from_mp3(mp3_path)
            if features is not None:
                X.append(features)
                y_valence.append(row['valence_mean'])
                y_arousal.append(row['arousal_mean'])
        else:
            print(f"File not found: {mp3_path}")

    # Chuyển thành numpy array
    X = np.array(X)
    y_valence = np.array(y_valence)
    y_arousal = np.array(y_arousal)

    # Lưu đặc trưng
    print("Lưu đặc trưng đã trích xuất...")
    np.save(features_file, X)
    np.save(valence_file, y_valence)
    np.save(arousal_file, y_arousal)
    
    print(f"Đã lưu: {X.shape[0]} mẫu")
    return X, y_valence, y_arousal

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

# Tải mô hình và scaler để sử dụng
model_valence = joblib.load('./TrainedModel/random_forest_regressor/random_forest_valence_model.pkl')
model_arousal = joblib.load('./TrainedModel/random_forest_regressor/random_forest_arousal_model.pkl')
scaler = joblib.load('./TrainedModel/random_forest_regressor/random_forest_scaler.pkl')

mp3_path = "./TestSong/BuonCuaAnh-KICMDatGMasew-9213751.mp3"
if os.path.exists(mp3_path):
    print("Đang phân tích bài hát...")
    predicted_emotion, valence, arousal = predict_emotion(mp3_path, model_valence, model_arousal, scaler)
    print(f"Cảm xúc dự đoán của bài hát là: {predicted_emotion} (valence: {valence}, arousal: {arousal})")
else:
    print("Đường dẫn không hợp lệ, vui lòng kiểm tra lại!")