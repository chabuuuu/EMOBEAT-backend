import os
import pandas as pd
import psycopg2
from psycopg2 import pool
import redis
from collections import defaultdict
from surprise import Dataset, Reader
from dotenv import load_dotenv

# Tải các biến môi trường từ file .env
load_dotenv()

class MusicRecommendation:
    # Các thuộc tính để lưu trữ dữ liệu tải từ DB chính
    musicID_to_name = {}
    name_to_musicID = {}
    musicID_to_details = {}

    def __init__(self):
        """
        Khởi tạo các kết nối đến hai database và Redis.
        """
        # --- KẾT NỐI DATABASE CHÍNH (thông tin music, artist, genre...) ---
        try:
            self.main_db_pool = pool.SimpleConnectionPool(
                1, 10,
                host=os.getenv('DB_HOST'),
                database=os.getenv('DB_NAME'),
                user=os.getenv('DB_USERNAME'),
                password=os.getenv('DB_PASSWORD'),
                port=os.getenv('DB_PORT')
            )
            print("Main DB connection pool created successfully.")
        except psycopg2.OperationalError as e:
            print(f"Error creating main DB connection pool: {e}")
            self.main_db_pool = None

        # --- KẾT NỐI DATABASE CẢM XÚC (bảng emotion_collects) ---
        try:
            self.emotion_db_pool = pool.SimpleConnectionPool(
                1, 10,
                host=os.getenv('EMOTION_DB_HOST'),
                database=os.getenv('EMOTION_DB_NAME'),
                user=os.getenv('EMOTION_DB_USERNAME'),
                password=os.getenv('EMOTION_DB_PASSWORD'),
                port=os.getenv('EMOTION_DB_PORT')
            )
            print("Emotion DB connection pool created successfully.")
        except psycopg2.OperationalError as e:
            print(f"Error creating emotion DB connection pool: {e}")
            self.emotion_db_pool = None

        # --- KẾT NỐI REDIS ---
        try:
            self.redis_client = redis.StrictRedis(
                host=os.getenv("REDIS_HOST_NAME"),
                port=os.getenv("REDIS_PORT"),
                username=os.getenv("REDIS_USERNAME"),
                password=os.getenv("REDIS_PASSWORD"),
                ssl=True,
                decode_responses=True
            )
            self.redis_client.ping()
            print("Redis connection successful.")
        except redis.exceptions.ConnectionError as e:
            print(f"Error connecting to Redis: {e}")
            self.redis_client = None

    def loadMusicData(self):
        """
        Tải dữ liệu từ cả hai database.
        - Tải thông tin chi tiết bài hát từ DB chính.
        - Tải dữ liệu ratings từ DB cảm xúc và phân tách theo từng emotion.
        - Trả về một dictionary chứa các Dataset cho mỗi cảm xúc.
        """
        print("Loading music details from main database...")
        # --- BƯỚC 1: Tải thông tin chi tiết bài hát từ DB chính ---
        self.musicID_to_name = {}
        self.name_to_musicID = {}
        self.musicID_to_details = {}

        if not self.main_db_pool:
            print("Cannot load music details, main DB connection not available.")
            return {}

        connection = self.main_db_pool.getconn()
        cursor = connection.cursor()
        
        music_details_query = """
        SELECT
            m.id, m.name, m.nationality,
            ARRAY_AGG(DISTINCT ma.artist_id) FILTER (WHERE ma.artist_id IS NOT NULL),
            ARRAY_AGG(DISTINCT mc.category_id) FILTER (WHERE mc.category_id IS NOT NULL),
            ARRAY_AGG(DISTINCT mg.genre_id) FILTER (WHERE mg.genre_id IS NOT NULL),
            ARRAY_AGG(DISTINCT mp.period_id) FILTER (WHERE mp.period_id IS NOT NULL)
        FROM mucis m
        LEFT JOIN music_artists ma ON m.id = ma.music_id
        LEFT JOIN music_categories mc ON m.id = mc.music_id
        LEFT JOIN music_genres mg ON m.id = mg.music_id
        LEFT JOIN music_periods mp ON m.id = mp.music_id
        GROUP BY m.id, m.name, m.nationality;
        """
        try:
            cursor.execute(music_details_query)
            musics = cursor.fetchall()
            for row in musics:
                musicID, musicName, nationality, artist_ids, category_ids, genre_ids, period_ids = row
                self.musicID_to_name[musicID] = musicName
                self.name_to_musicID[musicName] = musicID
                self.musicID_to_details[musicID] = {
                    'nationality': nationality,
                    'artist_ids': artist_ids or [],
                    'category_ids': category_ids or [],
                    'genre_ids': genre_ids or [],
                    'period_ids': period_ids or []
                }
            print(f"Loaded details for {len(musics)} musics.")
        except psycopg2.Error as e:
            print(f"Error executing music details query: {e}")
        finally:
            cursor.close()
            self.main_db_pool.putconn(connection)

        print("Loading ratings data from emotion database...")
        # --- BƯỚC 2: Tải dữ liệu ratings từ DB cảm xúc ---
        if not self.emotion_db_pool:
            print("Cannot load ratings, emotion DB connection not available.")
            return {}
            
        emotion_connection = self.emotion_db_pool.getconn()
        cursor = emotion_connection.cursor()
        
        ratings_by_emotion = {}
        try:
            cursor.execute("SELECT user_id, music_id, score, emotion FROM emotion_collects")
            ratings = cursor.fetchall()
            print(f"Fetched {len(ratings)} rating entries from emotion_collects.")
            
            if not ratings:
                return {}

            ratings_df = pd.DataFrame(ratings, columns=['user_id', 'music_id', 'score', 'emotion'])
            ratings_df.dropna(subset=['score'], inplace=True)
            
            reader = Reader(rating_scale=(ratings_df['score'].min(), ratings_df['score'].max()))
            
            # Phân tách dataset theo từng emotion
            unique_emotions = ratings_df['emotion'].unique()
            for emotion_id in unique_emotions:
                emotion_df = ratings_df[ratings_df['emotion'] == emotion_id]
                dataset = Dataset.load_from_df(emotion_df[['user_id', 'music_id', 'score']], reader)
                ratings_by_emotion[emotion_id] = dataset
                print(f"Created dataset for emotion ID {emotion_id} with {len(emotion_df)} ratings.")

        except psycopg2.Error as e:
            print(f"Error fetching ratings from emotion DB: {e}")
        finally:
            cursor.close()
            self.emotion_db_pool.putconn(emotion_connection)
            
        return ratings_by_emotion

    # --- CÁC PHƯƠNG THỨC GETTER (Không thay đổi nhiều) ---
    def getMusicName(self, musicID): return self.musicID_to_name.get(musicID, "")
    def getMusicID(self, musicName): return self.name_to_musicID.get(musicName, 0)
    def getNationality(self, musicID): return self.musicID_to_details.get(musicID, {}).get('nationality', "")
    def getArtistIDs(self, musicID): return self.musicID_to_details.get(musicID, {}).get('artist_ids', [])
    def getCategoryIDs(self, musicID): return self.musicID_to_details.get(musicID, {}).get('category_ids', [])
    def getGenreIDs(self, musicID): return self.musicID_to_details.get(musicID, {}).get('genre_ids', [])
    def getPeriodIDs(self, musicID): return self.musicID_to_details.get(musicID, {}).get('period_ids', [])

    # --- CÁC PHƯƠNG THỨC TRUY VẤN ĐƯỢC CẬP NHẬT ---
    def getListenerRatings(self, listener_id, emotion):
        """Lấy danh sách (music_id, score) của một người nghe cho một cảm xúc cụ thể."""
        if not self.emotion_db_pool: return []
        userRatings = []
        connection = self.emotion_db_pool.getconn()
        cursor = connection.cursor()
        try:
            cursor.execute(
                "SELECT music_id, score FROM emotion_collects WHERE user_id = %s AND emotion = %s",
                (listener_id, emotion)
            )
            ratings = cursor.fetchall()
            for row in ratings:
                userRatings.append((row[0], float(row[1])))
        finally:
            cursor.close()
            self.emotion_db_pool.putconn(connection)
        return userRatings

    def getPopularityRanks(self, emotion):
        """Lấy xếp hạng phổ biến của các bài hát cho một cảm xúc cụ thể."""
        if not self.emotion_db_pool: return defaultdict(int)
        ratings = defaultdict(int)
        rankings = defaultdict(int)
        connection = self.emotion_db_pool.getconn()
        cursor = connection.cursor()
        try:
            cursor.execute(
                "SELECT music_id, COUNT(music_id) as count FROM emotion_collects WHERE emotion = %s GROUP BY music_id",
                (emotion,)
            )
            ratings_data = cursor.fetchall()
            for music_id, count in ratings_data:
                ratings[music_id] = count
            
            rank = 1
            for musicID, ratingCount in sorted(ratings.items(), key=lambda x: x[1], reverse=True):
                rankings[musicID] = rank
                rank += 1
        finally:
            cursor.close()
            self.emotion_db_pool.putconn(connection)
        return rankings

    def loadListeners(self):
        """Tải danh sách tất cả người nghe từ bảng emotion_collects."""
        if not self.emotion_db_pool: return []
        connection = self.emotion_db_pool.getconn()
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT DISTINCT user_id FROM emotion_collects")
            users = cursor.fetchall()
            return [user[0] for user in users]
        finally:
            cursor.close()
            self.emotion_db_pool.putconn(connection)

    # --- CÁC PHƯƠNG THỨC REDIS (Không thay đổi) ---
    def saveRecommendationsToRedis(self, listener_id, music_ids, emotion, ttl_seconds=86400):
        """Lưu gợi ý cho một người nghe với một cảm xúc cụ thể."""
        if not self.redis_client: return
        # Thêm emotion vào key để phân biệt
        key = f"recommendations:listener:{listener_id}:emotion:{emotion}"
        value = ",".join(map(str, music_ids))
        self.redis_client.set(key, value, ex=ttl_seconds)

    def saveAllRecommendationsToRedis(self, all_recommendations_by_emotion, ttl_seconds=86400):
        """
        Lưu tất cả gợi ý vào Redis.
        `all_recommendations_by_emotion` là một dict: {emotion_id: [(user_id, [music_ids]), ...]}
        """
        if not self.redis_client: return
        with self.redis_client.pipeline() as pipe:
            for emotion_id, recommendations in all_recommendations_by_emotion.items():
                for listener_id, music_ids in recommendations:
                    key = f"sonata_recommendations:listener:{listener_id}:emotion:{emotion_id}"
                    value = ",".join(map(str, music_ids))
                    pipe.set(key, value, ex=ttl_seconds)
            pipe.execute()
            print("Saved all recommendations to Redis.")

# --- VÍ DỤ SỬ DỤNG ---
if __name__ == "__main__":
    # Ánh xạ ID cảm xúc sang tên để dễ đọc
    # Bạn nên định nghĩa map này dựa trên hệ thống của mình
    emotion_map = {
        1: "neutral",
        2: "happy",
        3: "sad",
        # ... thêm các cảm xúc khác
    }

    music_rec = MusicRecommendation()
    
    # Tải dữ liệu, trả về dict các dataset theo emotion
    datasets_by_emotion = music_rec.loadMusicData()

    if datasets_by_emotion:
        print("\n--- Example Usage ---")
        
        # Chọn một cảm xúc để thử nghiệm
        example_emotion_id = 1 # Ví dụ: Happy
        print(f"\nTesting with Emotion: {emotion_map.get(example_emotion_id, 'Unknown')} (ID: {example_emotion_id})")

        # Lấy dataset cho cảm xúc đó
        happy_dataset = datasets_by_emotion.get(example_emotion_id)
        if happy_dataset:
            print("Dataset for 'Happy' emotion loaded successfully.")
            # (Tại đây bạn có thể đưa happy_dataset vào thuật toán Surprise để train)

        # Lấy xếp hạng phổ biến cho cảm xúc 'Happy'
        popularity_ranks_happy = music_rec.getPopularityRanks(emotion=example_emotion_id)
        print("Top 5 popular musics for 'Happy':", list(popularity_ranks_happy.items())[:5])

        # Lấy thông tin chi tiết của một bài hát (không phụ thuộc cảm xúc)
        example_music_id = 2
        print(f"Artist IDs for music ID {example_music_id}:", music_rec.getArtistIDs(example_music_id))
        
        # Lấy ratings của một người nghe cho cảm xúc 'Happy'
        example_listener_id = 1
        listener_ratings_happy = music_rec.getListenerRatings(listener_id=example_listener_id, emotion=example_emotion_id)
        print(f"Ratings for listener ID {example_listener_id} when 'Happy':", listener_ratings_happy)
        
        # Lấy danh sách tất cả người nghe
        all_listeners = music_rec.loadListeners()
        print(f"Total unique listeners found: {len(all_listeners)}")

    else:
        print("Could not load datasets. Please check database connections and data availability.")