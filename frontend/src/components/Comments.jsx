import { useState, useEffect, useContext } from 'react';
import axios from '../axios';
import { AuthContext } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';
import './Comments.css';

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editQuery, setEditQuery] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comments/${videoId}`);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.info('Sign in to comment');
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post('/api/comments', { videoId, text: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdate = async (id) => {
    if (!editQuery.trim()) return;

    try {
      const { data } = await axios.put(`/api/comments/${id}`, { text: editQuery });
      setComments(comments.map((c) => (c._id === id ? data : c)));
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await axios.delete(`/api/comments/${id}`);
        setComments(comments.filter((c) => c._id !== id));
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-count">{comments.length} Comments</h3>
      
      <div className="add-comment-container">
        <img src={user?.avatar || 'https://via.placeholder.com/150'} alt="user avatar" className="user-avatar-small" />
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            className="comment-input"
            placeholder={user ? "Add a comment..." : "Sign in to add a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user}
          />
          <div className="comment-actions-row">
            {newComment && (
              <button type="button" className="btn-cancel" onClick={() => setNewComment('')}>Cancel</button>
            )}
            <button type="submit" className="btn-submit" disabled={!newComment.trim()}>Comment</button>
          </div>
        </form>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item flex">
            <img src={comment.userId?.avatar || 'https://via.placeholder.com/150'} alt="avatar" className="user-avatar-small" />
            
            <div className="comment-content-wrapper flex-1">
              <div className="comment-header flex items-center justify-between">
                <div>
                  <span className="comment-author">@{comment.userId?.username || 'Unknown'}</span>
                  <span className="comment-time">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                </div>
                
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

              {editingId === comment._id ? (
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
