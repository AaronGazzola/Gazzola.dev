import { NavigationItem } from "@/configuration";

export interface DynamicComponent {
  id: string;
  type: 'select';
  options: Record<string, string>;
  position: number;
}

export const markdownContent = {
  welcome: `# Welcome

Welcome to the documentation system. This is a powerful markdown editor built with Lexical.

## Getting Started

This editor supports full markdown syntax including:

- **Bold text**
- _Italic text_
- \`Inline code\`
- Lists
- Links
- And much more!

Start editing to see the live preview functionality.

## Interactive Components

This editor also supports dynamic components! Try the example below:

<!-- select:options:{"Getting Started":"<strong>Getting Started</strong><br/>Begin your journey with this powerful markdown editor. Learn the basics of editing, formatting, and using advanced features.","Features":"<strong>Editor Features</strong><br/>• Live markdown preview<br/>• Dynamic components<br/>• Syntax highlighting<br/>• Theme switching","Tips":"<strong>Pro Tips</strong><br/>Use Ctrl+Z for undo, Ctrl+Y for redo. The editor supports all standard markdown shortcuts and auto-formatting."} -->

The select component above demonstrates how you can create interactive content within your markdown documents. Users can choose different options to see relevant information displayed dynamically.
`,
  installation: {
    ide: `# IDE Setup

Setting up your Integrated Development Environment for optimal development experience.

## Recommended IDEs

### Visual Studio Code
- **Download**: [VS Code](https://code.visualstudio.com/)
- **Extensions**: 
  - TypeScript and JavaScript Language Features
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter

### WebStorm
- **Download**: [WebStorm](https://www.jetbrains.com/webstorm/)
- Built-in TypeScript and React support
- Excellent refactoring tools

## Configuration

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
\`\`\``,
    nextjs: `# Next.js Installation

Learn how to install and configure Next.js for your project.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (version 18.x or higher)
- **npm** or **yarn** package manager

## Installation

### Create a new Next.js app

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

### Manual Installation

\`\`\`bash
npm install next@latest react@latest react-dom@latest
\`\`\`

## Project Structure

\`\`\`
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
├── public/
├── package.json
└── next.config.js
\`\`\`

## Configuration

### next.config.js

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
\`\`\``,
    essentials: `# Essential Tools and Libraries

Essential development tools and libraries to enhance your development workflow.

## Package Managers

### npm
\`\`\`bash
npm install package-name
npm install -g package-name
npm run script-name
\`\`\`

### Yarn
\`\`\`bash
yarn add package-name
yarn global add package-name
yarn script-name
\`\`\`

### pnpm
\`\`\`bash
pnpm add package-name
pnpm add -g package-name
pnpm run script-name
\`\`\`

## Development Tools

### ESLint
\`\`\`bash
npm install -D eslint
npx eslint --init
\`\`\`

### Prettier
\`\`\`bash
npm install -D prettier
echo "{}" > .prettierrc.json
\`\`\`

### TypeScript
\`\`\`bash
npm install -D typescript @types/node @types/react @types/react-dom
npx tsc --init
\`\`\`

## UI Libraries

### Tailwind CSS
\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

### Shadcn/ui
\`\`\`bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
\`\`\``
  }
};

export const navigationData: NavigationItem[] = [
  {
    "name": "welcome",
    "type": "page",
    "order": 1
  },
  {
    "name": "installation",
    "type": "segment",
    "children": [
      {
        "name": "IDE",
        "type": "page",
        "order": 2
      },
      {
        "name": "Next.js",
        "type": "page",
        "order": 3
      },
      {
        "name": "Essentials",
        "type": "page",
        "order": 4
      }
    ]
  }
];

export const urlToContentPathMapping = {
  "welcome": "welcome",
  "installation": {
    "ide": "installation.ide",
    "next.js": "installation.nextjs",
    "essentials": "installation.essentials"
  }
};

export const dynamicComponents: Record<string, DynamicComponent[]> = {
  "welcome": [
    {
      "id": "dynamic-0",
      "type": "select",
      "options": {
        "Getting Started": "<strong>Getting Started</strong><br/>Begin your journey with this powerful markdown editor. Learn the basics of editing, formatting, and using advanced features.",
        "Features": "<strong>Editor Features</strong><br/>• Live markdown preview<br/>• Dynamic components<br/>• Syntax highlighting<br/>• Theme switching",
        "Tips": "<strong>Pro Tips</strong><br/>Use Ctrl+Z for undo, Ctrl+Y for redo. The editor supports all standard markdown shortcuts and auto-formatting."
      },
      "position": 411
    }
  ]
};

export interface EditorState {
  welcome: string;
  installation: {
    ide: string;
    nextjs: string;
    essentials: string;
  };
  darkMode: boolean;
  refreshKey: number;
  visitedPages: ContentPath[];
  setContent: (path: ContentPath, content: string) => void;
  getContent: (path: ContentPath) => string;
  setDarkMode: (darkMode: boolean) => void;
  markPageVisited: (path: ContentPath) => void;
  isPageVisited: (path: ContentPath) => boolean;
  getNextUnvisitedPage: (currentPath: ContentPath) => ContentPath | null;
  reset: () => void;
  forceRefresh: () => void;
}

export type ContentPath =
  | "welcome"
  | "installation.ide"
  | "installation.nextjs"
  | "installation.essentials";

export type DocumentKey =
  | "welcome"
  | "installationIde"
  | "installationNextjs"
  | "installationEssentials";

export const getAllPagesInOrder = (): { path: ContentPath; url: string; title: string; order: number }[] => {
  const pages: { path: ContentPath; url: string; title: string; order: number }[] = [];

  const flattenNavigation = (items: NavigationItem[]) => {
    items.forEach((item) => {
      if (item.type === "page") {
        pages.push({
          path: item.name as ContentPath,
          url: `/${item.name}`,
          title: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          order: item.order || 0
        });
      } else if (item.type === "segment" && item.children) {
        item.children.forEach((child) => {
          if (child.type === "page") {
            const childNameLower = child.name.toLowerCase();
            const pathSuffix = childNameLower === "next.js" ? "nextjs" : childNameLower;
            const path = `${item.name}.${pathSuffix}` as ContentPath;
            const url = `/${item.name}/${childNameLower}`;
            pages.push({
              path,
              url,
              title: child.name,
              order: child.order || 0
            });
          }
        });
      }
    });
  };

  flattenNavigation(navigationData);
  return pages.sort((a, b) => a.order - b.order);
};
