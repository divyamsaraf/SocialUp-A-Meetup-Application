import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { shadows } from '../../theme';
import { zIndex } from '../../theme';
import { transitions } from '../../theme';
import { breakpoints } from '../../theme';
import { icons } from '../../theme';
import { borderRadius } from '../../theme';
import { buttons } from '../../theme';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Full-width navbar wrapper */}
      <nav 
        className="w-full sticky top-0 transition-all"
        style={{
          backgroundColor: colors.surface.default,
          boxShadow: isScrolled ? shadows.md : 'none',
          borderBottom: isScrolled ? 'none' : `1px solid ${colors.border.default}`,
          zIndex: zIndex.component.navbar,
          transition: transitions.preset.default,
        }}
      >
        <div 
          className="mx-auto"
          style={{
            maxWidth: breakpoints.container['2xl'],
            paddingLeft: spacing[4],
            paddingRight: spacing[4],
          }}
        >
          <div className="flex justify-between items-center h-[60px]">
          {/* Left Section: Logo + Primary Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <span 
                className="transition-colors"
                style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.primary[600],
                }}
                onMouseEnter={(e) => e.target.style.color = colors.primary[700]}
                onMouseLeave={(e) => e.target.style.color = colors.primary[600]}
              >
                SocialUp
              </span>
            </Link>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/events"
                className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors py-2 border-b-2 border-transparent hover:border-blue-600"
              >
                Events
              </Link>
              <Link
                to="/groups"
                className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors py-2 border-b-2 border-transparent hover:border-blue-600"
              >
                Groups
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors py-2 border-b-2 border-transparent hover:border-blue-600"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Desktop: Create Event CTA */}
                <Link
                  to="/events/create"
                  className="hidden md:inline-flex items-center justify-center rounded-full transition-all transform hover:-translate-y-0.5"
                  style={{
                    padding: buttons.size.sm.padding,
                    backgroundColor: colors.primary[600],
                    color: colors.text.inverse,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    borderRadius: borderRadius.component.button,
                    boxShadow: shadows.sm,
                    transition: transitions.preset.button,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.primary[700];
                    e.target.style.boxShadow = shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.primary[600];
                    e.target.style.boxShadow = shadows.sm;
                  }}
                >
                  Create Event
                </Link>
                
                {/* Notification Bell */}
                <div className="hidden md:block">
                  <NotificationBell />
                </div>

                {/* User Profile */}
                {isAuthenticated && user && (
                  <Link
                    to={`/profile/${user.username}`}
                    className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                    aria-label={`View ${user?.name || user?.username || 'your'} profile`}
                  >
                    <img
                      src={user?.profile_pic || '/default-avatar.png'}
                      alt={user?.name || user?.username || 'User'}
                      className="h-8 w-8 rounded-full border-2 border-gray-200 hover:border-blue-500 transition-colors"
                      onError={(e) => {
                        // Fallback to default avatar if image fails to load
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <span className="text-sm font-medium">{user?.name || user?.username || 'Profile'}</span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Logout
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Guest: Login & Sign Up */}
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full transition-all transform hover:-translate-y-0.5"
                  style={{
                    padding: buttons.size.sm.padding,
                    backgroundColor: colors.primary[600],
                    color: colors.text.inverse,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    borderRadius: borderRadius.component.button,
                    boxShadow: shadows.sm,
                    transition: transitions.preset.button,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.primary[700];
                    e.target.style.boxShadow = shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.primary[600];
                    e.target.style.boxShadow = shadows.sm;
                  }}
                >
                  Sign up
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </>
            )}
          </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer with Backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: colors.overlay.backdrop,
          zIndex: zIndex.modalBackdrop,
          transition: `opacity ${transitions.duration.slow} ${transitions.easing.easeInOut}`,
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 md:hidden transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: colors.surface.default,
          zIndex: zIndex.modal,
          boxShadow: shadows['2xl'],
          transition: `transform ${transitions.duration.slow} ${transitions.easing.easeOut}`,
        }}
      >
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <span className="text-xl font-bold text-blue-600">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-700 hover:text-gray-900"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isAuthenticated && user && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3"
                      aria-label={`View ${user?.name || user?.username || 'your'} profile`}
                    >
                      <img
                        src={user?.profile_pic || '/default-avatar.png'}
                        alt={user?.name || user?.username || 'User'}
                        className="h-12 w-12 rounded-full"
                        onError={(e) => {
                          // Fallback to default avatar if image fails to load
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{user?.name || user?.username || 'Profile'}</div>
                        <div className="text-sm text-gray-500">View profile</div>
                      </div>
                    </Link>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <Link
                    to="/events"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    Events
                  </Link>
                  <Link
                    to="/groups"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  >
                    Groups
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/events/create"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                      >
                        Create Event
                      </Link>
                      <Link
                        to="/groups/create"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      >
                        Create Group
                      </Link>
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <NotificationBell />
                      </div>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
    </>
  );
};

export default Navbar;
