# Next.js Installation

Learn how to install and configure Next.js for your project.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (version 18.x or higher)
- **npm** or **yarn** package manager

## Installation

### Create a new Next.js app

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

### Manual Installation

```bash
npm install next@latest react@latest react-dom@latest
```

## Project Structure

```
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
├── public/
├── package.json
└── next.config.js
```

## Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
```