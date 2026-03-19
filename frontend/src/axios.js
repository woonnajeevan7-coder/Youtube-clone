// axios.js
// Configures a shared Axios instance used throughout the app.
// - baseURL points to the Express backend running on port 5000.
// - withCredentials: true ensures cookies (auth tokens) are sent with every request,
//   which is required for the cookie-based JWT authentication to work.

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  withCredentials: true, // Send cookies (JWT) with every request
});

export default instance;
