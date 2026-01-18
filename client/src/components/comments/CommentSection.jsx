import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { commentService } from '../../services/comment.service';
import { formatDistanceToNow } from 'date-fns';
import ErrorMessage from '../common/ErrorMessage';

const CommentSection = ({ eventId }) => {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getEventComments(eventId);
      setComments(response.data.comments || []);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      await commentService.addComment(eventId, newComment);
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await commentService.deleteComment(eventId, commentId);
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (loading) {
    return <div className="mt-6">Loading comments...</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>

      {error && <ErrorMessage message={error} />}

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => {
            const commentUser = comment.userId;
            const canDelete = isAuthenticated && (
              user?._id === commentUser?._id || user?.role === 'admin'
            );

            return (
              <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <img
                      src={commentUser?.profile_pic || '/default-avatar.png'}
                      alt={commentUser?.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">
                          {commentUser?.name || commentUser?.username || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
