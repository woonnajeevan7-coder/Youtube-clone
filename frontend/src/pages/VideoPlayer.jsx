import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { ThumbsUp, ThumbsDown, Share2, ListPlus } from 'lucide-react';
import { safeFormatDate } from '../utils/date';
import Comments from '../components/Comments';
import VideoCard from '../components/VideoCard';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [channel, setChannel] = useState(null);
  const { user } = useContext(AuthContext);

  // Playlist states
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [relatedVideos, setRelatedVideos] = useState([]);

  const fetchVideo = async () => {
    try {
      const { data } = await API.get(`/videos/${videoId}`);
      setVideo(data);
      if (user) {
        API.post('/auth/history', { videoId }).catch(err => console.error(err));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (video) {
      const fetchChannelInfo = async () => {
        try {
          const { data } = await API.get(`/channels/${video.channelId}`);
          setChannel(data.channel);
          setSubscribers(data.channel.subscribers);
        } catch (err) {
          console.error(err);
        }
      };
      fetchChannelInfo();

      if (user) {
        const fetchSubStatus = async () => {
          try {
            const { data } = await API.get(`/channels/${video.channelId}/isSubscribed`);
            setIsSubscribed(data.isSubscribed);
          } catch (err) {
            console.error(err);
          }
        };
        fetchSubStatus();
      }
    }
  }, [video, user]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await API.get('/playlists');
        setPlaylists(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      try {
        const { data } = await API.get('/videos', {
          params: { category: video?.category }
        });
        setRelatedVideos(data.filter(v => v.videoId !== videoId));
      } catch (err) {
        console.error(err);
      }
    };
    if (video) {
      fetchRelatedVideos();
    }
  }, [video, videoId]);

  const handleLike = async () => {
    if (!user) return toast.warning('Please log in to like videos');
    try {
      const { data } = await API.post(`/videos/${videoId}/like`);
      setVideo({ ...video, likes: data.likes, dislikes: data.dislikes });
    } catch (err) { console.error(err); }
  };

  const handleDislike = async () => {
    if (!user) return toast.warning('Please log in to dislike videos');
    try {
      const { data } = await API.post(`/videos/${videoId}/dislike`);
      setVideo({ ...video, likes: data.likes, dislikes: data.dislikes });
    } catch (err) { console.error(err); }
  };

  const handleSubscribe = async () => {
    if (!user) return toast.warning('Please log in to subscribe');
    try {
      const { data } = await API.post(`/channels/${video.channelId}/subscribe`);
      setIsSubscribed(data.isSubscribed);
      setSubscribers(data.subscribers);
      if (data.isSubscribed) {
        toast.success('Subscribed to channel!');
      } else {
        toast.info('Unsubscribed from channel');
      }
    } catch (err) {
      toast.error('Subscription failed');
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      const { data } = await API.post('/playlists', { name: newPlaylistName });
      setPlaylists([...playlists, data]);
      setNewPlaylistName('');
      toast.success('Playlist created!');
    } catch (err) {
      toast.error('Failed to create playlist');
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await API.post(`/playlists/${playlistId}/add`, { videoId });
      toast.success('Added to playlist');
      setShowPlaylists(false);
    } catch (err) {
      toast.error('Failed to add to playlist');
    }
  };

  if (loading) {
    return (
      <div className="video-player-container loading-mode" style={{ gap: '24px', padding: '24px' }}>
        <div className="player-main" style={{ flex: 1 }}>
          <div className="video-wrapper shimmer" style={{ backgroundColor: '#272727', width: '100%', aspectRatio: '16/9', borderRadius: '12px' }}></div>
          <div className="shimmer" style={{ backgroundColor: '#272727', height: '24px', width: '60%', borderRadius: '4px', marginTop: '16px', marginBottom: '12px' }}></div>
          <div className="shimmer" style={{ backgroundColor: '#272727', height: '40px', width: '100%', borderRadius: '8px' }}></div>
        </div>
        <div className="player-sidebar" style={{ width: '400px' }}>
          <div className="shimmer" style={{ backgroundColor: '#272727', height: '20px', width: '40%', borderRadius: '4px', marginBottom: '16px' }}></div>
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div className="shimmer" style={{ backgroundColor: '#272727', width: '120px', height: '70px', borderRadius: '8px', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div className="shimmer" style={{ backgroundColor: '#272727', height: '14px', width: '80%', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div className="shimmer" style={{ backgroundColor: '#272727', height: '12px', width: '50%', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            <Link to={`/channel/${video.channelId}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
              <img src={`https://ui-avatars.com/api/?name=${channel?.channelName || video.uploader}`} alt="channel" className="avatar-large" />
              <div className="channel-text">
                <span className="channel-name-player">{channel?.channelName || video.uploader}</span>
                <span className="sub-count">{(subscribers || 0).toLocaleString()} subscribers</span>
              </div>
            </Link>
            <button 
              className={`sub-btn ${isSubscribed ? 'subscribed' : ''}`} 
              onClick={handleSubscribe}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
          
          <div className="meta-actions">
            <div className="action-group">
              <button 
                onClick={handleLike} 
                className={`action-btn like ${Array.isArray(video.likes) && user && video.likes.includes(user._id) ? 'active' : ''}`}
              >
                <ThumbsUp size={20} />
                <span>{Array.isArray(video.likes) ? video.likes.length : (video.likes || 0)}</span>
              </button>
              <button 
                onClick={handleDislike} 
                className={`action-btn dislike ${Array.isArray(video.dislikes) && user && video.dislikes.includes(user._id) ? 'active' : ''}`}
              >
                <ThumbsDown size={20} />
                <span>{Array.isArray(video.dislikes) ? video.dislikes.length : (video.dislikes || 0)}</span>
              </button>
            </div>
            <button className="action-btn"><Share2 size={20} /> Share</button>
            
            <div className="playlist-save-container" style={{ position: 'relative' }}>
              <button className="action-btn" onClick={() => {
                if (!user) return toast.warning('Please log in to save videos');
                setShowPlaylists(!showPlaylists);
              }}>
                <ListPlus size={20} /> Save
              </button>
              {showPlaylists && (
                <div className="playlists-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#0f0f0f',
                  border: '1px solid #272727',
                  borderRadius: '12px',
                  padding: '12px',
                  zIndex: 100,
                  minWidth: '200px',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.5)',
                  marginTop: '8px'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#f1f1f1' }}>Save to...</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px 0', maxHeight: '150px', overflowY: 'auto' }}>
                    {playlists.map(p => (
                      <li key={p.playlistId} style={{ margin: '4px 0' }}>
                        <button 
                          onClick={() => handleAddToPlaylist(p.playlistId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#aaa',
                            cursor: 'pointer',
                            fontSize: '13px',
                            textAlign: 'left',
                            width: '100%',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#272727'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          {p.name}
                        </button>
                      </li>
                    ))}
                    {playlists.length === 0 && (
                      <li style={{ color: '#777', fontSize: '12px', padding: '4px 8px' }}>No playlists yet.</li>
                    )}
                  </ul>
                  <form onSubmit={handleCreatePlaylist} style={{ borderTop: '1px solid #272727', paddingTop: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="New playlist name" 
                      value={newPlaylistName}
                      onChange={e => setNewPlaylistName(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1f1f1f',
                        border: '1px solid #3f3f3f',
                        color: '#fff',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        marginBottom: '8px',
                        outline: 'none'
                      }}
                    />
                    <button type="submit" style={{
                      backgroundColor: '#f1f1f1',
                      color: '#0f0f0f',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      width: '100%'
                    }}>Create</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="description-box">
          <p className="views-date">
            {(video.views || 0).toLocaleString()} views • {safeFormatDate(video.uploadDate, 'MMM d, yyyy')}
          </p>
          <p className="description-text">{video.description}</p>
        </div>

        <Comments videoId={videoId} />
      </div>

      <div className="player-sidebar">
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-primary)' }}>Related Videos</h3>
        <div className="related-videos-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {relatedVideos.map(v => (
            <VideoCard key={v.videoId} video={v} />
          ))}
          {relatedVideos.length === 0 && (
            <p style={{ color: '#777', fontSize: '13px' }}>No related videos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
