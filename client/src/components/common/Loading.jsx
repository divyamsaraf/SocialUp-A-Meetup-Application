import { colors } from '../../theme';
import { icons } from '../../theme';

/**
 * Loading Component - Uses theme system for consistent styling
 */
const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div 
        className="animate-spin rounded-full border-b-2"
        style={{
          width: icons.size.xl,
          height: icons.size.xl,
          borderColor: colors.primary[600],
        }}
      />
    </div>
  );
};

export default Loading;
