import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationService } from '../../services/recommendation.service';
import EventCard from '../events/EventCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const RecommendationSection = ({ limit = 6 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await recommendationService.getRecommendations(limit);
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Recommended for You
        </h2>
        <span className="text-sm text-gray-500">
          Based on your interests and activity
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((event) => (
          <div key={event._id} className="relative">
            <EventCard event={event} />
            {event.recommendationReasons && event.recommendationReasons.length > 0 && (
              <div className="mt-2">
                <div
                  className="group relative inline-block"
                  title={event.recommendationReasons.join(', ')}
                >
                  <span className="text-xs text-blue-600 cursor-help">
                    Why recommended?
                  </span>
                  <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                    {event.recommendationReasons.map((reason, idx) => (
                      <div key={idx}>• {reason}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
