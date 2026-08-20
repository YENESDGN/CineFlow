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

![Image](https://github.com/user-attachments/assets/da489cac-b121-4dd2-bf30-9023c1b05cde)

![Image](https://github.com/user-attachments/assets/a05b96e4-dabd-4a85-a7e9-7d949b442dce)

![Image](https://github.com/user-attachments/assets/d778fcab-2abd-431f-b527-600d693201d3)

![Image](https://github.com/user-attachments/assets/653d2d1a-c7cc-4033-9bed-336f310a7845)

![Image](https://github.com/user-attachments/assets/55876996-4fd4-4c1b-98e3-8c75caff56d6)

![Image](https://github.com/user-attachments/assets/a1a73c78-5e83-4818-a8b2-93a4c828705b)

![Image](https://github.com/user-attachments/assets/fe576326-ebdd-4929-9063-cdb81d8bd0dd)

![Image](https://github.com/user-attachments/assets/ee71919a-3df5-408d-9b64-c7599b26a82c)

![Image](https://github.com/user-attachments/assets/2af65aea-c0d6-456e-bc29-d43b2acf7296)

![Image](https://github.com/user-attachments/assets/d60b765d-b934-40ab-be83-71283a4c7c8c)

![Image](https://github.com/user-attachments/assets/64ae805c-8869-4249-b28d-830617599df5)

![Image](https://github.com/user-attachments/assets/1e2c7d52-a4df-41e9-812f-6a19a223b24d)

![Image](https://github.com/user-attachments/assets/3c1400b0-179b-4efb-9731-5cc115bd9c8c)
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
