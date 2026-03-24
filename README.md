# YouTube Clone Capstone Project (MERN Stack)

A professional, full-featured YouTube clone built with the MERN stack for the Internshala Capstone Project.

## 🚀 Features

### Front-End (React + Vite)
- **Home Page**: Responsive video grid, YouTube-style header, toggleable sidebar, and category filters (7 categories).
- **Authentication**: Secure JWT-based registration and login with input validation and auto-redirect.
- **Video Player**: High-quality video playback, interactive like/dislike buttons, and comprehensive comment management (CRUD).
- **Channel Page**: Dedicated space for creators to manage their videos (Full CRUD: Upload, View, Delete).
- **Search & Filter**: Real-time searching by video title and category-based filtering.
- **Refined UX**: Toast notifications, loading states, and a premium dark-mode aesthetic.

### Back-End (Node.js + Express)
- **RESTful API**: Clean route design for users, videos, comments, and channels.
- **ES Modules**: Modern `import`/`export` syntax used throughout.
- **Security**: Password hashing with Bcrypt and protected routes via JWT middleware.
- **Database**: MongoDB (Mongoose) with optimized schemas for relational data.

## 🛠️ Tech Stack
- **Frontend**: React, React Router, Axios, Lucide-React, React-Toastify.
- **Backend**: Node.js, Express.js, JWT, Bcrypt.js.
- **Database**: MongoDB (Local or Atlas compatible).

## 📦 Project Structure
```text
/client   - React Vite Frontend
/server   - Node.js Express Backend
README.md - Main Documentation
```

## ⚙️ Setup & Usage

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or an Atlas URI)

### 2. Backend Installation (`/server`)
1. `cd server`
2. `npm install`
3. Create `.env` with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Seed the database: `node seed.js` (Creates 10 rubric-compliant videos and users).
5. Start server: `npm run dev`.

### 3. Frontend Installation (`/client`)
1. `cd client`
2. `npm install --legacy-peer-deps`
3. Create `.env` with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start client: `npm run dev`.

## 📜 Rubric Compliance
- [x] ES Modules Used.
- [x] Vite Framework used (No CRA).
- [x] Full CRUD for Comments and Videos.
- [x] JWT Authentication implemented.
- [x] Responsive layout for all devices.
