# YouTube Clone Capstone

A full-stack YouTube clone built using the MERN stack (MongoDB, Express, React, Node.js). This project features a state-of-the-art dark mode UI, complete with video management, authentication, and commenting functionalities.

## Features
- **Modern UI**: Built with premium vanilla CSS featuring glassmorphism, responsive grids, and subtle animations.
- **Authentication**: JWT-based login and registration.
- **Video Viewing**: Watch videos, like/dislike, and a full comments section.
- **Channel Dashboard**: Create a channel, upload videos, edit video details, and delete videos.
- **Search & Filter**: Search videos by title globally from the header, and filter them by category on the home page.
- **Database Seeding**: A built-in seeder script to instantly populate the application with dummy videos and users.

## Prerequisites
- Node.js installed
- MongoDB installed locally, or a MongoDB URI for a cloud instance.

## Project Setup

### 1. Clone & Install Dependencies
1. Clone this repository to your local machine.
2. Open a terminal in the root directory and install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Open another terminal in the root directory and install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### 2. Configure Environment Variables
Inside the `backend` folder, the `.env` file should look like this:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/youtube_clone
JWT_SECRET=supersecretjwtkeythatshouldbechangedinproduction
```

### 3. Seed the Database
Before running the application, seed the database with sample users, channels, and videos to evaluate the features out-of-the-box.
```bash
cd backend
npm run data:import
```
This script creates dummy users (`john@example.com` / `password123`) and injects several videos matching to different channels.

### 4. Run the Application
1. Start the Backend server:
   ```bash
   cd backend
   npm start 
   # or npm run dev for nodemon
   ```
2. Start the Frontend Vite development server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

## File Structure & Tech Stack
- **/backend**: Express APIs, MongoDB Mongoose schema models, JWT auth middleware. Uses ES Modules (`import/export`).
- **/frontend**: React project created using Vite. Uses React Router for navigation, Context API for state management, Axios for API calls, and Lucide React for SVG icons.
