import { colors } from '../../theme';
import { spacing } from '../../theme';
import { borderRadius } from '../../theme';
import { typography } from '../../theme';
import { icons } from '../../theme';

/**
 * ErrorMessage Component - Uses theme system for consistent error styling
 */
const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div 
      className="relative mb-4"
      style={{
        backgroundColor: colors.error[50],
        border: `1px solid ${colors.error[400]}`,
        color: colors.error[700],
        padding: `${spacing[3]} ${spacing[4]}`,
        borderRadius: borderRadius.lg,
      }}
    >
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <span
          className="absolute top-0 bottom-0 cursor-pointer"
          style={{
            right: 0,
            padding: `${spacing[3]} ${spacing[4]}`,
          }}
          onClick={onClose}
        >
          <svg
            className="fill-current"
            style={{
              width: icons.size.md,
              height: icons.size.md,
              color: colors.error[500],
            }}
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default ErrorMessage;
