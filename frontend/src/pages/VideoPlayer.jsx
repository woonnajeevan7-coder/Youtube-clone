// VideoPlayer.jsx
// Full video playback page.
// Shows: HTML5 video player, title, channel info, subscribe button,
//        like/dislike/share/save action buttons, description box, and Comments section.
// URL param: :id — MongoDB ObjectId of the video to load.
// Auth-aware: Like/dislike requires the user to be signed in.

import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axios';
import { ThumbsUp, ThumbsDown, Share2, Plus, ScissorsIcon, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Comments from '../components/Comments';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { id } = useParams();                    // Video ID from the URL (/video/:id)
  const [video, setVideo] = useState(null);      // Video data object from the API
  const [loading, setLoading] = useState(true);  // True while the video is being fetched
  const { user } = useContext(AuthContext);       // Currently logged-in user (or null)

  // ─── Fetch video data ─────────────────────────────────────────────────────
  // Runs whenever the URL id param changes (e.g. navigating between videos)
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(`/api/videos/${id}`);
        setVideo(data);
      } catch (error) {
        toast.error('Failed to load video');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  // ─── Like / Dislike handler ───────────────────────────────────────────────
  // `action` is either 'like' or 'dislike'.
  // Sends a PUT request to the backend and optimistically updates the local counts.
  const handleReact = async (action) => {
    if (!user) {
      toast.info('Please sign in to react to this video');
      return;
    }
    try {
      const { data } = await axios.put(`/api/videos/${id}/react`, { action });
      // Update only the like/dislike counts without re-fetching the entire video
      setVideo((prev) => ({ ...prev, likes: data.likes, dislikes: data.dislikes }));
    } catch (error) {
      toast.error('Failed to register reaction');
    }
  };

  // ─── Loading / error states ───────────────────────────────────────────────
  if (loading) return <div className="loader-container"><div className="spinner">Loading...</div></div>;
  if (!video) return <div className="error-msg">Video not found.</div>;

  return (
    <div className="video-player-page">
      {/* ── Left / main column: player + info + comments ─────────────────── */}
      <div className="video-player-container">
        {/* HTML5 native video player — poster shows thumbnail before play */}
        <video controls className="html-video-player" poster={video.thumbnailUrl} src={video.videoUrl}></video>
        
        {/* Video title */}
        <h1 className="video-title-large">{video.title}</h1>
        
        {/* ── Channel info + action buttons row ──────────────────────────── */}
        <div className="video-primary-info flex justify-between items-center">
          {/* Channel avatar, name, subscriber count, subscribe button */}
          <div className="channel-info flex items-center gap-3">
            <Link to={`/channel/${video.channelId?._id}`}>
              <img src={video.uploader?.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="channel-avatar-large" />
            </Link>
            <div className="channel-text">
              <Link to={`/channel/${video.channelId?._id}`} className="channel-name-large flex items-center gap-1">
                {video.channelId?.channelName || 'Unknown Channel'}
                <CheckCircle2 size={14} className="verified-badge" />
              </Link>
              <span className="subscribers-count">{video.channelId?.subscribers || 0} subscribers</span>
            </div>
            <button className="btn-subscribe">Subscribe</button>
          </div>

          {/* Like, dislike, share, save action buttons */}
          <div className="video-actions flex items-center gap-2">
            {/* Like / dislike pill — grouped together */}
            <div className="action-group flex">
              <button className="action-btn like-btn" onClick={() => handleReact('like')}>
                <ThumbsUp size={20} />
                <span>{video.likes}</span>
              </button>
              <button className="action-btn dislike-btn" onClick={() => handleReact('dislike')}>
                <ThumbsDown size={20} />
              </button>
            </div>
            <button className="action-btn">
              <Share2 size={20} />
              <span>Share</span>
            </button>
            {/* Save button hidden on mobile to save space */}
            <button className="action-btn hide-mobile">
              <Plus size={20} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* ── Description box ────────────────────────────────────────────── */}
        <div className="video-description-box glass">
          <div className="views-date">
            {/* Localised view count + relative upload time */}
            {video.views?.toLocaleString()} views • {formatDistanceToNow(new Date(video.createdAt))} ago
          </div>
          <p className="description-text">{video.description}</p>
        </div>

        {/* ── Comments section ───────────────────────────────────────────── */}
        {/* Passes videoId so Comments can fetch/post comments for this video */}
        <Comments videoId={id} />
      </div>

      {/* ── Right column: recommended / up-next videos ───────────────────── */}
      <div className="recommended-videos">
        {/* Placeholder — recommended videos list to be implemented later */}
        <h3 className="section-title">Up next</h3>
        <p className="text-secondary">More videos coming soon...</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
