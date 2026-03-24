import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  return (
    <div className="auth-wrapper">
      <div className="google-auth-card">
        <div className="logo-section">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="red"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><polygon points="10 8 16 12 10 16 10 8" fill="white" /></svg>
           <h2>Sign in</h2>
           <p>Continue to YouTube</p>
        </div>
        <form className="auth-form-refined" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email or phone" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="auth-footer">
            <Link to="/register" className="create-account-link">Create account</Link>
            <button type="submit" className="next-btn">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
