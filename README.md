# 🎬 CineFlow

CineFlow, dizi ve filmleri listeleyip incelemeler yapabileceğiniz, modern teknolojilerle geliştirilmiş bir **tam-yığın (Full-Stack) uygulama**dır.  
Frontend tarafında **Vite + React + TypeScript + TailwindCSS**, backend tarafında ise **Python (Flask veya FastAPI)** kullanılmaktadır.  

---

## 🚀 Özellikler
- 📌 Dizi ve filmleri listeleme  
- ⭐ İnceleme ve değerlendirme yapabilme  
- 👤 Profil fotoğrafı yükleme desteği  
- 🔑 Ortam değişkenleri ile güvenli yapılandırma  
- ⚡ Hızlı geliştirme için Vite + React + TailwindCSS  
- 🛠 Backend için Flask veya FastAPI desteği  

---

## 📂 Klasör Yapısı

```

Backend/
deneme/
app.py
public/
profil-fotolari/
Frontend/
CineFlow/
src/
public/
profil-fotolari/
package.json
vite.config.ts

````

---

## 🛠 Gereksinimler

- Node.js 18+ ve npm  
- Python 3.10+ (önerilen 3.11+)  
- Git  

---

## ⚡ Kurulum ve Çalıştırma

### 🔹 Frontend (Vite + React)

```bash
cd "Frontend/CineFlow"
npm ci  # yoksa: npm install
npm run dev
````

* Geliştirme sunucusu: varsayılan `http://localhost:5173`

---

### 🔹 Backend (Python)

> Not: `Backend/deneme/app.py` dosyasını inceleyin.
> Gereken bağımlılıklar şimdilik manuel kurulmalıdır (örn. Flask veya FastAPI).
> İleride `requirements.txt` dosyası eklenecektir.

```bash
cd Backend/deneme
# Sanal ortam (Windows PowerShell)
python -m venv .venv
.venv/Scripts/Activate.ps1

# Örnek (Flask için):
# pip install flask
# $env:FLASK_APP = "app.py"
# flask run

python app.py  # app.py doğrudan çalışıyorsa
```

---

## 🛣 Yol Haritası

* [ ] Kullanıcı kimlik doğrulama (JWT / OAuth)
* [ ] Yorum ve puanlama sistemi
* [ ] IMDB / TMDB API entegrasyonu
* [ ] Mobil sürüm (React Native)

---

## 🤝 Katkı

Katkıda bulunmak isteyenler lütfen **fork** ederek geliştirme yapabilir, ardından **pull request** gönderebilir veya **issue** açabilir.

---

## 📦 GitHub’a Yükleme

1. GitHub’da boş bir repo oluşturun (README olmadan).
2. Proje kök dizininde şu komutları çalıştırın:

```bash
git init -b main
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/<kullanici-adiniz>/<repo-adi>.git
git push -u origin main
```

---

## 📜 Lisans

Bu proje **MIT Lisansı** ile sunulmaktadır. Ayrıntılar için `LICENSE` dosyasına bakınız.

---

```

---

Bu hali:  
✅ Daha göze hitap ediyor (emoji ve bölümlerle),  
✅ Özellikleri listeliyor,  
✅ Yol haritası eklenmiş,  
✅ Katkı bölümü var,  
✅ Açıklama daha akıcı.  

---

İstiyorsan sana bunu **dosya halinde (README.md)** oluşturup verebilirim, direkt klasörüne koyabilirsin. İster misin?
```
