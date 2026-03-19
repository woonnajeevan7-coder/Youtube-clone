// Sidebar.jsx
// Left navigation panel with grouped menu items.
// Visibility is controlled by the `isOpen` prop toggled from the Header.
// Sections:
//   1. Main nav  — Home, Explore, Subscriptions
//   2. Library   — History, Watch Later, Liked Videos
//   3. Explore   — Trending, Music, Gaming, Sports
// Props:
//   - isOpen: boolean — adds 'open' or 'closed' CSS class for slide animation

import { Link } from 'react-router-dom';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, History, Flame, Music, Gamepad2, Trophy } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    // 'open' / 'closed' class drives the CSS slide-in / slide-out transition
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'} glass`}>

      {/* ── Section 1: Main navigation ─────────────────────────────────────── */}
      <div className="sidebar-section">
        <Link to="/" className="sidebar-item active">
          <Home size={22} />
          <span>Home</span>
        </Link>
        <div className="sidebar-item">
          <Compass size={22} />
          <span>Explore</span>
        </div>
        <div className="sidebar-item">
          <PlaySquare size={22} />
          <span>Subscriptions</span>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      {/* ── Section 2: Personal library ─────────────────────────────────────── */}
      <div className="sidebar-section">
        <div className="sidebar-item">
          <History size={22} />
          <span>History</span>
        </div>
        <div className="sidebar-item">
          <Clock size={22} />
          <span>Watch later</span>
        </div>
        <div className="sidebar-item">
          <ThumbsUp size={22} />
          <span>Liked videos</span>
        </div>
      </div>

      <div className="sidebar-divider"></div>
      
      {/* ── Section 3: Explore by topic ─────────────────────────────────────── */}
      <div className="sidebar-section">
        <h3 className="sidebar-heading">Explore</h3>
        <div className="sidebar-item">
          <Flame size={22} />
          <span>Trending</span>
        </div>
        <div className="sidebar-item">
          <Music size={22} />
          <span>Music</span>
        </div>
        <div className="sidebar-item">
          <Gamepad2 size={22} />
          <span>Gaming</span>
        </div>
        <div className="sidebar-item">
          <Trophy size={22} />
          <span>Sports</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
