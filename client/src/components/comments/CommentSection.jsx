import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { commentService } from '../../services/comment.service';
import { formatDistanceToNow } from 'date-fns';
import ErrorMessage from '../common/ErrorMessage';
import Button from '../ui/Button';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { inputs } from '../../theme';

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
      setError('');
      const response = await commentService.getEventComments(eventId);
      const commentsData = response?.data?.comments || response?.comments || [];
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      // Don't show error for 401 - comments are viewable without login
      if (err.response?.status === 401) {
        setComments([]);
        setError('');
      } else {
        setError('Failed to load comments');
      }
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
    return (
      <div style={{ marginTop: spacing[6] }}>
        <p style={{ color: colors.text.tertiary }}>Loading comments...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: spacing[6] }}>
      <h2 
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.primary,
          marginBottom: spacing[4],
        }}
      >
        Comments ({comments.length})
      </h2>

      {error && <ErrorMessage message={error} />}

      {isAuthenticated && (
        <form onSubmit={handleSubmit} style={{ marginBottom: spacing[6] }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
            className="w-full focus:outline-none focus:ring-2 resize-none"
            style={{
              ...inputs.base,
              ...inputs.size.md,
              ...inputs.state.default,
              borderRadius: borderRadius.md,
              marginBottom: spacing[2],
            }}
            onFocus={(e) => {
              e.target.style.border = `2px solid ${colors.border.focus}`;
              e.target.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
            }}
            onBlur={(e) => {
              e.target.style.border = `1px solid ${colors.border.default}`;
              e.target.style.boxShadow = 'none';
            }}
          />
          <Button
            type="submit"
            disabled={submitting || !newComment.trim()}
            isLoading={submitting}
            size="sm"
          >
            Post Comment
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p style={{ color: colors.text.tertiary }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => {
            const commentUser = comment.userId;
            const canDelete = isAuthenticated && (
              user?._id === commentUser?._id || user?.role === 'admin'
            );

            return (
              <div 
                key={comment._id} 
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderRadius: borderRadius.lg,
                  padding: spacing[4],
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1" style={{ gap: spacing[3] }}>
                    <img
                      src={commentUser?.profile_pic || '/default-avatar.png'}
                      alt={commentUser?.name || 'User'}
                      className="rounded-full"
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <span 
                          style={{
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.text.primary,
                          }}
                        >
                          {commentUser?.name || commentUser?.username || 'Anonymous'}
                        </span>
                        <span 
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.text.tertiary,
                          }}
                        >
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p 
                        className="mt-1"
                        style={{
                          color: colors.text.secondary,
                          marginTop: spacing[1],
                        }}
                      >
                        {comment.text}
                      </p>
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      style={{
                        color: colors.error[600],
                        fontSize: typography.fontSize.sm,
                      }}
                      className="hover:opacity-80"
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
