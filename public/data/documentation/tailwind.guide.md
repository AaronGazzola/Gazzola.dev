# Tailwind CSS v4 Setup Guide

Quick reference for setting up Tailwind CSS v4 with Next.js 15.

## Key Changes from v3

Tailwind v4 introduces CSS-first configuration:
- No `tailwind.config.js` file needed
- Configuration in CSS using `@theme` directive
- Native CSS variables for design tokens
- 5x faster builds, 100x+ faster incremental builds
- Automatic content detection

## Installation

Install Tailwind CSS v4 and dependencies:

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

## PostCSS Configuration

Create or update `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  }
}
```

## CSS Setup

Update `app/globals.css` with a single import:

```css
@import "tailwindcss";
```

No need for `@tailwind base`, `@tailwind components`, or `@tailwind utilities` directives.

## Theme Configuration

Use the `@theme` directive to configure design tokens:

```css
@import "tailwindcss";

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains);

  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

## CSS Variables

Define root variables for light and dark modes:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.2686 0 0);
  --primary: oklch(0.7686 0.1647 70.0804);
  --radius: 0.375rem;
}

.dark {
  --background: oklch(0.2046 0 0);
  --foreground: oklch(0.9219 0 0);
}
```

## Using Theme Variables

Access theme variables through Tailwind utilities:

```typescript
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground rounded-lg">
    Click me
  </button>
</div>
```

## Applying Theme Configuration

When setting up from Theme.md:

1. Copy CSS variables from Theme.md to `app/globals.css`
2. Ensure both `:root` and `.dark` selectors are included
3. Add `@theme` directive to map variables to Tailwind tokens
4. Import in root layout: `import "./globals.css"`

## Browser Support

Tailwind v4 requires:
- Safari 16.4+
- Chrome 111+
- Firefox 128+

## References

- [Tailwind v4 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Next.js CSS Docs](https://nextjs.org/docs/app/getting-started/css)
