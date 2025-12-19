# Theme Customization Guide

This application uses CSS custom properties (CSS variables) to make light and dark mode themes easily customizable.

## Theme Configuration File

All theme colors are defined in `app/theme.css`. This file uses CSS variables that can be easily customized throughout the application.

## Customizing Colors

To customize the theme colors, edit the CSS variables in `app/theme.css`:

### Light Theme Colors

```css
:root {
  --bg-primary: #f9fafb; /* Main background */
  --bg-secondary: #ffffff; /* Cards, panels */
  --bg-tertiary: #f3f4f6; /* Subtle backgrounds */
  --text-primary: #1f2937; /* Headings, main text */
  --text-secondary: #4b5563; /* Body text */
  --text-tertiary: #6b7280; /* Muted text */
  --border: #e5e7eb; /* Borders */
  --border-dark: #d1d5db; /* Darker borders */

  /* Banner colors */
  --banner-bg-start: #2563eb; /* Banner gradient start */
  --banner-bg-end: #1d4ed8; /* Banner gradient end */
  --banner-border: #1e40af; /* Banner border */
  --banner-text: #ffffff; /* Banner text */
  --banner-text-hover: #dbeafe; /* Banner text on hover */
}
```

### Dark Theme Colors

```css
.dark {
  --bg-primary: #111827; /* Main background */
  --bg-secondary: #1f2937; /* Cards, panels */
  --bg-tertiary: #374151; /* Subtle backgrounds */
  --text-primary: #f9fafb; /* Headings, main text */
  --text-secondary: #e5e7eb; /* Body text */
  --text-tertiary: #d1d5db; /* Muted text */
  --border: #374151; /* Borders */
  --border-dark: #4b5563; /* Darker borders */

  /* Banner colors for dark mode */
  --banner-bg-start: #1e3a8a; /* Banner gradient start */
  --banner-bg-end: #1e40af; /* Banner gradient end */
  --banner-border: #1e40af; /* Banner border */
  --banner-text: #f0f9ff; /* Banner text */
  --banner-text-hover: #bfdbfe; /* Banner text on hover */
}
```

### Accent Colors

These colors are shared between light and dark themes:

```css
:root {
  --accent-blue: #3b82f6; /* Male nodes, primary actions */
  --accent-pink: #ec4899; /* Female nodes */
  --accent-gray: #94a3b8; /* Unknown gender nodes */
  --accent-green: #4caf50; /* Success, decorative elements */
}
```

## Using Theme Classes

The theme system provides utility classes that automatically adapt to light/dark mode:

### Background Classes

- `theme-bg-primary` - Main background color
- `theme-bg-secondary` - Secondary background (cards, panels)
- `theme-bg-tertiary` - Tertiary background (subtle elements)

### Text Classes

- `theme-text-primary` - Primary text color
- `theme-text-secondary` - Secondary text color
- `theme-text-tertiary` - Tertiary text color (muted)

### Border Classes

- `theme-border` - Standard border color
- `theme-border-dark` - Darker border color

### Banner Classes

- `theme-banner-bg` - Banner background gradient
- `theme-banner-border` - Banner border color
- `theme-banner-text` - Banner text color
- `theme-banner-text-hover` - Banner text hover color

### Shadow Classes

- `theme-shadow-sm` - Small shadow
- `theme-shadow` - Standard shadow
- `theme-shadow-md` - Medium shadow
- `theme-shadow-lg` - Large shadow

## Example Usage

```tsx
<div className="theme-bg-primary theme-text-primary">
  <h1 className="theme-text-primary">Heading</h1>
  <p className="theme-text-secondary">Body text</p>
  <div className="theme-bg-secondary theme-border border rounded-lg theme-shadow">Card content</div>
</div>
```

### Banner Example

```tsx
<header className="theme-banner-bg theme-banner-border border-b shadow-lg">
  <h1 className="theme-banner-text">Site Title</h1>
  <nav>
    <a className="theme-banner-text theme-banner-text-hover">Link</a>
  </nav>
</header>
```

## Quick Customization Examples

### Change Banner to Green Theme

```css
:root {
  --banner-bg-start: #059669; /* Emerald green */
  --banner-bg-end: #047857;
  --banner-border: #065f46;
}
```

### Change Banner to Purple Theme

```css
:root {
  --banner-bg-start: #7c3aed; /* Violet */
  --banner-bg-end: #6d28d9;
  --banner-border: #5b21b6;
}
```

### Change Banner to Dark Minimalist

```css
:root {
  --banner-bg-start: #1f2937; /* Dark gray */
  --banner-bg-end: #111827;
  --banner-border: #374151;
}
```

## Accessing CSS Variables in JavaScript

For D3.js or other JavaScript code that needs to access theme colors:

```typescript
const computedStyle = getComputedStyle(document.documentElement);
const textPrimary = computedStyle.getPropertyValue('--text-primary').trim();
const bgSecondary = computedStyle.getPropertyValue('--bg-secondary').trim();
```

## Creating Custom Theme Presets

To create additional theme presets:

1. Add a new class in `theme.css` (e.g., `.theme-sepia`, `.theme-blue`)
2. Override the CSS variables within that class
3. Apply the class to the `<html>` element to activate the theme

Example:

```css
/* Sepia Theme */
.theme-sepia {
  --bg-primary: #f4f1ea;
  --text-primary: #3e2723;
  --bg-secondary: #faf8f3;
  --text-secondary: #5d4037;
  /* ... other overrides */
}
```

## Build Process

The theme file is pure CSS and will be automatically processed by Next.js during the build process. No additional configuration is needed. Simply refresh the page after making changes to see your updates.
