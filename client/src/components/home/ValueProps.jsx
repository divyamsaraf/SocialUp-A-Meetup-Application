import { colors } from '../../theme';
import { typography } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { shadows } from '../../theme';
import { cards } from '../../theme';

const ValueProps = ({ items }) => {
  return (
    <section style={{ marginTop: spacing[16] }}>
      <div 
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ gap: spacing[6] }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="text-center flex flex-col items-center"
            style={{
              backgroundColor: colors.surface.default,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.sm,
              padding: spacing[6],
              gap: spacing[3],
            }}
          >
            <div 
              className="flex items-center justify-center rounded-full"
              style={{
                height: spacing[12],
                width: spacing[12],
                backgroundColor: colors.primary[50],
                fontSize: typography.fontSize['2xl'],
              }}
            >
              {item.icon}
            </div>
            <p 
              style={{
                color: colors.text.primary,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValueProps;
