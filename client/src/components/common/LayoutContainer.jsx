/**
 * Shared layout container for consistent horizontal alignment
 * Used by Navbar, Homepage, and all major sections
 * Ensures pixel-perfect alignment across the app
 */
const LayoutContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-[1320px] mx-auto px-6 ${className}`}>
      {children}
    </div>
  );
};

export default LayoutContainer;
