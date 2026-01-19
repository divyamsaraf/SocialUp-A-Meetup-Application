import { Link } from 'react-router-dom';
import { colors } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { typography } from '../../theme';
import { buttons } from '../../theme';

/**
 * EmptyState Component - Uses theme system for consistent empty state styling
 */
const EmptyState = ({ icon, title, message, actionLabel, actionHref, onAction }) => {
  return (
    <div 
      className="text-center"
      style={{
        padding: `${spacing[12]} ${spacing[4]}`,
        border: `1px dashed ${colors.border.default}`,
        borderRadius: borderRadius['2xl'],
        backgroundColor: colors.background.tertiary,
      }}
    >
      <div 
        className="mb-3"
        style={{ fontSize: typography.fontSize['3xl'] }}
      >
        {icon}
      </div>
      <h3 
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.primary,
        }}
      >
        {title}
      </h3>
      <p 
        className="mt-1 mb-4"
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.text.secondary,
        }}
      >
        {message}
      </p>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link
            to={actionHref}
            className="inline-flex items-center justify-center transition-colors"
            style={{
              padding: buttons.size.sm.padding,
              borderRadius: borderRadius.md,
              backgroundColor: colors.primary[600],
              color: colors.text.inverse,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.primary[700]}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary[600]}
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center transition-colors"
            style={{
              padding: buttons.size.sm.padding,
              borderRadius: borderRadius.md,
              backgroundColor: colors.primary[600],
              color: colors.text.inverse,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.primary[700]}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary[600]}
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
