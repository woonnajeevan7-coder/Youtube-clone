import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views;
  };

  const uploadDate = video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : 'Custom ago';

  return (
    <div className="video-card">
      <Link to={`/video/${video._id}`} className="thumbnail-container">
        <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
        <span className="duration">10:00</span>
      </Link>
      <div className="video-info-container">
        <Link to={`/channel/${video.channelId?._id}`} className="channel-avatar-link">
          <img src={video.uploader?.avatar || video.channelId?.avatar || 'https://via.placeholder.com/150'} alt="channel avatar" className="channel-avatar" />
        </Link>
        <div className="video-details">
          <Link to={`/video/${video._id}`} className="video-title">
            {video.title}
          </Link>
          <Link to={`/channel/${video.channelId?._id}`} className="channel-name flex items-center gap-1">
            {video.channelId?.channelName || 'Unknown Channel'}
            <CheckCircle2 size={12} className="verified-badge" />
          </Link>
          <div className="video-meta">
            {formatViews(video.views)} views • {uploadDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
