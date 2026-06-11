import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import API from '../api';
import VideoCard from '../components/VideoCard';
import VideoSkeleton from '../components/VideoSkeleton';
import './Home.css';

const categories = ['All', 'Education', 'Music', 'Gaming', 'News', 'Sports', 'Technology'];

const Home = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
  }, [location.search]);

  // Video fetching handler for cursor-based pagination
  const fetchVideosPage = async ({ pageParam }) => {
    const { data } = await API.get('/videos', {
      params: { 
        search: searchTerm, 
        category: selectedCategory, 
        cursor: pageParam, 
        limit: 12 
      }
    });
    return data;
  };

  // React Query infinite scroll query configuration
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['videos', searchTerm, selectedCategory],
    queryFn: fetchVideosPage,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // If the page contains fewer videos than requested, we've reached the end
      if (!lastPage || lastPage.length < 12) return undefined;
      // Cursor is the _id of the last video in the current page
      return lastPage[lastPage.length - 1]._id;
    }
  });

  // Attach window scroll listener for dynamic loads
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 100
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const videos = data ? data.pages.flat() : [];

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
        {isLoading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <VideoSkeleton key={idx} />
          ))
        ) : (
          videos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))
        )}
        
        {isFetchingNextPage && (
          Array.from({ length: 4 }).map((_, idx) => (
            <VideoSkeleton key={`next-${idx}`} />
          ))
        )}

        {!isLoading && videos.length === 0 && (
          <div className="no-videos">
             <p>No videos found for "{searchTerm || selectedCategory}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
