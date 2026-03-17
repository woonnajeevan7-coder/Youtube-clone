import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import './ChannelPage.css';

const ChannelPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Default for mockup
    category: 'Technology',
  });

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const fetchChannel = async () => {
    try {
      const { data } = await axios.get(`/api/channels/${id}`);
      setChannel(data);
    } catch (error) {
      toast.error('Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user && channel && user._id === channel.owner._id;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openUploadModal = () => {
    setFormData({ title: '', description: '', thumbnailUrl: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', category: 'Technology' });
    setShowUploadModal(true);
  };

  const openEditModal = (video) => {
    setCurrentVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category || 'Technology',
    });
    setShowEditModal(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/videos', { ...formData, channelId: channel._id });
      toast.success('Video uploaded successfully!');
      setShowUploadModal(false);
      fetchChannel();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/videos/${currentVideo._id}`, formData);
      toast.success('Video updated!');
      setShowEditModal(false);
      fetchChannel();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`/api/videos/${videoId}`);
        toast.success('Video deleted');
        fetchChannel();
      } catch (error) {
        toast.error('Failed to delete video');
      }
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner">Loading...</div></div>;
  if (!channel) return <div className="error-msg">Channel not found.</div>;

  return (
    <div className="channel-page">
      <div className="channel-banner-container">
        <img src={channel.channelBanner} alt="banner" className="channel-banner" />
      </div>
      
      <div className="channel-header flex">
        <img src={channel.owner?.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="channel-avatar-huge" />
        <div className="channel-info-details flex-1">
          <h1 className="channel-title">{channel.channelName}</h1>
          <div className="channel-stats text-secondary">
            <span>{channel.subscribers} subscribers</span> • <span>{channel.videos?.length || 0} videos</span>
          </div>
          <p className="channel-desc">{channel.description}</p>
        </div>
        
        {isOwner ? (
          <button className="btn-primary flex items-center gap-2" onClick={openUploadModal}>
            <Plus size={20} /> Upload Video
          </button>
        ) : (
          <button className="btn-subscribe">Subscribe</button>
        )}
      </div>

      <div className="channel-nav">
        <button className="nav-tab active">Home</button>
        <button className="nav-tab">Videos</button>
        <button className="nav-tab">Playlists</button>
        <button className="nav-tab">Community</button>
      </div>

      <div className="channel-content">
        <h3 className="section-title">Videos</h3>
        {channel.videos?.length === 0 ? (
          <p className="text-secondary">No videos uploaded yet.</p>
        ) : (
          <div className="video-grid">
            {channel.videos.map((video) => (
              <div key={video._id} className="channel-video-wrapper relative">
                <VideoCard video={{ ...video, channelId: channel }} />
                
                {isOwner && (
                  <div className="video-owner-actions flex gap-2">
                    <button onClick={() => openEditModal(video)} className="action-btn-small edit tooltip" data-tooltip="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(video._id)} className="action-btn-small delete tooltip" data-tooltip="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload/Edit Modals */}
      {(showUploadModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header flex justify-between items-center">
              <h2>{showUploadModal ? 'Upload Video' : 'Edit Video'}</h2>
              <button onClick={() => { setShowUploadModal(false); setShowEditModal(false); }} className="icon-btn">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={showUploadModal ? handleUploadSubmit : handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label>Title (required)</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description (required)</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} required></textarea>
              </div>
              <div className="form-group">
                <label>Thumbnail URL (required)</label>
                <input type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="custom-select">
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Sports">Sports</option>
                  <option value="Music">Music</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
              <div className="modal-actions flex justify-end gap-3 mt-4">
                <button type="button" className="btn-cancel" onClick={() => { setShowUploadModal(false); setShowEditModal(false); }}>Cancel</button>
                <button type="submit" className="btn-primary">{showUploadModal ? 'Upload' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
