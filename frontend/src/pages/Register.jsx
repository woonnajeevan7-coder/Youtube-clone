// Register.jsx
// New user registration page.
// On submit: validates password length, calls register() from AuthContext,
// then redirects to /login on success.
// Reuses Login.css for form styling.

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css'; // Reusing login styles — same card/form design

const Register = () => {
  const [username, setUsername] = useState(''); // Controlled username field
  const [email, setEmail] = useState('');       // Controlled email field
  const [password, setPassword] = useState(''); // Controlled password field
  const { register } = useContext(AuthContext);  // Auth register action from context
  const navigate = useNavigate();

  // ─── Form submit handler ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation: enforce minimum password length before hitting the API
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Call the register function from AuthContext
    const success = await register(username, email, password);
    if (success) {
      navigate('/login'); // Redirect to login page after successful registration
    }
  };

  return (
    <div className="auth-container">
      {/* Glassmorphism card wrapping the form */}
      <div className="auth-card glass">
        <h2 className="auth-title">Create Account</h2>

        {/* ── Registration form ───────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username field */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">Sign Up</button>
        </form>

        {/* Link back to login for users who already have an account */}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
