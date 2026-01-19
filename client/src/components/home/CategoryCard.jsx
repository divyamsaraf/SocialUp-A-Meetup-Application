import { Link } from 'react-router-dom';
import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { transitions } from '../../theme';
import { cards } from '../../theme';

const CategoryCard = ({ icon, title, description, href }) => {
  return (
    <Link
      to={href}
      className="group block transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2"
      style={{
        borderRadius: borderRadius['2xl'],
        border: `1px solid ${colors.border.default}`,
        backgroundColor: colors.surface.default,
        padding: spacing[6],
        boxShadow: shadows.md,
        transition: transitions.preset.card,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.xl;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadows.md;
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${colors.primary[500]}`;
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
      aria-label={`Explore ${title} events`}
    >
      <div className="flex items-start gap-4">
        <div 
          className="flex items-center justify-center rounded-xl text-2xl group-hover:scale-110 transition-transform"
          style={{
            height: '3.5rem',
            width: '3.5rem',
            background: `linear-gradient(to bottom right, ${colors.primary[50]}, ${colors.secondary[50]})`,
            borderRadius: borderRadius.xl,
            transition: transitions.preset.transform,
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 
            className="mb-2 transition-colors"
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text.primary,
            }}
            onMouseEnter={(e) => e.target.style.color = colors.primary[600]}
            onMouseLeave={(e) => e.target.style.color = colors.text.primary}
          >
            {title}
          </h3>
          <p 
            className="leading-relaxed"
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
