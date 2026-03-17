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
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

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

  const handleReact = async (action) => {
    if (!user) {
      toast.info('Please sign in to react to this video');
      return;
    }
    try {
      const { data } = await axios.put(`/api/videos/${id}/react`, { action });
      setVideo((prev) => ({ ...prev, likes: data.likes, dislikes: data.dislikes }));
    } catch (error) {
      toast.error('Failed to register reaction');
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner">Loading...</div></div>;
  if (!video) return <div className="error-msg">Video not found.</div>;

  return (
    <div className="video-player-page">
      <div className="video-player-container">
        <video controls className="html-video-player" poster={video.thumbnailUrl} src={video.videoUrl}></video>
        
        <h1 className="video-title-large">{video.title}</h1>
        
        <div className="video-primary-info flex justify-between items-center">
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

          <div className="video-actions flex items-center gap-2">
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
            <button className="action-btn hide-mobile">
              <Plus size={20} />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="video-description-box glass">
          <div className="views-date">
            {video.views?.toLocaleString()} views • {formatDistanceToNow(new Date(video.createdAt))} ago
          </div>
          <p className="description-text">{video.description}</p>
        </div>

        <Comments videoId={id} />
      </div>

      <div className="recommended-videos">
        {/* Recommended videos list could go here. For now it's empty to save focus. */}
        <h3 className="section-title">Up next</h3>
        <p className="text-secondary">More videos coming soon...</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
