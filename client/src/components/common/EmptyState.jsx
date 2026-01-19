import { Link } from 'react-router-dom';

const EmptyState = ({ icon, title, message, actionLabel, actionHref }) => {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1 mb-4">{message}</p>
      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
