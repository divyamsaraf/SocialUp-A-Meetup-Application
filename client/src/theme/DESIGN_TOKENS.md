# Design Tokens Reference

Complete reference of all design tokens in the SocialUp theme system.

## Colors

### Primary Colors (Blue)
- `colors.primary[50]` - #eff6ff (Lightest)
- `colors.primary[600]` - #2563eb (Main primary - buttons, links)
- `colors.primary[900]` - #1e3a8a (Darkest)

### Secondary Colors (Purple)
- `colors.secondary[600]` - #9333ea (Main secondary)

### Gray Scale
- `colors.gray[50]` - #f9fafb (Lightest background)
- `colors.gray[200]` - #e5e7eb (Borders, dividers)
- `colors.gray[600]` - #4b5563 (Body text)
- `colors.gray[900]` - #111827 (Darkest text)

### Semantic Colors
- `colors.success[600]` - #16a34a (Success states)
- `colors.error[600]` - #dc2626 (Error states)
- `colors.warning[600]` - #d97706 (Warning states)
- `colors.info[600]` - #2563eb (Info states)

### Text Colors
- `colors.text.primary` - #111827 (Main text)
- `colors.text.secondary` - #6b7280 (Secondary text)
- `colors.text.tertiary` - #9ca3af (Tertiary text)
- `colors.text.disabled` - #d1d5db (Disabled text)
- `colors.text.link` - #2563eb (Links)

### Background Colors
- `colors.background.default` - #ffffff (White)
- `colors.background.secondary` - #f7f7f7 (Page background)
- `colors.background.tertiary` - #f9fafb (Light gray)

## Typography

### Font Sizes
- `typography.fontSize.xs` - 0.75rem (12px) - Captions
- `typography.fontSize.sm` - 0.875rem (14px) - Small text
- `typography.fontSize.base` - 1rem (16px) - Body text
- `typography.fontSize.lg` - 1.125rem (18px) - Large body
- `typography.fontSize.xl` - 1.25rem (20px) - Small headings
- `typography.fontSize['2xl']` - 1.5rem (24px) - H4
- `typography.fontSize['3xl']` - 1.875rem (30px) - H3
- `typography.fontSize['4xl']` - 2.25rem (36px) - H2
- `typography.fontSize['5xl']` - 3rem (48px) - H1
- `typography.fontSize['6xl']` - 3.75rem (60px) - Hero

### Font Weights
- `typography.fontWeight.normal` - 400
- `typography.fontWeight.medium` - 500
- `typography.fontWeight.semibold` - 600
- `typography.fontWeight.bold` - 700
- `typography.fontWeight.extrabold` - 800

### Line Heights
- `typography.lineHeight.tight` - 1.25 (Headings)
- `typography.lineHeight.normal` - 1.5 (Body text)
- `typography.lineHeight.relaxed` - 1.625 (Comfortable)

### Predefined Styles
- `typography.styles.h1` - { fontSize: '3rem', fontWeight: 800, lineHeight: 1.25 }
- `typography.styles.h2` - { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.25 }
- `typography.styles.body` - { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 }
- `typography.styles.button` - { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 }

## Spacing

### Scale
- `spacing.xs` - 0.5rem (8px)
- `spacing.sm` - 0.75rem (12px)
- `spacing.md` - 1rem (16px) - Default
- `spacing.lg` - 1.5rem (24px)
- `spacing.xl` - 2rem (32px)
- `spacing['2xl']` - 3rem (48px)
- `spacing['3xl']` - 4rem (64px)
- `spacing['4xl']` - 6rem (96px)

### Component Spacing
- `spacing.component.cardPadding.compact` - 1rem (16px)
- `spacing.component.cardPadding.default` - 1.5rem (24px)
- `spacing.component.buttonPadding.md` - 0.625rem 1.25rem
- `spacing.component.gridGap.md` - 1rem (16px)

## Border Radius

- `borderRadius.sm` - 0.125rem (2px)
- `borderRadius.base` - 0.25rem (4px)
- `borderRadius.md` - 0.375rem (6px)
- `borderRadius.lg` - 0.5rem (8px) - Default cards
- `borderRadius.xl` - 0.75rem (12px)
- `borderRadius.full` - 9999px (Pills, circles)

### Component Radius
- `borderRadius.component.button` - 9999px (Full)
- `borderRadius.component.card` - 0.5rem (8px)
- `borderRadius.component.input` - 0.5rem (8px)

## Shadows

- `shadows.sm` - Subtle shadow
- `shadows.base` - Default shadow
- `shadows.md` - Medium shadow (Default cards)
- `shadows.lg` - Large shadow (Hover state)
- `shadows.xl` - Extra large shadow
- `shadows['2xl']` - 2x large shadow

### Component Shadows
- `shadows.component.card.default` - Default card shadow
- `shadows.component.card.hover` - Card hover shadow
- `shadows.component.button.default` - Button shadow
- `shadows.component.modal` - Modal shadow

## Breakpoints

- `breakpoints.sm` - 640px (Tablets)
- `breakpoints.md` - 768px (Small laptops)
- `breakpoints.lg` - 1024px (Laptops, desktops)
- `breakpoints.xl` - 1280px (Large desktops)
- `breakpoints['2xl']` - 1536px (Ultra-wide)

### Container Widths
- `breakpoints.container['2xl']` - 1320px (Main container)

## Icons

### Sizes
- `icons.size.xs` - 0.75rem (12px)
- `icons.size.sm` - 1rem (16px)
- `icons.size.md` - 1.25rem (20px) - Default
- `icons.size.lg` - 1.5rem (24px)
- `icons.size.xl` - 2rem (32px)

### Component Icons
- `icons.component.button.md` - 1.25rem (20px)
- `icons.component.card.default` - 1rem (16px)
- `icons.component.input.default` - 1.25rem (20px)

## Cards

### Sizes
- `cards.size.compact` - { padding: '1rem', minHeight: 'auto' }
- `cards.size.medium` - { padding: '1.5rem', minHeight: '200px' }
- `cards.size.large` - { padding: '2rem', minHeight: '300px' }

### Variants
- `cards.variant.default` - White bg, border, shadow-md
- `cards.variant.elevated` - White bg, shadow-lg
- `cards.variant.outlined` - White bg, 2px border, no shadow
- `cards.variant.flat` - Gray bg, no border, no shadow

## Buttons

### Sizes
- `buttons.size.sm` - { height: '2rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }
- `buttons.size.md` - { height: '2.5rem', padding: '0.625rem 1.25rem', fontSize: '1rem' }
- `buttons.size.lg` - { height: '3rem', padding: '0.75rem 1.5rem', fontSize: '1.125rem' }

### Variants
- `buttons.variant.primary` - Blue bg, white text, shadow
- `buttons.variant.secondary` - White bg, blue text, border
- `buttons.variant.outline` - Transparent, gray border
- `buttons.variant.ghost` - Transparent, hover bg
- `buttons.variant.danger` - Red bg, white text

## Inputs

### Sizes
- `inputs.size.sm` - { height: '2rem', padding: '0.5rem 0.75rem' }
- `inputs.size.md` - { height: '2.5rem', padding: '0.625rem 1rem' }
- `inputs.size.lg` - { height: '3rem', padding: '0.75rem 1.25rem' }

### States
- `inputs.state.default` - White bg, gray border
- `inputs.state.focus` - Blue border, blue ring
- `inputs.state.error` - Red border, red ring
- `inputs.state.disabled` - Gray bg, disabled cursor

## Transitions

- `transitions.duration.fast` - 150ms
- `transitions.duration.base` - 200ms (Default)
- `transitions.duration.slow` - 300ms

- `transitions.easing.easeInOut` - cubic-bezier(0.4, 0, 0.2, 1) (Default)
- `transitions.easing.easeOut` - cubic-bezier(0, 0, 0.2, 1)

## Z-Index

- `zIndex.base` - 0
- `zIndex.dropdown` - 1000
- `zIndex.sticky` - 1020
- `zIndex.fixed` - 1030
- `zIndex.modalBackdrop` - 1040
- `zIndex.modal` - 1050
- `zIndex.tooltip` - 1070
