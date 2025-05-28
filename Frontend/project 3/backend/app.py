from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import requests
import re
import mysql.connector

app = Flask(__name__)
CORS(app)

# Veritabanı bağlantısı
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="fırat23",
        database="mynewdb",
        charset='utf8mb4'
    )

# Veritabanı tablosunu oluştur
# def init_db():
#     conn = get_db_connection()
#     conn.execute('''
#         CREATE TABLE IF NOT EXISTS watchlist (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             user_id INTEGER NOT NULL,
#             content_id INTEGER NOT NULL,
#             content_type TEXT NOT NULL,
#             UNIQUE(user_id, content_id, content_type)
#         )
#     ''')
    
#     conn.execute('''
#         CREATE TABLE IF NOT EXISTS movies (
#             id INTEGER PRIMARY KEY,
#             title TEXT NOT NULL,
#             poster_path TEXT,
#             release_date TEXT,
#             vote_average REAL
#         )
#     ''')
    
#     conn.execute('''
#         CREATE TABLE IF NOT EXISTS series (
#             id INTEGER PRIMARY KEY,
#             title TEXT NOT NULL,
#             poster_path TEXT,
#             release_date TEXT,
#             vote_average REAL
#         )
#     ''')
    
#     conn.execute('''
#         CREATE TABLE IF NOT EXISTS reviews (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             user_id INTEGER NOT NULL,
#             content_id INTEGER NOT NULL,
#             content_type TEXT NOT NULL,
#             rating INTEGER NOT NULL,
#             comment TEXT,
#             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#             FOREIGN KEY (user_id) REFERENCES users(id),
#             UNIQUE(user_id, content_id, content_type)
#         )
#     ''
#     conn.commit()
#     conn.close()

# Veritabanını başlat
# init_db()

@app.route('/watchlist/add', methods=['POST'])
def add_to_watchlist():
    data = request.json
    user_id = data.get('user_id')
    content_id = data.get('content_id')
    content_type = data.get('content_type')

    if not all([user_id, content_id, content_type]):
        return jsonify({'success': False, 'message': 'Eksik parametreler'}), 400

    try:
        conn = get_db_connection()
        conn.execute(
            'INSERT INTO watchlist (user_id, content_id, content_type) VALUES (?, ?, ?)',
            (user_id, content_id, content_type)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'İzleme listesine eklendi'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Bu içerik zaten izleme listenizde'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/watchlist/remove', methods=['POST'])
def remove_from_watchlist():
    data = request.json
    user_id = data.get('user_id')
    content_id = data.get('content_id')
    content_type = data.get('content_type')

    if not all([user_id, content_id, content_type]):
        return jsonify({'success': False, 'message': 'Eksik parametreler'}), 400

    try:
        conn = get_db_connection()
        conn.execute(
            'DELETE FROM watchlist WHERE user_id = ? AND content_id = ? AND content_type = ?',
            (user_id, content_id, content_type)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'İzleme listesinden çıkarıldı'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/watchlist/<int:user_id>', methods=['GET'])
def get_watchlist(user_id):
    try:
        conn = get_db_connection()
        watchlist = conn.execute(
            'SELECT * FROM watchlist WHERE user_id = ?',
            (user_id,)
        ).fetchall()
        conn.close()
        
        return jsonify({
            'success': True,
            'watchlist': [dict(item) for item in watchlist]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

def fetch_youtube_scrape(query):
    if not query:
        return None
    if query in trailer_cache:
        return trailer_cache[query]

    try:
        # Daha spesifik arama yap
        search_query = f"{query} official trailer"
        url = f"https://www.youtube.com/results?search_query={search_query.replace(' ', '+')}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            return None

        html = response.text
        # Daha güvenilir regex pattern
        matches = re.findall(r'"videoId":"([^"]{11})"', html)
        if matches:
            video_id = matches[0]
            trailer_cache[query] = video_id
            return video_id
        return None
    except Exception as e:
        print("YouTube scraping hatası:", e)
        return None

@app.route('/trailer/<content_type>/<int:content_id>', methods=['GET'])
def get_trailer(content_type, content_id):
    try:
        # TMDB'den fragman al
        url = f"{TMDB_BASE_URL}/{content_type}/{content_id}/videos"
        params = {
            'api_key': TMDB_API_KEY,
            'language': 'tr-TR',
            'include_video_language': 'tr,en'  # Türkçe ve İngilizce fragmanları dahil et
        }
        response = requests.get(url, params=params)
        data = response.json()
        
        # Önce Türkçe fragman ara
        trailers = [video for video in data['results'] 
                   if video['type'] == 'Trailer' 
                   and video['site'] == 'YouTube'
                   and video.get('iso_639_1') == 'tr']
        
        # Türkçe fragman yoksa İngilizce fragman ara
        if not trailers:
            trailers = [video for video in data['results'] 
                       if video['type'] == 'Trailer' 
                       and video['site'] == 'YouTube']
        
        if trailers:
            return jsonify({'key': trailers[0]['key']})
            
        # TMDB'de fragman bulunamazsa, içerik başlığını al ve YouTube'dan ara
        content_url = f"{TMDB_BASE_URL}/{content_type}/{content_id}"
        content_response = requests.get(content_url, params={'api_key': TMDB_API_KEY, 'language': 'tr-TR'})
        content_data = content_response.json()
        title = content_data.get('title') or content_data.get('name')
        
        if title:
            youtube_url = fetch_youtube_scrape(f"{title} fragman")
            if youtube_url:
                return jsonify({'key': youtube_url})
                
        return jsonify({'key': None})
        
    except Exception as e:
        print(f"Fragman alımı hatası: {str(e)}")
        return jsonify({'key': None})

@app.route('/search')
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({'results': []})

    try:
        # Film ve dizi araması
        movie_results = tmdb_request('search/movie', {'query': query})
        tv_results = tmdb_request('search/tv', {'query': query})

        # Sonuçları birleştir ve formatla
        results = []
        
        # Film sonuçlarını ekle
        for movie in movie_results.get('results', []):
            results.append({
                'id': movie['id'],
                'title': movie.get('title'),
                'name': movie.get('title'),  # Film için title'ı name olarak da ekle
                'poster_path': movie.get('poster_path'),
                'media_type': 'movie',
                'release_date': movie.get('release_date'),
                'vote_average': movie.get('vote_average')
            })

        # Dizi sonuçlarını ekle
        for tv in tv_results.get('results', []):
            results.append({
                'id': tv['id'],
                'title': tv.get('name'),
                'name': tv.get('name'),
                'poster_path': tv.get('poster_path'),
                'media_type': 'tv',
                'release_date': tv.get('first_air_date'),
                'vote_average': tv.get('vote_average')
            })

        # Sonuçları puan ve tarihe göre sırala
        results.sort(key=lambda x: (x.get('vote_average', 0), x.get('release_date', '')), reverse=True)

        return jsonify({
            'success': True,
            'results': results[:20]  # İlk 20 sonucu döndür
        })

    except Exception as e:
        print(f"Arama hatası: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Arama sırasında bir hata oluştu',
            'results': []
        })

@app.route('/reviews/<int:user_id>', methods=['GET'])
def get_user_reviews(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True) # Sonuçları dictionary olarak almak için

        # Film yorumlarını çek
        cursor.execute("""
            SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                'movie' as content_type,
                m.title as movie_title
            FROM reviews r
            JOIN movies m ON r.content_id = m.id
            WHERE r.user_id = %s AND r.content_type = 'movie'
            ORDER BY r.created_at DESC
        """, (user_id,))
        movie_reviews = cursor.fetchall()

        # Dizi yorumlarını çek
        cursor.execute("""
            SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,
                'tv' as content_type,
                s.title as series_title
            FROM reviews r
            JOIN series s ON r.content_id = s.id
            WHERE r.user_id = %s AND r.content_type = 'tv'
            ORDER BY r.created_at DESC
        """, (user_id,))
        series_reviews = cursor.fetchall()

        # Tüm yorumları birleştir
        all_reviews = movie_reviews + series_reviews

        # Tarihe göre sırala (en yeniden en eskiye) - Zaten SQL sorgusunda yapılıyor ama emin olmak için tekrar yapabiliriz
        all_reviews.sort(key=lambda x: x['created_at'], reverse=True)

        cursor.close()
        conn.close()
        return jsonify({
            'success': True,
            'reviews': all_reviews
        })

    except Exception as e:
        print(f"Hata: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Yorumlar alınırken bir hata oluştu'
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 