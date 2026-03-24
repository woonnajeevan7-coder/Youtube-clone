import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import Comments from '../components/Comments';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await API.get(`/videos/${videoId}`);
        setVideo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleLike = async () => {
    try {
      const { data } = await API.post(`/videos/${videoId}/like`);
      setVideo({ ...video, likes: data.likes });
    } catch (err) { console.error(err); }
  };

  const handleDislike = async () => {
    try {
      const { data } = await API.post(`/videos/${videoId}/dislike`);
      setVideo({ ...video, dislikes: data.dislikes });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading">Loading video...</div>;
  if (!video) return <div className="error">Video not found.</div>;

  return (
    <div className="video-player-container">
      <div className="player-main">
        <div className="video-wrapper">
          <video controls autoPlay src={video.videoUrl} className="main-video"></video>
        </div>
        
        <h1 className="video-title-main">{video.title}</h1>
        
        <div className="video-meta-section">
          <div className="channel-info-player">
            <img src={`https://ui-avatars.com/api/?name=${video.uploader}`} alt="channel" className="avatar-large" />
            <div className="channel-text">
              <span className="channel-name-player">{video.uploader}</span>
              <span className="sub-count">1.2M subscribers</span>
            </div>
            <button className="sub-btn">Subscribe</button>
          </div>
          
          <div className="meta-actions">
            <div className="action-group">
              <button onClick={handleLike} className="action-btn like">
                <ThumbsUp size={20} />
                <span>{video.likes}</span>
              </button>
              <button onClick={handleDislike} className="action-btn dislike">
                <ThumbsDown size={20} />
                <span>{video.dislikes}</span>
              </button>
            </div>
            <button className="action-btn"><Share2 size={20} /> Share</button>
          </div>
        </div>

        <div className="description-box">
          <p className="views-date">
            {video.views.toLocaleString()} views • {format(new Date(video.uploadDate), 'MMM d, yyyy')}
          </p>
          <p className="description-text">{video.description}</p>
        </div>

        <Comments videoId={videoId} />
      </div>

      <div className="player-sidebar">
        {/* Related videos could go here */}
        <h3>Related Videos</h3>
        <p>Coming soon...</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
