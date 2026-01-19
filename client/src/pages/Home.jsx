import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EVENT_CATEGORIES, MESSAGING } from '../utils/constants';
import HeroSection from '../components/home/HeroSection';
import ValueProps from '../components/home/ValueProps';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HeroSection copy={MESSAGING.hero} />

        <ValueProps items={MESSAGING.valueProps} />

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {EVENT_CATEGORIES.slice(0, 6).map((category) => (
              <Link
                key={category}
                to={`/events?category=${encodeURIComponent(category)}`}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-gray-700 font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
