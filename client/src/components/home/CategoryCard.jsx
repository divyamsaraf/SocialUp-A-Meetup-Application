import { Link } from 'react-router-dom';

const CategoryCard = ({ icon, title, description, href }) => {
  return (
    <Link
      to={href}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`Explore ${title} events`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
