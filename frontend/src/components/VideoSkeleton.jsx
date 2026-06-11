import './VideoSkeleton.css';

/**
 * Renders a shimmering layout placeholder for videos while loading.
 */
const VideoSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-thumbnail shimmer"></div>
      <div className="skeleton-info">
        <div className="skeleton-avatar shimmer"></div>
        <div className="skeleton-details">
          <div className="skeleton-title shimmer"></div>
          <div className="skeleton-meta shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoSkeleton;
