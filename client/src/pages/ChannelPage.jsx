import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import './ChannelPage.css';

const ChannelPage = () => {
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Form states for upload
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('Education');

  const fetchChannelData = async () => {
    try {
      const { data } = await API.get(`/channels/${channelId}`);
      setChannel(data.channel);
      setVideos(data.videos);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelId !== 'create') {
      fetchChannelData();
    } else {
      setLoading(false);
    }
  }, [channelId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await API.post('/videos', {
        title, description, thumbnailUrl, videoUrl, category, channelId
      });
      toast.success('Video uploaded!');
      setShowUpload(false);
      fetchChannelData();
      // Clear form
      setTitle(''); setDescription(''); setThumbnailUrl(''); setVideoUrl('');
    } catch (err) {
      toast.error('Upload failed');
    }
  };

  const handleCreateChannel = async (e) => {
      e.preventDefault();
      try {
          const { data } = await API.post('/channels', { channelName: title, description });
          toast.success('Channel created!');
          window.location.href = `/channel/${data.channelId}`;
      } catch (err) {
          toast.error('Creation failed');
      }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  if (channelId === 'create') {
      return (
          <div className="create-channel-container">
              <form className="upload-form" onSubmit={handleCreateChannel}>
                  <h2>Create Your Channel</h2>
                  <input placeholder="Channel Name" value={title} onChange={e => setTitle(e.target.value)} required />
                  <textarea placeholder="Channel Description" value={description} onChange={e => setDescription(e.target.value)} required />
                  <button type="submit">Create Channel</button>
              </form>
          </div>
      );
  }

  if (!channel) return <div className="error-state">Channel not found.</div>;

  const isOwner = user?.userId === channel.owner;

  return (
    <div className="channel-page">
      <div className="channel-banner" style={{ backgroundImage: `url(${channel.channelBanner || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80'})` }}></div>
      
      <div className="channel-header">
        <img src={`https://ui-avatars.com/api/?name=${channel.channelName}`} alt="logo" className="channel-logo" />
        <div className="channel-info-text">
          <h1>{channel.channelName}</h1>
          <p className="channel-stats">{channel.subscribers.toLocaleString()} subscribers • {videos.length} videos</p>
          <p className="channel-desc">{channel.description}</p>
        </div>
        {isOwner && (
          <button className="upload-toggle-btn" onClick={() => setShowUpload(!showUpload)}>
            <Plus size={20} /> Upload Video
          </button>
        )}
      </div>

      {showUpload && (
        <form className="upload-form" onSubmit={handleUpload}>
          <h3>Upload New Video</h3>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
          <input placeholder="Thumbnail URL" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} required />
          <input placeholder="Video URL" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option>Education</option>
            <option>Music</option>
            <option>Gaming</option>
            <option>News</option>
            <option>Sports</option>
            <option>Technology</option>
          </select>
          <div className="form-btns">
            <button type="submit" className="publish-btn">Publish</button>
            <button type="button" className="cancel-btn" onClick={() => setShowUpload(false)}>Cancel</button>
          </div>
        </form>
      )}

      <hr className="divider" />

      <div className="channel-videos-grid">
        {videos.map(video => (
          <div key={video.videoId} className="channel-video-item">
            <VideoCard video={video} />
            {isOwner && (
              <div className="video-management-btns">
                <button className="mgmt-btn delete" onClick={async () => {
                    if(window.confirm('Delete this video?')) {
                        await API.delete(`/videos/${video.videoId}`);
                        setVideos(videos.filter(v => v.videoId !== video.videoId));
                        toast.success('Video removed');
                    }
                }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelPage;
