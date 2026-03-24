import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(username, email, password);
    if (success) navigate('/login');
  };

  return (
    <div className="auth-wrapper">
      <div className="google-auth-card">
        <div className="logo-section">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="red"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><polygon points="10 8 16 12 10 16 10 8" fill="white" /></svg>
           <h2>Create a Google Account</h2>
           <p>Enter your details to join YouTube</p>
        </div>
        <form className="auth-form-refined" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Name" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="auth-footer">
            <Link to="/login" className="create-account-link">Sign in instead</Link>
            <button type="submit" className="next-btn">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
