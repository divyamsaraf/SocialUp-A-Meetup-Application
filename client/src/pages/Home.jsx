import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import { MESSAGING, CATEGORY_CARDS } from '../utils/constants';
import LayoutContainer from '../components/common/LayoutContainer';
import HeroSection from '../components/home/HeroSection';
import CompactSearchBar from '../components/home/CompactSearchBar';
import CategoryGrid from '../components/home/CategoryGrid';
import HomeEventsPreview from '../components/home/HomeEventsPreview';
import HowMeetupWorks from '../components/home/HowMeetupWorks';

const Home = () => {
  const { selectedLocation } = useLocation();
  const searchBarRef = useRef(null);

  const handleLocationEdit = () => {
    // Scroll to search bar and focus location input
    const searchBarElement = document.querySelector('form[ref]') || searchBarRef.current;
    searchBarElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const locationInput = document.querySelector('input[placeholder*="city or ZIP"]');
      locationInput?.focus();
    }, 500);
  };

  const handleSearch = (query, location) => {
    // Navigate to events page with search params
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    const loc = location || selectedLocation;
    if (loc?.city) params.set('city', loc.city);
    if (loc?.state) params.set('state', loc.state);
    if (loc?.zipCode) params.set('zip', loc.zipCode);
    if (loc?.lat && loc?.lng) {
      params.set('lat', loc.lat);
      params.set('lng', loc.lng);
      params.set('radiusMiles', '25');
    }
    window.location.href = `/events?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <LayoutContainer>
        <HeroSection copy={MESSAGING.hero} />

        <div className="mt-8 mb-16">
          <CompactSearchBar onSearch={handleSearch} />
        </div>

        <HomeEventsPreview onLocationEdit={handleLocationEdit} />

        <section className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Discover by category</h2>
            <Link to="/events" className="text-blue-600 hover:text-blue-700 text-base font-medium flex items-center gap-1 group">
              Browse all
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <CategoryGrid categories={CATEGORY_CARDS} />
        </section>

        <HowMeetupWorks />
      </LayoutContainer>
    </div>
  );
};

export default Home;
