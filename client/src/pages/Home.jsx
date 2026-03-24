import { useEffect, useState } from 'react';
import API from '../api';
import VideoCard from '../components/VideoCard';
import './Home.css';

const categories = ['All', 'Education', 'Music', 'Gaming', 'News', 'Sports', 'Technology'];

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Get search from URL
    const params = new URLSearchParams(window.location.search);
    setSearchTerm(params.get('search') || '');
  }, [window.location.search]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await API.get('/videos', {
          params: { search: searchTerm, category: selectedCategory }
        });
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos', error);
      }
    };
    fetchVideos();
  }, [searchTerm, selectedCategory]);

  return (
    <div className="home">
      <div className="categories-bar">
        {categories.map((cat) => (
          <button 
            key={cat} 
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
        {videos.length === 0 && (
          <div className="no-videos">
             <p>No videos found for "{searchTerm || selectedCategory}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
