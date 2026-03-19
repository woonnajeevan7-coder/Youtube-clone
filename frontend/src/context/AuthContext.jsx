// AuthContext.jsx
// Provides global authentication state to the entire app.
// Exposes: { user, loading, login, register, logout }
//
// How it works:
//  - On mount, it calls /api/auth/profile to restore session from cookie.
//  - login()    → POST credentials, sets user state on success.
//  - register() → POST new account details, redirects user to login on success.
//  - logout()   → POST to invalidate the server-side cookie, clears user state.

import { createContext, useState, useEffect } from 'react';
import axios from '../axios';
import { toast } from 'react-toastify';

// Create the context object — consumed by any component via useContext(AuthContext)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Currently logged-in user object (or null)
  const [loading, setLoading] = useState(true); // True while checking auth status on initial load

  // ─── Restore session on app load ─────────────────────────────────────────
  // Check if the user is already logged in (cookie-based session)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/auth/profile');
        setUser(data); // Session is active — populate user
      } catch (error) {
        // 401 Unauthorized: no active session, user stays null
        setUser(null);
      } finally {
        setLoading(false); // Auth check complete, app can now render
      }
    };
    
    fetchProfile();
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────
  // Sends email + password, receives user data + sets httpOnly auth cookie
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      toast.success('Logged in successfully!');
      return true; // Signal success to the Login page for navigation
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  // Creates a new account; does NOT log the user in automatically
  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { username, email, password });
      toast.success('Registration successful. Please login!');
      return true; // Signal success to redirect to /login
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  // Calls the backend to clear the auth cookie, then resets user state
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    // Provide user state and auth functions to all child components
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
