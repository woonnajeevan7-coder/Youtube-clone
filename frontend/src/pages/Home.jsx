import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../axios';
import VideoCard from '../components/VideoCard';
import Categories from '../components/Categories';
import { Loader } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        let url = '/api/videos';
        const params = [];
        
        if (searchQuery) params.push(`search=${searchQuery}`);
        if (activeCategory !== 'All') params.push(`category=${activeCategory}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const { data } = await axios.get(url);
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, activeCategory]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="home-container">
      <Categories activeCategory={activeCategory} onCategorySelect={handleCategorySelect} />
      
      {searchQuery && (
        <h2 className="search-results-title">
          Search results for: <span>"{searchQuery}"</span>
        </h2>
      )}

      {loading ? (
        <div className="loader-container">
          <Loader className="spinner" size={40} />
        </div>
      ) : videos.length === 0 ? (
        <div className="no-videos">
          <p>No videos found. Try a different category or search term.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
