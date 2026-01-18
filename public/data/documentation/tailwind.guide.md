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

## Custom Font Configuration

Tailwind v4 works seamlessly with Next.js font optimization.

### Step 1: Install Fonts in Layout

In `app/layout.tsx`, import and configure Google Fonts:

```typescript
import { Inter, Merriweather, JetBrains_Mono } from 'next/font/google'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const fontSerif = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
})

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})
```

### Step 2: Apply Font Variables to HTML

Add font CSS variables to the `html` element:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Step 3: Reference in CSS

In `app/globals.css`, map font variables to theme tokens:

```css
:root {
  --font-sans: var(--font-inter), sans-serif;
  --font-serif: var(--font-merriweather), serif;
  --font-mono: var(--font-jetbrains-mono), monospace;
}

@theme {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);
}
```

### Step 4: Use in Components

```typescript
<div className="font-sans">
  <h1 className="font-serif">Heading</h1>
  <code className="font-mono">Code</code>
</div>
```

### Local Fonts

For local fonts, use `next/font/local`:

```typescript
import localFont from 'next/font/local'

const customFont = localFont({
  src: './fonts/CustomFont.woff2',
  variable: '--font-custom',
})
```

## Applying Theme Configuration

When setting up from Theme.md:

1. Check font installation instructions at the top of Theme.md
2. Install fonts in `app/layout.tsx` using next/font
3. Copy CSS variables from Theme.md to `app/globals.css`
4. Ensure both `:root` and `.dark` selectors are included
5. Add `@theme` directive to map variables to Tailwind tokens
6. Import in root layout: `import "./globals.css"`

## Browser Support

Tailwind v4 requires:
- Safari 16.4+
- Chrome 111+
- Firefox 128+

## References

- [Tailwind v4 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Next.js CSS Docs](https://nextjs.org/docs/app/getting-started/css)
