<div align="center">

# Investosophy 📈

### Investment Learning & Portfolio Tracker for Investors

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🚀 About

Investosophy is a **free, open-source** investment learning and portfolio tracking web app built specifically for **Investors**. Track NSE/BSE stocks, learn investing concepts, and plan your financial goals — all in one place.

---

## ✨ Features

- 📊 **Live Market Data** — Real-time Nifty 50, Sensex, Bank Nifty
- 🔍 **Stock Search** — Search any NSE/BSE stock instantly
- 🔥 **Top Movers** — Daily gainers and losers
- 💼 **Portfolio Tracker** — Track holdings with live P&L
- ⭐ **Watchlist** — Monitor your favourite stocks
- 🧮 **Calculators** — SIP, Lumpsum, Goal Planner, FD vs SIP, ELSS
- 🎓 **Learn** — Personalized content based on experience level
- 🌙 **Dark/Light Theme** — Easy on the eyes
- 📱 **Mobile Responsive** — Works on all devices

---

## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React + Vite | Python FastAPI |
| Tailwind CSS | yfinance |
| Recharts | uvicorn |
| React Router | pandas |
| Axios | |

---

## 🏃 Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` 🚀

---

## 🌐 Deploy

- **Backend** → [Render.com](https://render.com) (free)
- **Frontend** → [Vercel](https://vercel.com) (free)

---

## 📁 Project Structure
investosophy/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── render.yaml
└── frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   └── pages/
└── ...
