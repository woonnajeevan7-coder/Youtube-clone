// VideoCard.jsx
// Reusable card component for displaying a single video in a grid.
// Shown on: Home page grid, Channel page video list.
// Displays: thumbnail, title, channel avatar, channel name, view count, upload date.
// Props:
//   - video: video object from the API (includes channelId, uploader, etc.)

import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  // ─── View count formatter ─────────────────────────────────────────────────
  // Converts raw number to compact string: 1500000 → "1.5M", 10000 → "10.0K"
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views;
  };

  // Format the upload date as a relative time string (e.g. "3 days ago")
  const uploadDate = video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : 'Custom ago';

  return (
    <div className="video-card">
      {/* ── Thumbnail ───────────────────────────────────────────────────────── */}
      <Link to={`/video/${video._id}`} className="thumbnail-container">
        <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
        {/* Static duration badge — replace with actual duration from API when available */}
        <span className="duration">10:00</span>
      </Link>

      {/* ── Video metadata row (avatar + title + channel + stats) ────────────── */}
      <div className="video-info-container">
        {/* Channel avatar — links to the channel page */}
        <Link to={`/channel/${video.channelId?._id}`} className="channel-avatar-link">
          <img src={video.uploader?.avatar || video.channelId?.avatar || 'https://via.placeholder.com/150'} alt="channel avatar" className="channel-avatar" />
        </Link>

        <div className="video-details">
          {/* Video title — links to the video player */}
          <Link to={`/video/${video._id}`} className="video-title">
            {video.title}
          </Link>

          {/* Channel name with verified badge — links to channel page */}
          <Link to={`/channel/${video.channelId?._id}`} className="channel-name flex items-center gap-1">
            {video.channelId?.channelName || 'Unknown Channel'}
            <CheckCircle2 size={12} className="verified-badge" />
          </Link>

          {/* View count + upload date */}
          <div className="video-meta">
            {formatViews(video.views)} views • {uploadDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
