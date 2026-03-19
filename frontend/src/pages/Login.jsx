// Login.jsx
// Authentication page for existing users.
// On submit: calls login() from AuthContext → navigates to Home on success.
// Uses Login.css for styling (shared with Register).

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');       // Controlled email field
  const [password, setPassword] = useState(''); // Controlled password field
  const { login } = useContext(AuthContext);     // Auth login action from context
  const navigate = useNavigate();

  // ─── Form submit handler ──────────────────────────────────────────────────
  // Delegates to the AuthContext login function;
  // navigates to the home page only if login succeeds.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      {/* Glassmorphism card wrapping the form */}
      <div className="auth-card glass">
        <h2 className="auth-title">Welcome Back</h2>

        {/* ── Login form ──────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email field */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>

        {/* Link to registration page for new users */}
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
