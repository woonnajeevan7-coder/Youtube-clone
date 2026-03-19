// CreateChannel.jsx
// Form page that allows a signed-in user to create a new YouTube channel.
// On submit: POSTs the channel details to the backend and redirects to the new channel page.
// Guard: If the user is not signed in, shows an error message instead of the form.
// Note: After creation, a page reload is triggered to refresh the user's channel list in
//       AuthContext (a future improvement would be to update the context directly).

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CreateChannel = () => {
  const [channelName, setChannelName] = useState('');   // Controlled channel name field
  const [description, setDescription] = useState('');   // Controlled description textarea
  const [channelBanner, setChannelBanner] = useState(''); // Optional banner image URL
  const { user } = useContext(AuthContext);              // Current user — used to guard access
  const navigate = useNavigate();

  // ─── Form submit handler ──────────────────────────────────────────────────
  // Creates the channel via the API, then navigates to the new channel page.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/channels', {
        channelName,
        description,
        channelBanner,
      });
      toast.success('Channel created successfully!');
      navigate(`/channel/${data._id}`); // Go to the new channel page immediately
      // Reload after 1s to refresh AuthContext user.channels array
      // (ideally this would be handled by updating context state directly)
      setTimeout(() => window.location.reload(), 1000); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create channel');
    }
  };

  // ─── Auth guard ───────────────────────────────────────────────────────────
  // Prevent unauthenticated users from accessing this page
  if (!user) {
    return <div className="error-msg">Please sign in to create a channel.</div>;
  }

  return (
    <div className="auth-container">
      {/* Wider glassmorphism card for the channel creation form */}
      <div className="auth-card glass" style={{ maxWidth: '500px' }}>
        <h2 className="auth-title">Create Your Channel</h2>

        {/* ── Channel creation form ─────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Channel name field (required) */}
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

          {/* Description textarea (required) */}
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

          {/* Banner URL field (optional — channel can be created without a banner) */}
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
