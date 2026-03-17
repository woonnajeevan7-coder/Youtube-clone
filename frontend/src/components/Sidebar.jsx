import { Link } from 'react-router-dom';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, History, Flame, Music, Gamepad2, Trophy } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'} glass`}>
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
