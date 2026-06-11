import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, User, Bell, PlusSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleToggleNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.some(n => !n.isRead)) {
      try {
        await API.put('/notifications/read-all');
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="header">
      <div className="header-left">
        <Menu className="icon-btn" onClick={toggleSidebar} />
        <Link to="/" className="logo">
          <div className="logo-box">
             <PlaySquare color="white" fill="red" size={24} />
          </div>
          <span className="logo-text">YouTube</span>
          <span className="logo-country">IN</span>
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
            <div className="notification-bell-container" style={{ position: 'relative' }}>
              <Bell className="icon-btn" onClick={handleToggleNotifications} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#cc0000',
                  color: '#fff',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
              {showNotifications && (
                <div className="notifications-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#0f0f0f',
                  border: '1px solid #272727',
                  borderRadius: '12px',
                  padding: '12px',
                  zIndex: 100,
                  minWidth: '280px',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.5)',
                  marginTop: '8px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#f1f1f1', borderBottom: '1px solid #272727', paddingBottom: '6px' }}>Notifications</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {notifications.map(n => (
                      <li key={n.notificationId} style={{ 
                        padding: '8px', 
                        borderBottom: '1px solid #1f1f1f',
                        fontSize: '12px',
                        color: n.isRead ? '#888' : '#fff',
                        fontWeight: n.isRead ? 'normal' : 'bold'
                      }}>
                        {n.text}
                      </li>
                    ))}
                    {notifications.length === 0 && (
                      <li style={{ color: '#777', fontSize: '12px', padding: '12px 8px', textAlign: 'center' }}>No notifications.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
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
