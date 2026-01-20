import { colors } from '../../theme';
import { spacing } from '../../theme';
import { typography } from '../../theme';
import { breakpoints } from '../../theme';

/**
 * Footer Component - Uses theme system for consistent footer styling
 */
const Footer = () => {
  return (
    <footer 
      className="mt-auto"
      style={{
        backgroundColor: colors.gray[900],
        color: colors.text.inverse,
      }}
    >
      <div 
        className="mx-auto"
        style={{
          maxWidth: breakpoints.container.xl,
          padding: `${spacing[4]} ${spacing[4]}`,
          paddingTop: spacing[10],
          paddingBottom: spacing[10],
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 
              className="mb-3"
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              SocialUp
            </h3>
            <p 
              style={{
                color: colors.gray[400],
                fontSize: typography.fontSize.sm,
              }}
            >
              Where interests become real connections. Join groups, attend events, and meet people who care about what you do.
            </p>
          </div>
          <div>
            <h3 
              className="mb-3"
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Explore
            </h3>
            <ul className="space-y-2" style={{ fontSize: typography.fontSize.sm }}>
              <li><a href="/events" className="hover:text-white" style={{ color: colors.gray[300] }}>Browse Events</a></li>
              <li><a href="/groups" className="hover:text-white" style={{ color: colors.gray[300] }}>Find Groups</a></li>
              <li><a href="/events/create" className="hover:text-white" style={{ color: colors.gray[300] }}>Create Event</a></li>
              <li><a href="/groups/create" className="hover:text-white" style={{ color: colors.gray[300] }}>Create Group</a></li>
            </ul>
          </div>
          <div>
            <h3 
              className="mb-3"
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Your Account
            </h3>
            <ul className="space-y-2" style={{ fontSize: typography.fontSize.sm }}>
              <li><a href="/dashboard" className="hover:text-white" style={{ color: colors.gray[300] }}>Dashboard</a></li>
              <li><a href="/login" className="hover:text-white" style={{ color: colors.gray[300] }}>Login</a></li>
              <li><a href="/register" className="hover:text-white" style={{ color: colors.gray[300] }}>Register</a></li>
            </ul>
          </div>
          <div>
            <h3 
              className="mb-3"
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              About
            </h3>
            <p 
              style={{
                color: colors.gray[400],
                fontSize: typography.fontSize.sm,
              }}
            >
              Built for community builders, founders, and teams to create meaningful in-person and online events.
            </p>
          </div>
        </div>
        <div 
          className="text-center"
          style={{
            marginTop: spacing[10],
            paddingTop: spacing[6],
            borderTop: `1px solid ${colors.gray[800]}`,
            color: colors.gray[500],
            fontSize: typography.fontSize.sm,
          }}
        >
          <p>&copy; 2026 SocialUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
