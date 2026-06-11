import { useState, useEffect, useContext, memo } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit2, Send } from 'lucide-react';
import { safeFormatDistance } from '../utils/date';
import { toast } from 'react-toastify';
import './Comments.css';

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/videos/${videoId}/comments`);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.warning('Please log in to comment');
    try {
      const { data } = await API.post(`/videos/${videoId}/comments`, { text: newComment });
      setComments([data, ...comments]);
      setNewComment('');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/videos/${videoId}/comments/${commentId}`);
      setComments(comments.filter(c => c.commentId !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Could not delete comment');
    }
  };

  const handleUpdate = async (commentId) => {
    try {
      await API.put(`/videos/${videoId}/comments/${commentId}`, { text: editText });
      setComments(comments.map(c => c.commentId === commentId ? { ...c, text: editText } : c));
      setEditingComment(null);
      toast.success('Comment updated');
    } catch (err) {
      toast.error('Could not update comment');
    }
  };

  return (
    <div className="comments-section">
      <h3>{comments.length} Comments</h3>
      <form className="comment-input-area" onSubmit={handleAddComment}>
        <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'Guest'}`} alt="avatar" />
        <input 
          type="text" 
          placeholder="Add a comment..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit"><Send size={20} /></button>
      </form>

      <div className="comments-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div className="shimmer" style={{ backgroundColor: '#272727', width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div className="shimmer" style={{ backgroundColor: '#272727', height: '14px', width: '120px', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div className="shimmer" style={{ backgroundColor: '#272727', height: '14px', width: '80%', borderRadius: '4px' }}></div>
              </div>
            </div>
          ))
        ) : (
          comments.map((comment) => (
            <div key={comment.commentId} className="comment-item">
              <img src={comment.avatar || `https://ui-avatars.com/api/?name=${comment.username || comment.userId}`} alt="avatar" className="comment-avatar" />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-user">{comment.username || comment.userId}</span>
                <span className="comment-date">{safeFormatDistance(comment.timestamp)} ago</span>
              </div>
              {editingComment === comment.commentId ? (
                <div className="edit-area">
                  <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                  <div className="edit-btns">
                    <button onClick={() => handleUpdate(comment.commentId)}>Save</button>
                    <button onClick={() => setEditingComment(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}
              {user?.userId === comment.userId && !editingComment && (
                <div className="comment-actions">
                  <Edit2 size={16} onClick={() => {
                    setEditingComment(comment.commentId);
                    setEditText(comment.text);
                  }} />
                  <Trash2 size={16} onClick={() => handleDelete(comment.commentId)} />
                </div>
              )}
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default memo(Comments);
