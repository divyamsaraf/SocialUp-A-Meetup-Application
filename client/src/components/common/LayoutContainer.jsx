import { breakpoints } from '../../theme';
import { spacing } from '../../theme';

/**
 * Shared layout container for consistent horizontal alignment
 * Uses theme system for container width and padding
 * Used by Navbar, Homepage, and all major sections
 * Ensures pixel-perfect alignment across the app
 */
const LayoutContainer = ({ children, className = '' }) => {
  return (
    <div 
      className={`mx-auto ${className}`}
      style={{
        maxWidth: breakpoints.container['2xl'],
        paddingLeft: spacing[6],
        paddingRight: spacing[6],
      }}
    >
      {children}
    </div>
  );
};

export default LayoutContainer;
