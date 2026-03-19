// Comments.jsx
// Full comment section for a video page.
// Features:
//   - Fetches and displays all comments for the given videoId
//   - Allows signed-in users to add new comments
//   - Allows comment owners to edit or delete their own comments
// Props:
//   - videoId: MongoDB ObjectId of the currently playing video

import { useState, useEffect, useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';
import './Comments.css';

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);    // List of comment objects from the API
  const [newComment, setNewComment] = useState(''); // Controlled input for the new comment form
  const [editingId, setEditingId] = useState(null); // ID of the comment currently being edited (or null)
  const [editQuery, setEditQuery] = useState('');   // Controlled input for the inline edit form
  const { user } = useContext(AuthContext);          // Currently logged-in user (or null)

  // Fetch comments whenever the video changes
  useEffect(() => {
    fetchComments();
  }, [videoId]);

  // ─── Fetch all comments for this video ───────────────────────────────────
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comments/${videoId}`);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  };

  // ─── Add a new comment ────────────────────────────────────────────────────
  // Requires the user to be signed in; prepends the new comment to the list
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.info('Sign in to comment'); // Guard: must be logged in
    if (!newComment.trim()) return;                      // Guard: no empty comments

    try {
      const { data } = await axios.post('/api/comments', { videoId, text: newComment });
      setComments([data, ...comments]); // Prepend for instant feedback (optimistic update)
      setNewComment('');                // Clear the input
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  // ─── Update an existing comment ───────────────────────────────────────────
  // Replaces the edited comment in local state without a full re-fetch
  const handleUpdate = async (id) => {
    if (!editQuery.trim()) return; // Guard: no empty updates

    try {
      const { data } = await axios.put(`/api/comments/${id}`, { text: editQuery });
      // Replace only the updated comment in the array
      setComments(comments.map((c) => (c._id === id ? data : c)));
      setEditingId(null); // Exit edit mode
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  // ─── Delete a comment ─────────────────────────────────────────────────────
  // Confirms before deleting, then removes it from local state
  const handleDelete = async (id) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await axios.delete(`/api/comments/${id}`);
        setComments(comments.filter((c) => c._id !== id)); // Remove from list
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  return (
    <div className="comments-section">
      {/* Comment count header */}
      <h3 className="comments-count">{comments.length} Comments</h3>
      
      {/* ── Add comment form ──────────────────────────────────────────────── */}
      <div className="add-comment-container">
        {/* Show logged-in user's avatar, or a placeholder if not signed in */}
        <img src={user?.avatar || 'https://via.placeholder.com/150'} alt="user avatar" className="user-avatar-small" />
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            className="comment-input"
            placeholder={user ? "Add a comment..." : "Sign in to add a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user} // Disable input for guests
          />
          <div className="comment-actions-row">
            {/* Show Cancel button only when the user has started typing */}
            {newComment && (
              <button type="button" className="btn-cancel" onClick={() => setNewComment('')}>Cancel</button>
            )}
            <button type="submit" className="btn-submit" disabled={!newComment.trim()}>Comment</button>
          </div>
        </form>
      </div>

      {/* ── Comments list ─────────────────────────────────────────────────── */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item flex">
            {/* Commenter avatar */}
            <img src={comment.userId?.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="user-avatar-small" />
            
            <div className="comment-content-wrapper flex-1">
              <div className="comment-header flex items-center justify-between">
                <div>
                  {/* Username and relative timestamp */}
                  <span className="comment-author">@{comment.userId?.username || 'Unknown'}</span>
                  <span className="comment-time">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                </div>
                
                {/* Edit / Delete buttons — only visible to the comment's author */}
                {user?._id === comment.userId?._id && (
                  <div className="comment-item-actions flex gap-2">
                    <button onClick={() => { setEditingId(comment._id); setEditQuery(comment.text); }} className="action-icon">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(comment._id)} className="action-icon delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Inline edit form vs. comment text ─────────────────────── */}
              {editingId === comment._id ? (
                // Show inline edit input when this comment is being edited
                <div className="edit-comment-form">
                  <input
                    type="text"
                    value={editQuery}
                    onChange={(e) => setEditQuery(e.target.value)}
                    className="comment-input"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                    <button className="btn-primary" onClick={() => handleUpdate(comment._id)}>Save</button>
                  </div>
                </div>
              ) : (
                // Normal read-only comment text
                <p className="comment-text">{comment.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
