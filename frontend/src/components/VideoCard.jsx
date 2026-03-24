import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video.videoId}`} className="video-card">
      <div className="thumbnail-container">
        <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
      </div>
      <div className="video-info">
        <img src={`https://ui-avatars.com/api/?name=${video.uploader}`} alt="avatar" className="channel-avatar" />
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <p className="channel-name">{video.uploader}</p>
          <p className="video-meta">
            {video.views.toLocaleString()} views • {formatDistanceToNow(new Date(video.uploadDate))} ago
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
