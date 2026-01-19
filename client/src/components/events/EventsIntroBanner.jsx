import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';

const EventsIntroBanner = ({ show, text }) => {
  if (!show) return null;

  return (
    <div 
      style={{
        marginBottom: spacing[4],
        borderRadius: borderRadius.lg,
        border: `1px solid ${colors.primary[200]}`,
        backgroundColor: colors.primary[50],
        padding: `${spacing[3]} ${spacing[4]}`,
        color: colors.primary[900],
        fontSize: typography.fontSize.base,
      }}
    >
      {text}
    </div>
  );
};

export default EventsIntroBanner;
