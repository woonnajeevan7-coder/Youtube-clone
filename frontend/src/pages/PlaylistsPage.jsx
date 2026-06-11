import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ListVideo, Film } from 'lucide-react';
import { toast } from 'react-toastify';
import './PlaylistsPage.css';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchPlaylists = async (signal) => {
    try {
      const { data } = await API.get('/playlists', { signal });
      setPlaylists(data);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error(err);
        toast.error('Failed to load playlists');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (user) {
      setLoading(true);
      fetchPlaylists(controller.signal);
    } else {
      setLoading(false);
    }
    return () => controller.abort();
  }, [user]);

  const handleFetchPlaylistDetails = async (playlistId) => {
    try {
      const { data } = await API.get(`/playlists/${playlistId}`);
      setSelectedPlaylist(data.playlist);
      setPlaylistVideos(data.videos);
    } catch (err) {
      toast.error('Failed to load playlist details');
    }
  };

  const handleDeletePlaylist = async (playlistId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this playlist?')) return;
    try {
      await API.delete(`/playlists/${playlistId}`);
      setPlaylists(playlists.filter(p => p.playlistId !== playlistId));
      if (selectedPlaylist?.playlistId === playlistId) {
        setSelectedPlaylist(null);
        setPlaylistVideos([]);
      }
      toast.success('Playlist deleted');
    } catch (err) {
      toast.error('Could not delete playlist');
    }
  };

  const handleRemoveVideo = async (playlistId, videoId, e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await API.post(`/playlists/${playlistId}/remove`, { videoId });
      setPlaylistVideos(playlistVideos.filter(v => v.videoId !== videoId));
      setPlaylists(playlists.map(p => p.playlistId === playlistId ? { ...p, videos: p.videos.filter(id => id !== videoId) } : p));
      toast.success('Video removed from playlist');
    } catch (err) {
      toast.error('Could not remove video');
    }
  };

  if (!user) {
    return (
      <div className="playlists-page-empty">
        <ListVideo size={48} className="empty-icon" />
        <h2>Manage your Playlists</h2>
        <p>Please sign in to view and manage your playlists.</p>
        <Link to="/login" className="sign-in-btn">Sign In</Link>
      </div>
    );
  }

  if (loading) return <div className="loading-state">Loading playlists...</div>;

  return (
    <div className="playlists-page">
      <div className="playlists-left">
        <h2>My Playlists</h2>
        <div className="playlists-list">
          {playlists.map((playlist) => (
            <div 
              key={playlist.playlistId} 
              className={`playlist-item-card ${selectedPlaylist?.playlistId === playlist.playlistId ? 'active' : ''}`}
              onClick={() => handleFetchPlaylistDetails(playlist.playlistId)}
            >
              <div className="playlist-card-content">
                <ListVideo size={20} className="playlist-icon" />
                <div className="playlist-card-info">
                  <h4>{playlist.name}</h4>
                  <p>{playlist.videos.length} videos</p>
                </div>
              </div>
              <button className="delete-btn" onClick={(e) => handleDeletePlaylist(playlist.playlistId, e)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {playlists.length === 0 && (
            <p className="no-playlists-text">No playlists created yet. Save videos to playlists on the video page.</p>
          )}
        </div>
      </div>

      <div className="playlists-right">
        {selectedPlaylist ? (
          <div className="playlist-details">
            <div className="playlist-details-header">
              <h3>{selectedPlaylist.name}</h3>
              <p>{playlistVideos.length} videos</p>
            </div>
            <div className="playlist-videos-list">
              {playlistVideos.map((video) => (
                <Link key={video.videoId} to={`/video/${video.videoId}`} className="playlist-video-row">
                  <img src={video.thumbnailUrl} alt={video.title} className="video-row-thumb" />
                  <div className="video-row-info">
                    <h4>{video.title}</h4>
                    <p>{video.uploader} • {video.views.toLocaleString()} views</p>
                  </div>
                  <button className="remove-video-btn" onClick={(e) => handleRemoveVideo(selectedPlaylist.playlistId, video.videoId, e)}>
                    <Trash2 size={16} />
                  </button>
                </Link>
              ))}
              {playlistVideos.length === 0 && (
                <div className="empty-playlist-videos">
                  <Film size={32} />
                  <p>This playlist has no videos yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-playlist-selected">
            <ListVideo size={48} />
            <p>Select a playlist to view its videos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistsPage;
