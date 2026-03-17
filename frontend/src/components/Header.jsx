import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Video, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <header className="header glass">
      <div className="header-left flex items-center gap-4">
        <button className="icon-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <Link to="/" className="logo-link flex items-center gap-1">
          <div className="youtube-icon-bg">
            <div className="triangle"></div>
          </div>
          <span className="logo-text">YouTube</span>
        </Link>
      </div>

      <div className="header-center">
        <form className="search-form flex" onSubmit={handleSearch}>
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

      <div className="header-right flex items-center gap-3">
        {user ? (
          <>
            <button className="icon-btn hide-mobile">
              <Video size={24} />
            </button>
            <button className="icon-btn hide-mobile">
              <Bell size={24} />
            </button>
            <div className="user-menu relative">
              <button 
                className="avatar-btn" 
                onClick={() => {
                  if (user.channels && user.channels.length > 0) {
                    navigate(`/channel/${user.channels[0]}`);
                  } else {
                    navigate('/create-channel');
                  }
                }}
                title="Your Channel"
              >
                <img src={user.avatar} alt={user.username} className="avatar" />
              </button>
            </div>
            <button onClick={logout} className="icon-btn" title="Logout">
              <LogOut size={24} />
            </button>
          </>
        ) : (
          <Link to="/login" className="sign-in-btn flex items-center gap-2">
            <UserIcon size={20} />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
