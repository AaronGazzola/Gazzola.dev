import { NavigationItem } from "@/configuration";

export const markdownContent = {
  welcome: `# Welcome

This is your custom web app road map. Follow the walkthrough to select your preferences and configure your application. You will be presented with options that will determine which content is included in your documentation, you can also edit the files directly - all changes are saved immediately.
Click the button at the bottom of the sidebar at any time to download your light-weight, comprehensive web app development instructions manual.

## What kind of web app are you making?

<!-- component-FullStackOrFrontEnd -->

<!-- section-1 -->

## App directory structure

Your app directory structure determines your route structure. Add or remove directories and files to determine the segments and paths that will be used to navigate your application

<!-- component-AppStructure -->
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

export const sections = {
  "welcome": {
    "section1": {
      "option1": "# Full stack web app\n\nThis app will include full stack features that require database integration",
      "option2": "# Front end web app\n\nThis app will be a front-end user experience, without a database"
    }
  }
};

export interface EditorState {
  welcome: string;
  installation: {
    ide: string;
    nextjs: string;
    essentials: string;
  };
  sections: Record<string, Record<string, Record<string, string>>>;
  sectionSelections: Record<string, string>;
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
  getSectionOptions: (sectionKey: string) => string[];
  getSectionContent: (sectionKey: string, option: string) => string;
  setSectionContent: (sectionKey: string, option: string, content: string) => void;
  setSectionSelection: (sectionKey: string, option: string) => void;
  getSectionSelection: (sectionKey: string) => string | null;
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
