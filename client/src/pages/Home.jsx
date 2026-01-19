import { Link } from 'react-router-dom';
import { MESSAGING, CATEGORY_CARDS } from '../utils/constants';
import HeroSection from '../components/home/HeroSection';
import ValueProps from '../components/home/ValueProps';
import CategoryGrid from '../components/home/CategoryGrid';
import HomeEventsPreview from '../components/home/HomeEventsPreview';
import HowItWorks from '../components/home/HowItWorks';
import LocationSelector from '../components/location/LocationSelector';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HeroSection copy={MESSAGING.hero}>
          <div className="max-w-2xl mx-auto">
            <LocationSelector />
          </div>
        </HeroSection>

        <ValueProps items={MESSAGING.valueProps} />

        <section className="mt-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Discover by category</h2>
            <Link to="/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Browse all events
            </Link>
          </div>
          <CategoryGrid categories={CATEGORY_CARDS} />
        </section>

        <HomeEventsPreview />

        <HowItWorks />

        <section className="mt-14 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900">Ready to start something?</h2>
          <p className="text-gray-600 mt-2">
            Create a group or host an event to bring people together around what you care about.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/groups/create"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Create a group
            </Link>
            <Link
              to="/events/create"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-blue-600 text-blue-700 font-medium bg-white hover:bg-blue-50"
            >
              Host an event
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
