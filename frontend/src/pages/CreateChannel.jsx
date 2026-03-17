import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CreateChannel = () => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBanner, setChannelBanner] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/channels', {
        channelName,
        description,
        channelBanner,
      });
      toast.success('Channel created successfully!');
      navigate(`/channel/${data._id}`);
      // In a real app we'd refresh the user context here to update their channels array
      setTimeout(() => window.location.reload(), 1000); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create channel');
    }
  };

  if (!user) {
    return <div className="error-msg">Please sign in to create a channel.</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass" style={{ maxWidth: '500px' }}>
        <h2 className="auth-title">Create Your Channel</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Channel Name</label>
            <input
              type="text"
              placeholder="E.g. Gaming with Alex"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Tell viewers what your channel is about"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Banner URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/banner.jpg"
              value={channelBanner}
              onChange={(e) => setChannelBanner(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-4">Create Channel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
