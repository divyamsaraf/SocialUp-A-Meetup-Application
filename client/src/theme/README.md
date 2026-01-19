# SocialUp Theme System

A centralized design system for consistent UI/UX across all SocialUp pages and components.

## Overview

The theme system provides a single source of truth for all design decisions:
- **Colors**: Primary, secondary, semantic colors, backgrounds, text
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Padding, margins, gaps
- **Components**: Cards, buttons, inputs with predefined styles
- **Layout**: Breakpoints, container widths, grid columns

## Structure

```
theme/
├── index.js          # Main entry point (exports all theme modules)
├── colors.js         # Color palette
├── typography.js     # Font system
├── spacing.js        # Spacing scale
├── borderRadius.js   # Border radius values
├── shadows.js        # Shadow/elevation system
├── breakpoints.js    # Responsive breakpoints
├── icons.js          # Icon sizes and spacing
├── cards.js          # Card component styles
├── buttons.js        # Button component styles
├── inputs.js         # Input component styles
├── transitions.js    # Animation durations and easing
├── zIndex.js         # Z-index layers
└── utils.js          # Helper functions
```

## Usage

### Basic Import

```javascript
// Import entire theme
import theme from '../theme';

// Or import specific modules
import { colors, typography, spacing } from '../theme';
```

### Using Colors

```javascript
import { colors } from '../theme';

// In Tailwind classes (recommended)
<div className="bg-blue-600 text-white">
  Content
</div>

// In inline styles
<div style={{ backgroundColor: colors.primary[600], color: colors.text.inverse }}>
  Content
</div>
```

### Using Typography

```javascript
import { typography } from '../theme';

// Using predefined styles
<h1 style={typography.styles.h1}>Heading</h1>

// Or individual properties
<p style={{
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.normal,
  lineHeight: typography.lineHeight.normal,
}}>
  Body text
</p>
```

### Using Spacing

```javascript
import { spacing } from '../theme';

// In Tailwind (recommended)
<div className="p-4 m-6">

// In inline styles
<div style={{ padding: spacing.md, margin: spacing.lg }}>
```

### Using Component Styles

```javascript
import { buttons, cards, inputs } from '../theme';

// Button styles
const buttonStyle = {
  ...buttons.base,
  ...buttons.size.md,
  ...buttons.variant.primary,
};

// Card styles
const cardStyle = {
  ...cards.base,
  ...cards.size.medium,
  ...cards.variant.default,
};
```

### Using Theme Utilities

```javascript
import { getButtonClasses, getCardClasses, getInputClasses } from '../theme/utils';

// Get Tailwind classes
const buttonClasses = getButtonClasses('primary', 'md');
const cardClasses = getCardClasses('default', 'medium', true); // with hover
const inputClasses = getInputClasses('default', 'md', 'default');
```

## Component Examples

### Button Component

```javascript
import { buttons } from '../theme';
import { getButtonClasses } from '../theme/utils';

const Button = ({ variant = 'primary', size = 'md', children }) => {
  const classes = getButtonClasses(variant, size);
  return <button className={classes}>{children}</button>;
};
```

### Card Component

```javascript
import { cards } from '../theme';
import { getCardClasses } from '../theme/utils';

const Card = ({ variant = 'default', size = 'medium', hover = false, children }) => {
  const classes = getCardClasses(variant, size, hover);
  return <div className={classes}>{children}</div>;
};
```

### Event Card Example

```javascript
import { colors, typography, spacing, icons } from '../theme';

const EventCard = ({ event }) => {
  return (
    <div style={{
      backgroundColor: colors.surface.default,
      borderRadius: cards.base.borderRadius,
      padding: cards.event.padding,
      boxShadow: cards.variant.default.boxShadow,
    }}>
      <h3 style={{
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        marginBottom: spacing.md,
      }}>
        {event.title}
      </h3>
      <p style={{
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
      }}>
        {event.description}
      </p>
    </div>
  );
};
```

## Design Tokens Reference

### Colors

- **Primary**: `colors.primary[50-900]` - Main brand color (blue)
- **Secondary**: `colors.secondary[50-900]` - Secondary brand color (purple)
- **Gray**: `colors.gray[50-900]` - Neutral grays
- **Semantic**: `colors.success`, `colors.error`, `colors.warning`, `colors.info`
- **Text**: `colors.text.primary`, `colors.text.secondary`, etc.
- **Background**: `colors.background.default`, `colors.background.secondary`

### Typography

- **Font Sizes**: `typography.fontSize.xs` through `typography.fontSize['7xl']`
- **Font Weights**: `typography.fontWeight.normal` (400) through `extrabold` (800)
- **Line Heights**: `typography.lineHeight.tight` through `loose`
- **Predefined Styles**: `typography.styles.h1` through `typography.styles.caption`

### Spacing

- **Scale**: `spacing.xs` (8px) through `spacing['4xl']` (96px)
- **Component Spacing**: `spacing.component.cardPadding`, `spacing.component.buttonPadding`
- **Grid Gaps**: `spacing.component.gridGap.md` (16px)

### Components

- **Buttons**: `buttons.variant.primary`, `buttons.size.md`
- **Cards**: `cards.size.medium`, `cards.variant.default`
- **Inputs**: `inputs.size.md`, `inputs.state.focus`

## Best Practices

1. **Use Tailwind Classes When Possible**: Tailwind is optimized and provides better performance
2. **Use Theme Constants for Dynamic Values**: When you need computed or conditional styles
3. **Consistency**: Always use theme constants instead of hardcoded values
4. **Accessibility**: Theme values are designed with accessibility in mind (contrast, font sizes)
5. **Responsive**: Use breakpoints from `breakpoints` for responsive design

## Migration Guide

To migrate existing components to use the theme:

1. Import theme constants: `import { colors, spacing } from '../theme'`
2. Replace hardcoded colors: `'#2563eb'` → `colors.primary[600]`
3. Replace hardcoded spacing: `'16px'` → `spacing.md`
4. Replace hardcoded font sizes: `'18px'` → `typography.fontSize.lg`
5. Use component styles: `cards.base`, `buttons.variant.primary`

## Adding New Variants

To add a new variant to a component:

1. Add the variant to the appropriate theme file (e.g., `buttons.js`)
2. Update the utility function in `utils.js` if needed
3. Document the new variant in this README
4. Update components to use the new variant

## Accessibility

All theme values are designed with accessibility in mind:
- **Contrast Ratios**: Text colors meet WCAG AA standards
- **Font Sizes**: Minimum 16px for body text
- **Focus States**: All interactive elements have visible focus indicators
- **Touch Targets**: Buttons meet minimum 44x44px touch target size

## Support

For questions or issues with the theme system, refer to:
- Component examples in `components/ui/`
- Theme utility functions in `theme/utils.js`
- This documentation
