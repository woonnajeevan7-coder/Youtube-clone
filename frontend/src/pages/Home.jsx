// Home.jsx
// Main landing page — shows the video feed with category filters + search.
// Behavior:
//   - Reads `?search=` query param from the URL to pre-filter results.
//   - Re-fetches videos whenever the search query OR active category changes.
//   - Shows a loading spinner while fetching, an empty state if no results found,
//     or a responsive grid of VideoCard components.

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../axios';
import VideoCard from '../components/VideoCard';
import Categories from '../components/Categories';
import { Loader } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [videos, setVideos] = useState([]);              // Array of video objects from the API
  const [loading, setLoading] = useState(true);          // True while data is being fetched
  const [activeCategory, setActiveCategory] = useState('All'); // Selected category chip
  const [searchParams] = useSearchParams();              // Read URL query params (e.g. ?search=react)
  const searchQuery = searchParams.get('search') || '';  // Extract the search term or default to ''

  // ─── Fetch videos ─────────────────────────────────────────────────────────
  // Runs on mount and whenever search term or active category changes.
  // Builds the API URL dynamically to support optional filtering.
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        let url = '/api/videos';
        const params = [];
        
        // Append search and/or category params only when they are set
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
        setLoading(false); // Always stop the spinner, even on error
      }
    };

    fetchVideos();
  }, [searchQuery, activeCategory]); // Re-run whenever either filter changes

  // ─── Category selection handler ───────────────────────────────────────────
  // Passed down to the Categories component; updates activeCategory state
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="home-container">
      {/* Category filter chips bar */}
      <Categories activeCategory={activeCategory} onCategorySelect={handleCategorySelect} />
      
      {/* Show search context heading when user has searched for something */}
      {searchQuery && (
        <h2 className="search-results-title">
          Search results for: <span>"{searchQuery}"</span>
        </h2>
      )}

      {/* ── Conditional rendering: loading / empty / grid ─────────────────── */}
      {loading ? (
        // Spinner while waiting for API response
        <div className="loader-container">
          <Loader className="spinner" size={40} />
        </div>
      ) : videos.length === 0 ? (
        // Empty state when no videos match the filters
        <div className="no-videos">
          <p>No videos found. Try a different category or search term.</p>
        </div>
      ) : (
        // Video grid — maps each video to a VideoCard
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
