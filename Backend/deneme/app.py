import os
import re
import time
import requests
import mysql.connector
import google.generativeai as genai
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5173", "http://localhost:5173"])

# --- API KEY'LER ---
genai.configure(api_key="AIzaSyDhyZi0JrgYoYvkjO3WS4C6Ru8QbmHIyx8")
model = genai.GenerativeModel("models/gemini-1.5-flash-latest")

TMDB_API_KEY = "45c39b807f216578a180035495df545e"
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# --- KLASÖRLER ---
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'public', 'profil-fotolari')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- CACHE ---
CACHE_TTL = 60 * 60
series_cache = {"data": [], "timestamp": 0}
movies_cache = {"data": [], "timestamp": 0}
trailer_cache = {}

# --- UTILITY FONKSİYONLAR ---
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="fırat23",
        database="mynewdb",
        charset='utf8mb4'
    )

def tmdb_request(endpoint, params=None):
    if params is None:
        params = {}
    params['api_key'] = TMDB_API_KEY
    params['language'] = 'tr-TR'
    response = requests.get(f"{TMDB_BASE_URL}/{endpoint}", params=params)
    return response.json()

def fetch_youtube_scrape(query):
    if not query or query in trailer_cache:
        return trailer_cache.get(query)
    try:
        url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}+fragman"
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(url, headers=headers)
        matches = re.findall(r'"videoId":"([^"]{11})"', res.text)
        if matches:
            trailer_cache[query] = matches[0]
            return matches[0]
        return None
    except Exception as e:
        print("YouTube scraping hatası:", e)
        return None

# ------------------- TMDB -------------------
@app.route("/api/category/<string:type>")
def get_category(type):
    page = request.args.get("page", 1, type=int)
    sort_by = request.args.get("sort_by", "imdb")
    genre = request.args.get("genre")

    if type not in ["movie", "tv"]:
        return jsonify({"error": "Geçersiz kategori"}), 400

    tmdb_sort = "primary_release_date.desc" if (type == "movie" and sort_by == "year") else \
                "first_air_date.desc" if (type == "tv" and sort_by == "year") else "vote_average.desc"

    params = {"page": page, "sort_by": tmdb_sort, "vote_count.gte": 100}
    if genre:
        params["with_genres"] = genre

    page_data = tmdb_request(f"discover/{type}", params)
    results = page_data.get("results", [])
    for item in results:
        detail = tmdb_request(f"{type}/{item['id']}")
        if type == "movie":
            item['runtime'] = detail.get('runtime')
        else:
            item['number_of_seasons'] = detail.get('number_of_seasons')
        item['vote_average'] = detail.get('vote_average', item.get('vote_average', 0))

    return jsonify({
        "results": results,
        "page": page,
        "total_pages": page_data.get("total_pages", 1),
        "total_results": page_data.get("total_results", 0)
    })

@app.route("/api/<string:type>/<int:item_id>")
def get_detail(type, item_id):
    if type == "movie":
        tmdb_type = "movie"
    elif type in ("series", "tv"):
        tmdb_type = "tv"
    else:
        return jsonify({"error": "Geçersiz içerik türü"}), 400
    return jsonify(tmdb_request(f"{tmdb_type}/{item_id}"))

@app.route("/api/category/all")
def get_all_combined():
    page = request.args.get("page", 1, type=int)
    movie_data = tmdb_request("movie/popular", {"page": page})
    tv_data = tmdb_request("tv/popular", {"page": page})
    combined = (movie_data.get("results", []) + tv_data.get("results", []))[:20]
    return jsonify({"results": combined})

@app.route("/api/category-by-name")
def get_by_category_name():
    category_name = request.args.get("category_name")
    tab = request.args.get("tab", "all")
    page = request.args.get("page", 1, type=int)
    sort_by = request.args.get("sort_by", "imdb")

    if not category_name:
        return jsonify({"results": [], "error": "Kategori adı gerekli"}), 400

    def get_genre_id(content_type):
        genres = tmdb_request(f"genre/{content_type}/list").get("genres", [])
        for g in genres:
            if g["name"].lower() == category_name.lower():
                return g["id"]
        return None

    results = []
    tmdb_sort = "vote_average.desc" if sort_by == "imdb" else (
        "primary_release_date.desc" if tab == "movie" else "first_air_date.desc"
    )

    if tab in ("all", "movie"):
        gid = get_genre_id("movie")
        if gid:
            res = tmdb_request("discover/movie", {"with_genres": gid, "page": page, "sort_by": tmdb_sort, "vote_count.gte": 100})
            results += res.get("results", [])

    if tab in ("all", "tv"):
        gid = get_genre_id("tv")
        if gid:
            res = tmdb_request("discover/tv", {"with_genres": gid, "page": page, "sort_by": tmdb_sort, "vote_count.gte": 100})
            results += res.get("results", [])

    results = sorted(results, key=lambda x: x.get("vote_average", 0), reverse=True)[:20]
    return jsonify({"results": results})

@app.route("/api/series/genres")
def get_series_genres():
    return tmdb_request("genre/tv/list")

@app.route("/api/movies/genres")
def get_movie_genres():
    return tmdb_request("genre/movie/list")

@app.route("/trailer/<content_type>/<int:content_id>")
def get_trailer(content_type, content_id):
    try:
        data = tmdb_request(f"{content_type}/{content_id}/videos")
        trailers = [v for v in data.get("results", []) if v["type"] == "Trailer" and v["site"] == "YouTube"]
        if trailers:
            return jsonify({"key": trailers[0]["key"]})
        title_data = tmdb_request(f"{content_type}/{content_id}")
        title = title_data.get("title") or title_data.get("name")
        fallback_key = fetch_youtube_scrape(title)
        return jsonify({"key": fallback_key})
    except Exception as e:
        return jsonify({"key": None, "error": str(e)})

# ------------------- Kullanıcı -------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username, email, password = data.get('username'), data.get('email'), data.get('password')
    if not username or not email or not password:
        return jsonify({'success': False, 'message': 'Tüm alanlar zorunludur'}), 400
    hashed_pw = generate_password_hash(password)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO app_users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_pw))
        conn.commit()
        return jsonify({'success': True, 'message': 'Kayıt başarılı'})
    except mysql.connector.IntegrityError:
        return jsonify({'success': False, 'message': 'Bu email zaten kayıtlı'}), 409
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM app_users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user and check_password_hash(user['password'], password):
            return jsonify({'success': True, 'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'profileImage': user['profile_image']
            }})
        return jsonify({'success': False, 'message': 'Geçersiz email veya şifre'})
    finally:
        cursor.close()
        conn.close()

@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    user_id = data.get('id')
    new_username = data.get('username')
    new_email = data.get('email')
    if not user_id or not new_username or not new_email:
        return jsonify({'success': False, 'message': 'Tüm alanlar zorunludur'})
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE app_users SET username = %s, email = %s WHERE id = %s", (new_username, new_email, user_id))
        conn.commit()
        return jsonify({'success': True, 'message': 'Profil güncellendi'})
    finally:
        cursor.close()
        conn.close()

# ------------------- Fotoğraf -------------------
@app.route('/upload-profile-image', methods=['POST'])
def upload_profile_image():
    if 'file' not in request.files or 'user_id' not in request.form:
        return jsonify({'success': False, 'message': 'Dosya veya kullanıcı ID eksik'}), 400
    file = request.files['file']
    user_id = request.form['user_id']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'success': False, 'message': 'Geçersiz dosya'}), 400
    filename = secure_filename(f"user_{user_id}_" + file.filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(path)
    relative_path = f"/profil-fotolari/{filename}"
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE app_users SET profile_image = %s WHERE id = %s", (relative_path, user_id))
        conn.commit()
        return jsonify({'success': True, 'filename': filename})
    finally:
        cursor.close()
        conn.close()

@app.route('/update-profile-photo', methods=['POST'])
def update_profile_photo():
    user_id = request.form.get('id')
    file = request.files.get('photo')
    if not user_id or not file or not allowed_file(file.filename):
        return jsonify({'success': False, 'message': 'Eksik veya geçersiz dosya'}), 400
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"user_{user_id}.{ext}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    relative_path = f"/profil-fotolari/{filename}"
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE app_users SET profile_image = %s WHERE id = %s", (relative_path, user_id))
        conn.commit()
        return jsonify({'success': True, 'profileImage': relative_path})
    finally:
        cursor.close()
        conn.close()

@app.route('/profil-fotolari/<filename>')
def serve_profile_photo(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ------------------- Watchlist -------------------
@app.route('/watchlist/add', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT IGNORE INTO watchlist (user_id, content_id, content_type) VALUES (%s, %s, %s)",
                   (data['user_id'], data['content_id'], data['content_type']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/watchlist/remove', methods=['POST'])
def remove_from_watchlist():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM watchlist WHERE user_id = %s AND content_id = %s AND content_type = %s",
                   (data['user_id'], data['content_id'], data['content_type']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True})

@app.route('/watchlist/<int:user_id>')
def get_watchlist(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT content_id, content_type FROM watchlist WHERE user_id = %s", (user_id,))
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'watchlist': items})

# ------------------- Gemini Chat -------------------
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '')
    if not message:
        return jsonify({'success': False, 'message': 'Mesaj boş olamaz'})
    try:
        response = model.generate_content(message)
        return jsonify({'success': True, 'reply': response.text})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

# ------------------- RUN -------------------
@app.route('/search')
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({'results': []})

    try:
        # Film ve dizi aramasını ayrı ayrı yap
        movie_results = tmdb_request('search/movie', {'query': query})
        tv_results = tmdb_request('search/tv', {'query': query})
        results = []

        # Filmleri ekle
        for movie in movie_results.get('results', []):
            results.append({
                'id': movie['id'],
                'title': movie.get('title'),
                'name': movie.get('title'),
                'poster_path': movie.get('poster_path'),
                'media_type': 'movie',
                'release_date': movie.get('release_date'),
                'vote_average': movie.get('vote_average')
            })

        # Dizileri ekle
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

        # Puan ve tarihe göre sırala (önce yüksek puanlılar)
        results.sort(key=lambda x: (x.get('vote_average', 0), x.get('release_date', '')), reverse=True)

        return jsonify({'success': True, 'results': results[:20]})
    except Exception as e:
        print("Arama hatası:", e)
        return jsonify({'success': False, 'message': str(e), 'results': []})

#Yorum ve Puanlama Kısmı

@app.route('/reviews/add', methods=['POST'])
def add_review():
    data = request.get_json()
    user_id = data.get('user_id')
    content_id = data.get('content_id')
    content_type = data.get('content_type')
    rating = data.get('rating')
    comment = data.get('comment', '')

    if not all([user_id, content_id, content_type, rating is not None]):
        return jsonify({'success': False, 'message': 'Eksik bilgi'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO reviews (user_id, content_id, content_type, rating, comment)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, content_id, content_type, rating, comment))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'message': 'Yorum eklendi'})
@app.route('/reviews/<content_type>/<int:content_id>', methods=['GET'])
def get_reviews(content_type, content_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT r.*, u.username, u.profile_image
        FROM reviews r
        JOIN app_users u ON r.user_id = u.id
        WHERE r.content_type = %s AND r.content_id = %s
        ORDER BY r.created_at DESC
    """, (content_type, content_id))
    reviews = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'reviews': reviews})
@app.route('/reviews/update/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    data = request.get_json()
    rating = data.get('rating')
    comment = data.get('comment')

    if rating is None and comment is None:
        return jsonify({'success': False, 'message': 'Güncellenecek bilgi yok'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE reviews
        SET rating = %s, comment = %s
        WHERE id = %s
    """, (rating, comment, review_id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'message': 'Yorum güncellendi'})
@app.route('/reviews/delete/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM reviews WHERE id = %s", (review_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'message': 'Yorum silindi'})
@app.route('/reviews/user/<int:user_id>', methods=['GET'])
def get_reviews_by_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT r.*, u.username, u.profile_image
        FROM reviews r
        JOIN app_users u ON r.user_id = u.id
        WHERE r.user_id = %s
        ORDER BY r.created_at DESC
    """, (user_id,))
    reviews = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'reviews': reviews})

# yorumları listemek için
@app.route('/user/reviews/<int:user_id>', methods=['GET'])
def get_user_reviews(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, content_id, content_type, rating, comment, created_at
        FROM reviews
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id,))
    reviews = cursor.fetchall()
    cursor.close()
    conn.close()

    enriched_reviews = []
    for review in reviews:
        tmdb_type = 'movie' if review['content_type'] == 'movie' else 'tv'
        tmdb_url = f"https://api.themoviedb.org/3/{tmdb_type}/{review['content_id']}?api_key={TMDB_API_KEY}&language=tr-TR"
        try:
            tmdb_response = requests.get(tmdb_url).json()
            review['title'] = tmdb_response.get('title') or tmdb_response.get('name')
            review['poster_path'] = tmdb_response.get('poster_path')
        except:
            review['title'] = 'Bilinmeyen İçerik'
            review['poster_path'] = None
        enriched_reviews.append(review)

    return jsonify({'success': True, 'reviews': enriched_reviews})


if __name__ == '__main__':
    app.run(debug=True)