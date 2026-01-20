import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../contexts/LocationContext';
import { MESSAGING, CATEGORY_CARDS } from '../utils/constants';
import LayoutContainer from '../components/common/LayoutContainer';
import HeroSection from '../components/home/HeroSection';
import CompactSearchBar from '../components/home/CompactSearchBar';
import CategoryGrid from '../components/home/CategoryGrid';
import HomeEventsPreview from '../components/home/HomeEventsPreview';
import HowSocialUpWorks from '../components/home/HowSocialUpWorks';
import { colors } from '../theme';
import { typography } from '../theme';
import { spacing } from '../theme';
import { icons } from '../theme';

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
    <div 
      className="min-h-screen"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <LayoutContainer>
        <HeroSection copy={MESSAGING.hero} />

        <div 
          style={{
            marginTop: spacing[8],
            marginBottom: spacing[16],
          }}
        >
          <CompactSearchBar onSearch={handleSearch} />
        </div>

        <HomeEventsPreview onLocationEdit={handleLocationEdit} />

        <section style={{ marginTop: spacing[20] }}>
          <div 
            className="flex items-center justify-between mb-6"
            style={{ marginBottom: spacing[6] }}
          >
            <h2 
              style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Discover by category
            </h2>
            <Link 
              to="/events" 
              className="flex items-center gap-1 group transition-colors"
              style={{
                color: colors.primary[600],
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.medium,
              }}
              onMouseEnter={(e) => e.target.style.color = colors.primary[700]}
              onMouseLeave={(e) => e.target.style.color = colors.primary[600]}
            >
              Browse all
              <svg 
                className="transform group-hover:translate-x-1 transition-transform"
                style={{
                  width: icons.size.sm,
                  height: icons.size.sm,
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={icons.strokeWidth.normal} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <CategoryGrid categories={CATEGORY_CARDS} />
        </section>

        <HowSocialUpWorks />
      </LayoutContainer>
    </div>
  );
};

export default Home;
