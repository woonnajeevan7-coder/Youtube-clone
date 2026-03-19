// ChannelPage.jsx
// Public channel profile page — accessible at /channel/:id
// Shows: channel banner, avatar, name, stats, description, and a video grid.
// Owner-only features: "Upload Video" button, per-video Edit / Delete controls.
// Modals: Upload and Edit are rendered as a shared overlay modal form.

import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import './ChannelPage.css';

const ChannelPage = () => {
  const { id } = useParams();                              // Channel ID from the URL
  const { user } = useContext(AuthContext);                // Currently logged-in user
  const [channel, setChannel] = useState(null);           // Channel data from the API
  const [loading, setLoading] = useState(true);            // True while loading channel data
  const [showUploadModal, setShowUploadModal] = useState(false); // Toggle for upload modal
  const [showEditModal, setShowEditModal] = useState(false);     // Toggle for edit modal
  const [currentVideo, setCurrentVideo] = useState(null); // Video being edited (edit modal)

  // ─── Shared form state for Upload and Edit modals ─────────────────────────
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Default mockup URL
    category: 'Technology',
  });

  // Fetch channel data whenever the channel ID in the URL changes
  useEffect(() => {
    fetchChannel();
  }, [id]);

  // ─── Fetch channel data ───────────────────────────────────────────────────
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

  // True only if the logged-in user is the owner of this channel
  const isOwner = user && channel && user._id === channel.owner._id;

  // ─── Generic form input handler ───────────────────────────────────────────
  // Updates the correct field in formData using the input's `name` attribute
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ─── Open Upload modal ────────────────────────────────────────────────────
  // Resets the form before opening so it starts fresh
  const openUploadModal = () => {
    setFormData({ title: '', description: '', thumbnailUrl: '', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', category: 'Technology' });
    setShowUploadModal(true);
  };

  // ─── Open Edit modal ──────────────────────────────────────────────────────
  // Pre-populates the form with the existing video's data
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

  // ─── Submit new video upload ──────────────────────────────────────────────
  // POSTs the form data plus the channel ID, then refreshes the channel
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/videos', { ...formData, channelId: channel._id });
      toast.success('Video uploaded successfully!');
      setShowUploadModal(false);
      fetchChannel(); // Re-fetch to show the new video in the grid
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  // ─── Submit video edit ────────────────────────────────────────────────────
  // PUTs updated form data to the video endpoint, then refreshes
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

  // ─── Delete a video ───────────────────────────────────────────────────────
  // Confirms with the user before sending the DELETE request
  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`/api/videos/${videoId}`);
        toast.success('Video deleted');
        fetchChannel(); // Re-fetch to remove the deleted video from the grid
      } catch (error) {
        toast.error('Failed to delete video');
      }
    }
  };

  // ─── Loading / error states ───────────────────────────────────────────────
  if (loading) return <div className="loader-container"><div className="spinner">Loading...</div></div>;
  if (!channel) return <div className="error-msg">Channel not found.</div>;

  return (
    <div className="channel-page">
      {/* ── Channel banner image ─────────────────────────────────────────── */}
      <div className="channel-banner-container">
        <img src={channel.channelBanner} alt="banner" className="channel-banner" />
      </div>
      
      {/* ── Channel header: avatar + name + stats + action button ────────── */}
      <div className="channel-header flex">
        <img src={channel.owner?.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="channel-avatar-huge" />
        <div className="channel-info-details flex-1">
          <h1 className="channel-title">{channel.channelName}</h1>
          <div className="channel-stats text-secondary">
            <span>{channel.subscribers} subscribers</span> • <span>{channel.videos?.length || 0} videos</span>
          </div>
          <p className="channel-desc">{channel.description}</p>
        </div>
        
        {/* Owner sees "Upload Video"; visitors see "Subscribe" */}
        {isOwner ? (
          <button className="btn-primary flex items-center gap-2" onClick={openUploadModal}>
            <Plus size={20} /> Upload Video
          </button>
        ) : (
          <button className="btn-subscribe">Subscribe</button>
        )}
      </div>

      {/* ── Channel tab navigation (decorative tabs for now) ─────────────── */}
      <div className="channel-nav">
        <button className="nav-tab active">Home</button>
        <button className="nav-tab">Videos</button>
        <button className="nav-tab">Playlists</button>
        <button className="nav-tab">Community</button>
      </div>

      {/* ── Video grid ───────────────────────────────────────────────────── */}
      <div className="channel-content">
        <h3 className="section-title">Videos</h3>
        {channel.videos?.length === 0 ? (
          <p className="text-secondary">No videos uploaded yet.</p>
        ) : (
          <div className="video-grid">
            {channel.videos.map((video) => (
              <div key={video._id} className="channel-video-wrapper relative">
                {/* Pass channel as channelId so VideoCard can display the channel name */}
                <VideoCard video={{ ...video, channelId: channel }} />
                
                {/* Edit / Delete buttons only shown to the channel owner */}
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

      {/* ── Upload / Edit modal ───────────────────────────────────────────── */}
      {/* A single modal handles both upload and edit — form action differs based on which modal is active */}
      {(showUploadModal || showEditModal) && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            <div className="modal-header flex justify-between items-center">
              <h2>{showUploadModal ? 'Upload Video' : 'Edit Video'}</h2>
              {/* Close button — hides both modals */}
              <button onClick={() => { setShowUploadModal(false); setShowEditModal(false); }} className="icon-btn">
                <X size={24} />
              </button>
            </div>
            
            {/* Form switches between handleUploadSubmit and handleEditSubmit */}
            <form onSubmit={showUploadModal ? handleUploadSubmit : handleEditSubmit} className="modal-form">
              {/* Title field */}
              <div className="form-group">
                <label>Title (required)</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              {/* Description field */}
              <div className="form-group">
                <label>Description (required)</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} required></textarea>
              </div>
              {/* Thumbnail URL field */}
              <div className="form-group">
                <label>Thumbnail URL (required)</label>
                <input type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleInputChange} required />
              </div>
              {/* Category dropdown */}
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
              {/* Modal action buttons */}
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
