# Shadcn/ui Setup Guide

Quick reference for installing and configuring shadcn/ui with Next.js 15.

## Installation

Initialize shadcn/ui in your Next.js project:

```bash
npx shadcn@latest init -d
```

The `-d` flag accepts all default configuration options.

## Install All Components

Add all available shadcn components in one command:

```bash
npx shadcn@latest add --all
```

**For npm users with React 19**: Use the `--legacy-peer-deps` flag if prompted to resolve peer dependency conflicts.

## Theme Integration

Shadcn components use CSS variables for theming. After installation, ensure your theme configuration is applied in `app/globals.css`.

### Example Theme Variables

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.2686 0 0);
  --primary: oklch(0.7686 0.1647 70.0804);
  --primary-foreground: oklch(0 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.2686 0 0);
}
```

Shadcn components will automatically use these variables.

## Component Usage

Import components from `@/components/ui/`:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";

export default function Page() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

## Customizing Components

Shadcn copies component source into your project. Modify components directly in `components/ui/` to customize:

- Update styles by changing Tailwind classes
- Modify component behavior by editing the source
- Add new variants by extending the component

All shadcn components support the `className` prop for additional styling.

## Common Components

Most frequently used components:

- `Button` - Interactive buttons with variants
- `Card` - Content containers
- `Dialog` - Modal dialogs
- `Form` - Form components with validation
- `Input` - Text input fields
- `Select` - Dropdown selects
- `Table` - Data tables
- `Tabs` - Tab navigation
- `Toast` - Notifications

## References

- [Official Docs](https://ui.shadcn.com/docs/installation/next)
- [Component Library](https://ui.shadcn.com/docs/components)
- Template files: `/documentation/template_files/`
