import { Link } from 'react-router-dom';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { transitions } from '../../theme';
import { buttons } from '../../theme';

const HeroSection = ({ copy }) => {
  return (
    <section 
      className="relative overflow-hidden"
      style={{ backgroundColor: colors.surface.default }}
    >
      {/* Gradient background with subtle shapes */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `linear-gradient(to bottom right, ${colors.primary[50]}, ${colors.secondary[50]}, ${colors.accent[50]})`,
        }}
      />
      <div 
        className="absolute top-0 right-0 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
        style={{
          width: '24rem',
          height: '24rem',
          backgroundColor: colors.primary[200],
        }}
      />
      <div 
        className="absolute bottom-0 left-0 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
        style={{
          width: '24rem',
          height: '24rem',
          backgroundColor: colors.secondary[200],
        }}
      />
      
      <div 
        className="relative text-center"
        style={{
          paddingTop: spacing[16],
          paddingBottom: spacing[16],
        }}
      >
        <h1 
          className="leading-tight"
          style={{
            fontSize: typography.fontSize['5xl'],
            fontWeight: typography.fontWeight.extrabold,
            color: colors.text.primary,
            lineHeight: typography.lineHeight.tight,
          }}
        >
          {copy.headline}
        </h1>
        <p 
          className="max-w-2xl mx-auto leading-relaxed"
          style={{
            marginTop: spacing[6],
            fontSize: typography.fontSize.xl,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {copy.subheadline}
        </p>
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          style={{ marginTop: spacing[10] }}
        >
          <Link
            to="/events"
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
            {copy.primaryCta}
          </Link>
          <Link
            to="/groups/create"
            className="inline-flex items-center justify-center rounded-full transform hover:-translate-y-0.5 transition-all"
            style={{
              padding: buttons.size.lg.padding,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.primary[700],
              backgroundColor: colors.surface.default,
              border: `2px solid ${colors.primary[600]}`,
              borderRadius: borderRadius.component.button,
              boxShadow: shadows.md,
              transition: transitions.preset.button,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.primary[50];
              e.target.style.boxShadow = shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.surface.default;
              e.target.style.boxShadow = shadows.md;
            }}
          >
            {copy.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
