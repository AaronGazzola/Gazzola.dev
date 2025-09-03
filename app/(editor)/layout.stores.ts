import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EditorState } from "./layout.types";

const initialState = {
  welcome: `# Welcome

Welcome to the documentation system. This is a powerful markdown editor built with Lexical.

## Getting Started

This editor supports full markdown syntax including:

- **Bold text**
- *Italic text*
- \`Inline code\`
- Lists
- Links
- And much more!

Start editing to see the live preview functionality.`,
  installationIDE: `# IDE Setup

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
  installationNextjs: `# Next.js Installation

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
  installationEssentials: `# Essential Tools and Libraries

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
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      ...initialState,
      setWelcome: (content) => set({ welcome: content }),
      setInstallationIDE: (content) => set({ installationIDE: content }),
      setInstallationNextjs: (content) => set({ installationNextjs: content }),
      setInstallationEssentials: (content) => set({ installationEssentials: content }),
      reset: () => set(initialState),
    }),
    {
      name: "editor-store",
      skipHydration: true,
    }
  )
);