// Header.jsx
// Top navigation bar rendered on every page.
// Sections:
//   LEFT  — Hamburger sidebar toggle + YouTube logo/home link
//   CENTER — Search form (navigates to /?search=<term> on submit)
//   RIGHT  — Authenticated: upload icon, bell, avatar (→channel), logout
//            Unauthenticated: "Sign in" link
// Props:
//   - toggleSidebar: function called when the menu icon is clicked

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Video, Bell, User as UserIcon, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState(''); // Controlled value for the search input
  const { user, logout } = useContext(AuthContext);  // Auth state and logout action
  const navigate = useNavigate();

  // ─── Search handler ───────────────────────────────────────────────────────
  // Redirects to the home page with a ?search= query param, triggering the Home
  // component to filter videos by the search term.
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <header className="header glass">
      {/* ── Left section: hamburger menu + logo ───────────────────────────── */}
      <div className="header-left flex items-center gap-4">
        {/* Hamburger button — collapses/expands the sidebar */}
        <button className="icon-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        {/* Logo — clicking navigates back to the home page */}
        <Link to="/" className="logo-link flex items-center gap-1">
          <div className="youtube-icon-bg">
            <div className="triangle"></div> {/* CSS-drawn play triangle */}
          </div>
          <span className="logo-text">YouTube</span>
        </Link>
      </div>

      {/* ── Center section: search bar ────────────────────────────────────── */}
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

      {/* ── Right section: user actions ───────────────────────────────────── */}
      <div className="header-right flex items-center gap-3">
        {user ? (
          <>
            {/* Upload and Notifications icons (hidden on mobile) */}
            <button className="icon-btn hide-mobile">
              <Video size={24} />
            </button>
            <button className="icon-btn hide-mobile">
              <Bell size={24} />
            </button>

            {/* Avatar button — navigates to the user's channel or create-channel page */}
            <div className="user-menu relative">
              <button 
                className="avatar-btn" 
                onClick={() => {
                  // If user has at least one channel, go to it; otherwise prompt creation
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

            {/* Logout button */}
            <button onClick={logout} className="icon-btn" title="Logout">
              <LogOut size={24} />
            </button>
          </>
        ) : (
          // Guest view — show a "Sign in" link
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
