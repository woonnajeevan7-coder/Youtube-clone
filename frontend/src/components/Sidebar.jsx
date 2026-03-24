import { 
  Home, 
  PlaySquare, 
  History, 
  Clock, 
  ThumbsUp, 
  MonitorPlay,
  Download,
  ListVideo,
  ShoppingBag,
  Music,
  Film,
  ChevronDown,
  ChevronRight,
  Flame
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-section">
        <NavLink to="/" className="sidebar-item active">
          <Home size={24} strokeWidth={1.5} />
          <span>Home</span>
        </NavLink>
        <div className="sidebar-item">
          <Flame size={24} strokeWidth={1.5} />
          <span>Shorts</span>
        </div>
        <div className="sidebar-item">
          <ListVideo size={24} strokeWidth={1.5} />
          <span>Subscriptions</span>
        </div>
      </div>
      
      <hr className="divider" />
      
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="section-title">You</h3>
          <ChevronRight size={18} strokeWidth={2} />
        </div>
        
        <div className="sidebar-item">
          <History size={24} strokeWidth={1.5} />
          <span>History</span>
        </div>
        <div className="sidebar-item">
          <ListVideo size={24} strokeWidth={1.5} />
          <span>Playlists</span>
        </div>
        <div className="sidebar-item">
          <Clock size={24} strokeWidth={1.5} />
          <span>Watch later</span>
        </div>
        <div className="sidebar-item">
          <ThumbsUp size={24} strokeWidth={1.5} />
          <span>Liked videos</span>
        </div>
        <div className="sidebar-item">
          <PlaySquare size={24} strokeWidth={1.5} />
          <span>Your videos</span>
        </div>
        <div className="sidebar-item">
          <Download size={24} strokeWidth={1.5} />
          <span>Downloads</span>
        </div>
      </div>

      <hr className="divider" />

      <div className="sidebar-section">
        <h3 className="section-title">Explore</h3>
        
        <div className="sidebar-item">
          <ShoppingBag size={24} strokeWidth={1.5} />
          <span>Shopping</span>
        </div>
        <div className="sidebar-item">
          <Music size={24} strokeWidth={1.5} />
          <span>Music</span>
        </div>
        <div className="sidebar-item">
          <Film size={24} strokeWidth={1.5} />
          <span>Movies</span>
        </div>
        <div className="sidebar-item">
          <ChevronDown size={24} strokeWidth={1.5} />
          <span>Show more</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
