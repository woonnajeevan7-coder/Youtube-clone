import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Video, User, Bell, PlusSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Menu className="icon-btn" onClick={toggleSidebar} />
        <Link to="/" className="logo">
          <div className="logo-box">
             <PlaySquare color="white" fill="red" size={24} />
          </div>
          <span className="logo-text">YouTube</span>
        </Link>
      </div>

      <div className="header-center">
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <Search size={20} />
          </button>
        </form>
      </div>

      <div className="header-right">
        {user ? (
          <div className="user-section">
            <PlusSquare className="icon-btn" onClick={() => navigate('/channel/create')} />
            <Bell className="icon-btn" />
            <div className="user-profile">
              <img src={user.avatar} alt="avatar" className="avatar-small" />
              <span className="username-display">{user.username}</span>
              <button className="logout-link" onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="auth-btn sign-in">
            <div className="sign-in-content">
              <User size={20} />
              <span>Sign In</span>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

const PlaySquare = ({ color, fill, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <polygon points="10 8 16 12 10 16 10 8" fill="white" stroke="white" />
  </svg>
);

export default Header;
