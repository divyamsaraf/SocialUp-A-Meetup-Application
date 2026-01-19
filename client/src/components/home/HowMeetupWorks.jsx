import { Link } from 'react-router-dom';
import LayoutContainer from '../common/LayoutContainer';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { transitions } from '../../theme';
import { buttons } from '../../theme';
import { cards } from '../../theme';

const HowMeetupWorks = () => {
  const steps = [
    {
      icon: '🔍',
      title: 'Discover events and groups',
      description: 'See who\'s hosting local events for all the things you love',
    },
    {
      icon: '👥',
      title: 'Find your people',
      description: 'Connect over shared interests, and enjoy meaningful experiences.',
    },
    {
      icon: '✨',
      title: 'Start a group to host events',
      description: 'Create your own group and grow a community around what matters to you.',
    },
  ];

  return (
    <section 
      style={{
        paddingTop: spacing[16],
        paddingBottom: spacing[16],
        backgroundColor: colors.surface.default,
      }}
    >
      <LayoutContainer>
        <div 
          className="text-center"
          style={{ marginBottom: spacing[12] }}
        >
          <h2 
            style={{
              fontSize: typography.fontSize['4xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
              marginBottom: spacing[2],
            }}
          >
            How Meetup works
          </h2>
          <p 
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.text.secondary,
            }}
          >
            Discover, connect, and belong
          </p>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            gap: spacing[8],
            marginBottom: spacing[12],
          }}
        >
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="transform hover:-translate-y-1 transition-all border"
              style={{
                backgroundColor: colors.surface.default,
                borderRadius: borderRadius['2xl'],
                padding: spacing[8],
                boxShadow: shadows.md,
                borderColor: colors.border.light,
                transition: transitions.preset.card,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = shadows.xl;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = shadows.md;
              }}
            >
              <div 
                style={{
                  fontSize: typography.fontSize['5xl'],
                  marginBottom: spacing[4],
                }}
              >
                {step.icon}
              </div>
              <h3 
                style={{
                  fontSize: typography.fontSize.xl,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                  marginBottom: spacing[3],
                }}
              >
                {step.title}
              </h3>
              <p 
                className="leading-relaxed"
                style={{
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/groups/create"
            className="inline-flex items-center justify-center rounded-full transform hover:-translate-y-0.5 transition-all"
            style={{
              padding: buttons.size.lg.padding,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text.inverse,
              backgroundColor: colors.primary[600],
              borderRadius: borderRadius.component.button,
              boxShadow: shadows.lg,
              transition: transitions.preset.button,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primary[700];
              e.target.style.boxShadow = shadows.xl;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.primary[600];
              e.target.style.boxShadow = shadows.lg;
            }}
          >
            Start a group
          </Link>
        </div>
      </LayoutContainer>
    </section>
  );
};

export default HowMeetupWorks;
