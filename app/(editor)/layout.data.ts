import {
  MarkdownData,
} from "./layout.types";

export const markdownData: MarkdownData = {
  "root": {
    "id": "root",
    "name": "root",
    "displayName": "Root",
    "type": "directory",
    "path": "",
    "urlPath": "/",
    "include": true,
    "children": [
      {
        "id": "database",
        "name": "database",
        "displayName": "Database",
        "type": "directory",
        "path": "database",
        "urlPath": "/database*",
        "include": false,
        "children": [
          {
            "id": "database.installation",
            "name": "installation",
            "displayName": "installation",
            "type": "file",
            "order": 5,
            "path": "database.installation",
            "urlPath": "/database*/installation",
            "content": "installation\n",
            "components": [],
            "sections": {},
            "include": false
          },
          {
            "id": "database.schema",
            "name": "schema",
            "displayName": "schema",
            "type": "file",
            "order": 6,
            "path": "database.schema",
            "urlPath": "/database*/schema",
            "content": "schema\n",
            "components": [],
            "sections": {},
            "include": false
          },
          {
            "id": "database.rls",
            "name": "rls",
            "displayName": "RLS",
            "type": "file",
            "order": 7,
            "path": "database.rls",
            "urlPath": "/database*/rls",
            "content": "rls\n",
            "components": [],
            "sections": {},
            "include": false
          }
        ]
      },
      {
        "id": "installation",
        "name": "installation",
        "displayName": "Installation",
        "type": "directory",
        "path": "installation",
        "urlPath": "/installation",
        "include": true,
        "children": [
          {
            "id": "installation.nextjs",
            "name": "nextjs",
            "displayName": "Next.js",
            "type": "file",
            "order": 3,
            "path": "installation.nextjs",
            "urlPath": "/installation/next.js",
            "content": "# Next.js Installation\n\nLearn how to install and configure Next.js for your project.\n\n## Prerequisites\n\nMake sure you have the following installed:\n- **Node.js** (version 18.x or higher)\n- **npm** or **yarn** package manager\n\n## Installation\n\n### Create a new Next.js app\n\n\\`\\`\\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\\`\\`\\`\n\n### Manual Installation\n\n\\`\\`\\`bash\nnpm install next@latest react@latest react-dom@latest\n\\`\\`\\`\n\n## Project Structure\n\n\\`\\`\\`\nmy-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n├── public/\n├── package.json\n└── next.config.js\n\\`\\`\\`\n\n## Configuration\n\n### next.config.js\n\n\\`\\`\\`javascript\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    appDir: true\n  }\n}\n\nmodule.exports = nextConfig\n\\`\\`\\`",
            "components": [],
            "sections": {},
            "include": true
          },
          {
            "id": "installation.essentials",
            "name": "essentials",
            "displayName": "Essentials",
            "type": "file",
            "order": 4,
            "path": "installation.essentials",
            "urlPath": "/installation/essentials",
            "content": "# Essential Tools and Libraries\n\nEssential development tools and libraries to enhance your development workflow.\n\n## Package Managers\n\n### npm\n\\`\\`\\`bash\nnpm install package-name\nnpm install -g package-name\nnpm run script-name\n\\`\\`\\`\n\n### Yarn\n\\`\\`\\`bash\nyarn add package-name\nyarn global add package-name\nyarn script-name\n\\`\\`\\`\n\n### pnpm\n\\`\\`\\`bash\npnpm add package-name\npnpm add -g package-name\npnpm run script-name\n\\`\\`\\`\n\n## Development Tools\n\n### ESLint\n\\`\\`\\`bash\nnpm install -D eslint\nnpx eslint --init\n\\`\\`\\`\n\n### Prettier\n\\`\\`\\`bash\nnpm install -D prettier\necho \"{}\" > .prettierrc.json\n\\`\\`\\`\n\n### TypeScript\n\\`\\`\\`bash\nnpm install -D typescript @types/node @types/react @types/react-dom\nnpx tsc --init\n\\`\\`\\`\n\n## UI Libraries\n\n### Tailwind CSS\n\\`\\`\\`bash\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p\n\\`\\`\\`\n\n### Shadcn/ui\n\\`\\`\\`bash\nnpx shadcn-ui@latest init\nnpx shadcn-ui@latest add button\n\\`\\`\\`",
            "components": [],
            "sections": {},
            "include": true
          }
        ]
      },
      {
        "id": "welcome",
        "name": "welcome",
        "displayName": "Welcome",
        "type": "directory",
        "path": "welcome",
        "urlPath": "/welcome",
        "include": true,
        "children": [
          {
            "id": "welcome.intro",
            "name": "intro",
            "displayName": "intro",
            "type": "file",
            "order": 1,
            "path": "welcome.intro",
            "urlPath": "/welcome/intro",
            "content": "# Welcome\n\nThis is your custom web app road map. Follow the walkthrough to select your preferences and configure your application. You will be presented with options that will determine which content is included in your documentation, you can also edit the files directly - all changes are saved immediately.\nClick the button at the bottom of the sidebar at any time to download your light-weight, comprehensive web app development instructions manual.\n\n## What kind of web app are you making?\n\n<!-- component-FullStackOrFrontEnd -->\n\n<!-- section-1 -->\n\n## App directory structure\n\nYour app directory structure determines your route structure. Add or remove directories and files to determine the segments and paths that will be used to navigate your application\n\n<!-- component-AppStructure -->\n",
            "components": [
              {
                "id": "component-FullStackOrFrontEnd",
                "name": "FullStackOrFrontEnd",
                "displayName": "FullStackOrFrontEnd",
                "type": "component",
                "path": "intro.component.FullStackOrFrontEnd",
                "urlPath": "",
                "componentId": "FullStackOrFrontEnd",
                "include": true
              },
              {
                "id": "component-AppStructure",
                "name": "AppStructure",
                "displayName": "AppStructure",
                "type": "component",
                "path": "intro.component.AppStructure",
                "urlPath": "",
                "componentId": "AppStructure",
                "include": true
              }
            ],
            "sections": {
              "section1": {
                "option1": {
                  "content": "# Full stack web app\n\nThis app will include full stack features that require database integration",
                  "include": true
                },
                "option2": {
                  "content": "# Front end web app\n\nThis app will be a front-end user experience, without a database",
                  "include": true
                }
              }
            },
            "include": true
          },
          {
            "id": "welcome.hello",
            "name": "hello",
            "displayName": "hello",
            "type": "file",
            "order": 2,
            "path": "welcome.hello",
            "urlPath": "/welcome/hello",
            "content": "<!-- component-HelloSwitch -->\n\n<!-- section-1 -->\n",
            "components": [
              {
                "id": "component-HelloSwitch",
                "name": "HelloSwitch",
                "displayName": "HelloSwitch",
                "type": "component",
                "path": "hello.component.HelloSwitch",
                "urlPath": "",
                "componentId": "HelloSwitch",
                "include": true
              }
            ],
            "sections": {
              "section1": {
                "option1": {
                  "content": "# Hello there",
                  "include": false
                },
                "option2": {
                  "content": "# Greetings",
                  "include": false
                }
              }
            },
            "include": true
          }
        ]
      }
    ]
  },
  "flatIndex": {
    "": {
      "id": "root",
      "name": "root",
      "displayName": "Root",
      "type": "directory",
      "path": "",
      "urlPath": "/",
      "include": true,
      "children": [
        {
          "id": "database",
          "name": "database",
          "displayName": "Database",
          "type": "directory",
          "path": "database",
          "urlPath": "/database*",
          "include": false,
          "children": [
            {
              "id": "database.installation",
              "name": "installation",
              "displayName": "installation",
              "type": "file",
              "order": 5,
              "path": "database.installation",
              "urlPath": "/database*/installation",
              "content": "installation\n",
              "components": [],
              "sections": {},
              "include": false
            },
            {
              "id": "database.schema",
              "name": "schema",
              "displayName": "schema",
              "type": "file",
              "order": 6,
              "path": "database.schema",
              "urlPath": "/database*/schema",
              "content": "schema\n",
              "components": [],
              "sections": {},
              "include": false
            },
            {
              "id": "database.rls",
              "name": "rls",
              "displayName": "RLS",
              "type": "file",
              "order": 7,
              "path": "database.rls",
              "urlPath": "/database*/rls",
              "content": "rls\n",
              "components": [],
              "sections": {},
              "include": false
            }
          ]
        },
        {
          "id": "installation",
          "name": "installation",
          "displayName": "Installation",
          "type": "directory",
          "path": "installation",
          "urlPath": "/installation",
          "include": true,
          "children": [
            {
              "id": "installation.nextjs",
              "name": "nextjs",
              "displayName": "Next.js",
              "type": "file",
              "order": 3,
              "path": "installation.nextjs",
              "urlPath": "/installation/next.js",
              "content": "# Next.js Installation\n\nLearn how to install and configure Next.js for your project.\n\n## Prerequisites\n\nMake sure you have the following installed:\n- **Node.js** (version 18.x or higher)\n- **npm** or **yarn** package manager\n\n## Installation\n\n### Create a new Next.js app\n\n\\`\\`\\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\\`\\`\\`\n\n### Manual Installation\n\n\\`\\`\\`bash\nnpm install next@latest react@latest react-dom@latest\n\\`\\`\\`\n\n## Project Structure\n\n\\`\\`\\`\nmy-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n├── public/\n├── package.json\n└── next.config.js\n\\`\\`\\`\n\n## Configuration\n\n### next.config.js\n\n\\`\\`\\`javascript\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    appDir: true\n  }\n}\n\nmodule.exports = nextConfig\n\\`\\`\\`",
              "components": [],
              "sections": {},
              "include": true
            },
            {
              "id": "installation.essentials",
              "name": "essentials",
              "displayName": "Essentials",
              "type": "file",
              "order": 4,
              "path": "installation.essentials",
              "urlPath": "/installation/essentials",
              "content": "# Essential Tools and Libraries\n\nEssential development tools and libraries to enhance your development workflow.\n\n## Package Managers\n\n### npm\n\\`\\`\\`bash\nnpm install package-name\nnpm install -g package-name\nnpm run script-name\n\\`\\`\\`\n\n### Yarn\n\\`\\`\\`bash\nyarn add package-name\nyarn global add package-name\nyarn script-name\n\\`\\`\\`\n\n### pnpm\n\\`\\`\\`bash\npnpm add package-name\npnpm add -g package-name\npnpm run script-name\n\\`\\`\\`\n\n## Development Tools\n\n### ESLint\n\\`\\`\\`bash\nnpm install -D eslint\nnpx eslint --init\n\\`\\`\\`\n\n### Prettier\n\\`\\`\\`bash\nnpm install -D prettier\necho \"{}\" > .prettierrc.json\n\\`\\`\\`\n\n### TypeScript\n\\`\\`\\`bash\nnpm install -D typescript @types/node @types/react @types/react-dom\nnpx tsc --init\n\\`\\`\\`\n\n## UI Libraries\n\n### Tailwind CSS\n\\`\\`\\`bash\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p\n\\`\\`\\`\n\n### Shadcn/ui\n\\`\\`\\`bash\nnpx shadcn-ui@latest init\nnpx shadcn-ui@latest add button\n\\`\\`\\`",
              "components": [],
              "sections": {},
              "include": true
            }
          ]
        },
        {
          "id": "welcome",
          "name": "welcome",
          "displayName": "Welcome",
          "type": "directory",
          "path": "welcome",
          "urlPath": "/welcome",
          "include": true,
          "children": [
            {
              "id": "welcome.intro",
              "name": "intro",
              "displayName": "intro",
              "type": "file",
              "order": 1,
              "path": "welcome.intro",
              "urlPath": "/welcome/intro",
              "content": "# Welcome\n\nThis is your custom web app road map. Follow the walkthrough to select your preferences and configure your application. You will be presented with options that will determine which content is included in your documentation, you can also edit the files directly - all changes are saved immediately.\nClick the button at the bottom of the sidebar at any time to download your light-weight, comprehensive web app development instructions manual.\n\n## What kind of web app are you making?\n\n<!-- component-FullStackOrFrontEnd -->\n\n<!-- section-1 -->\n\n## App directory structure\n\nYour app directory structure determines your route structure. Add or remove directories and files to determine the segments and paths that will be used to navigate your application\n\n<!-- component-AppStructure -->\n",
              "components": [
                {
                  "id": "component-FullStackOrFrontEnd",
                  "name": "FullStackOrFrontEnd",
                  "displayName": "FullStackOrFrontEnd",
                  "type": "component",
                  "path": "intro.component.FullStackOrFrontEnd",
                  "urlPath": "",
                  "componentId": "FullStackOrFrontEnd",
                  "include": true
                },
                {
                  "id": "component-AppStructure",
                  "name": "AppStructure",
                  "displayName": "AppStructure",
                  "type": "component",
                  "path": "intro.component.AppStructure",
                  "urlPath": "",
                  "componentId": "AppStructure",
                  "include": true
                }
              ],
              "sections": {
                "section1": {
                  "option1": {
                    "content": "# Full stack web app\n\nThis app will include full stack features that require database integration",
                    "include": false
                  },
                  "option2": {
                    "content": "# Front end web app\n\nThis app will be a front-end user experience, without a database",
                    "include": false
                  }
                }
              },
              "include": true
            },
            {
              "id": "welcome.hello",
              "name": "hello",
              "displayName": "hello",
              "type": "file",
              "order": 2,
              "path": "welcome.hello",
              "urlPath": "/welcome/hello",
              "content": "<!-- component-HelloSwitch -->\n\n<!-- section-1 -->\n",
              "components": [
                {
                  "id": "component-HelloSwitch",
                  "name": "HelloSwitch",
                  "displayName": "HelloSwitch",
                  "type": "component",
                  "path": "hello.component.HelloSwitch",
                  "urlPath": "",
                  "componentId": "HelloSwitch",
                  "include": true
                }
              ],
              "sections": {
                "section1": {
                  "option1": {
                    "content": "# Hello there",
                    "include": false
                  },
                  "option2": {
                    "content": "# Greetings",
                    "include": false
                  }
                }
              },
              "include": true
            }
          ]
        }
      ]
    },
    "database": {
      "id": "database",
      "name": "database",
      "displayName": "Database",
      "type": "directory",
      "path": "database",
      "urlPath": "/database*",
      "include": false,
      "children": [
        {
          "id": "database.installation",
          "name": "installation",
          "displayName": "installation",
          "type": "file",
          "order": 5,
          "path": "database.installation",
          "urlPath": "/database*/installation",
          "content": "installation\n",
          "components": [],
          "sections": {},
          "include": false
        },
        {
          "id": "database.schema",
          "name": "schema",
          "displayName": "schema",
          "type": "file",
          "order": 6,
          "path": "database.schema",
          "urlPath": "/database*/schema",
          "content": "schema\n",
          "components": [],
          "sections": {},
          "include": false
        },
        {
          "id": "database.rls",
          "name": "rls",
          "displayName": "RLS",
          "type": "file",
          "order": 7,
          "path": "database.rls",
          "urlPath": "/database*/rls",
          "content": "rls\n",
          "components": [],
          "sections": {},
          "include": false
        }
      ]
    },
    "database.installation": {
      "id": "database.installation",
      "name": "installation",
      "displayName": "installation",
      "type": "file",
      "order": 5,
      "path": "database.installation",
      "urlPath": "/database*/installation",
      "content": "installation\n",
      "components": [],
      "sections": {},
      "include": false
    },
    "database.schema": {
      "id": "database.schema",
      "name": "schema",
      "displayName": "schema",
      "type": "file",
      "order": 6,
      "path": "database.schema",
      "urlPath": "/database*/schema",
      "content": "schema\n",
      "components": [],
      "sections": {},
      "include": false
    },
    "database.rls": {
      "id": "database.rls",
      "name": "rls",
      "displayName": "RLS",
      "type": "file",
      "order": 7,
      "path": "database.rls",
      "urlPath": "/database*/rls",
      "content": "rls\n",
      "components": [],
      "sections": {},
      "include": false
    },
    "installation": {
      "id": "installation",
      "name": "installation",
      "displayName": "Installation",
      "type": "directory",
      "path": "installation",
      "urlPath": "/installation",
      "include": true,
      "children": [
        {
          "id": "installation.nextjs",
          "name": "nextjs",
          "displayName": "Next.js",
          "type": "file",
          "order": 3,
          "path": "installation.nextjs",
          "urlPath": "/installation/next.js",
          "content": "# Next.js Installation\n\nLearn how to install and configure Next.js for your project.\n\n## Prerequisites\n\nMake sure you have the following installed:\n- **Node.js** (version 18.x or higher)\n- **npm** or **yarn** package manager\n\n## Installation\n\n### Create a new Next.js app\n\n\\`\\`\\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\\`\\`\\`\n\n### Manual Installation\n\n\\`\\`\\`bash\nnpm install next@latest react@latest react-dom@latest\n\\`\\`\\`\n\n## Project Structure\n\n\\`\\`\\`\nmy-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n├── public/\n├── package.json\n└── next.config.js\n\\`\\`\\`\n\n## Configuration\n\n### next.config.js\n\n\\`\\`\\`javascript\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    appDir: true\n  }\n}\n\nmodule.exports = nextConfig\n\\`\\`\\`",
          "components": [],
          "sections": {},
          "include": true
        },
        {
          "id": "installation.essentials",
          "name": "essentials",
          "displayName": "Essentials",
          "type": "file",
          "order": 4,
          "path": "installation.essentials",
          "urlPath": "/installation/essentials",
          "content": "# Essential Tools and Libraries\n\nEssential development tools and libraries to enhance your development workflow.\n\n## Package Managers\n\n### npm\n\\`\\`\\`bash\nnpm install package-name\nnpm install -g package-name\nnpm run script-name\n\\`\\`\\`\n\n### Yarn\n\\`\\`\\`bash\nyarn add package-name\nyarn global add package-name\nyarn script-name\n\\`\\`\\`\n\n### pnpm\n\\`\\`\\`bash\npnpm add package-name\npnpm add -g package-name\npnpm run script-name\n\\`\\`\\`\n\n## Development Tools\n\n### ESLint\n\\`\\`\\`bash\nnpm install -D eslint\nnpx eslint --init\n\\`\\`\\`\n\n### Prettier\n\\`\\`\\`bash\nnpm install -D prettier\necho \"{}\" > .prettierrc.json\n\\`\\`\\`\n\n### TypeScript\n\\`\\`\\`bash\nnpm install -D typescript @types/node @types/react @types/react-dom\nnpx tsc --init\n\\`\\`\\`\n\n## UI Libraries\n\n### Tailwind CSS\n\\`\\`\\`bash\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p\n\\`\\`\\`\n\n### Shadcn/ui\n\\`\\`\\`bash\nnpx shadcn-ui@latest init\nnpx shadcn-ui@latest add button\n\\`\\`\\`",
          "components": [],
          "sections": {},
          "include": true
        }
      ]
    },
    "installation.nextjs": {
      "id": "installation.nextjs",
      "name": "nextjs",
      "displayName": "Next.js",
      "type": "file",
      "order": 3,
      "path": "installation.nextjs",
      "urlPath": "/installation/next.js",
      "content": "# Next.js Installation\n\nLearn how to install and configure Next.js for your project.\n\n## Prerequisites\n\nMake sure you have the following installed:\n- **Node.js** (version 18.x or higher)\n- **npm** or **yarn** package manager\n\n## Installation\n\n### Create a new Next.js app\n\n\\`\\`\\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\\`\\`\\`\n\n### Manual Installation\n\n\\`\\`\\`bash\nnpm install next@latest react@latest react-dom@latest\n\\`\\`\\`\n\n## Project Structure\n\n\\`\\`\\`\nmy-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n├── public/\n├── package.json\n└── next.config.js\n\\`\\`\\`\n\n## Configuration\n\n### next.config.js\n\n\\`\\`\\`javascript\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    appDir: true\n  }\n}\n\nmodule.exports = nextConfig\n\\`\\`\\`",
      "components": [],
      "sections": {},
      "include": true
    },
    "installation.essentials": {
      "id": "installation.essentials",
      "name": "essentials",
      "displayName": "Essentials",
      "type": "file",
      "order": 4,
      "path": "installation.essentials",
      "urlPath": "/installation/essentials",
      "content": "# Essential Tools and Libraries\n\nEssential development tools and libraries to enhance your development workflow.\n\n## Package Managers\n\n### npm\n\\`\\`\\`bash\nnpm install package-name\nnpm install -g package-name\nnpm run script-name\n\\`\\`\\`\n\n### Yarn\n\\`\\`\\`bash\nyarn add package-name\nyarn global add package-name\nyarn script-name\n\\`\\`\\`\n\n### pnpm\n\\`\\`\\`bash\npnpm add package-name\npnpm add -g package-name\npnpm run script-name\n\\`\\`\\`\n\n## Development Tools\n\n### ESLint\n\\`\\`\\`bash\nnpm install -D eslint\nnpx eslint --init\n\\`\\`\\`\n\n### Prettier\n\\`\\`\\`bash\nnpm install -D prettier\necho \"{}\" > .prettierrc.json\n\\`\\`\\`\n\n### TypeScript\n\\`\\`\\`bash\nnpm install -D typescript @types/node @types/react @types/react-dom\nnpx tsc --init\n\\`\\`\\`\n\n## UI Libraries\n\n### Tailwind CSS\n\\`\\`\\`bash\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p\n\\`\\`\\`\n\n### Shadcn/ui\n\\`\\`\\`bash\nnpx shadcn-ui@latest init\nnpx shadcn-ui@latest add button\n\\`\\`\\`",
      "components": [],
      "sections": {},
      "include": true
    },
    "welcome": {
      "id": "welcome",
      "name": "welcome",
      "displayName": "Welcome",
      "type": "directory",
      "path": "welcome",
      "urlPath": "/welcome",
      "include": true,
      "children": [
        {
          "id": "welcome.intro",
          "name": "intro",
          "displayName": "intro",
          "type": "file",
          "order": 1,
          "path": "welcome.intro",
          "urlPath": "/welcome/intro",
          "content": "# Welcome\n\nThis is your custom web app road map. Follow the walkthrough to select your preferences and configure your application. You will be presented with options that will determine which content is included in your documentation, you can also edit the files directly - all changes are saved immediately.\nClick the button at the bottom of the sidebar at any time to download your light-weight, comprehensive web app development instructions manual.\n\n## What kind of web app are you making?\n\n<!-- component-FullStackOrFrontEnd -->\n\n<!-- section-1 -->\n\n## App directory structure\n\nYour app directory structure determines your route structure. Add or remove directories and files to determine the segments and paths that will be used to navigate your application\n\n<!-- component-AppStructure -->\n",
          "components": [
            {
              "id": "component-FullStackOrFrontEnd",
              "name": "FullStackOrFrontEnd",
              "displayName": "FullStackOrFrontEnd",
              "type": "component",
              "path": "intro.component.FullStackOrFrontEnd",
              "urlPath": "",
              "componentId": "FullStackOrFrontEnd",
              "include": true
            },
            {
              "id": "component-AppStructure",
              "name": "AppStructure",
              "displayName": "AppStructure",
              "type": "component",
              "path": "intro.component.AppStructure",
              "urlPath": "",
              "componentId": "AppStructure",
              "include": true
            }
          ],
          "sections": {
            "section1": {
              "option1": {
                "content": "# Full stack web app\n\nThis app will include full stack features that require database integration",
                "include": false
              },
              "option2": {
                "content": "# Front end web app\n\nThis app will be a front-end user experience, without a database",
                "include": false
              }
            }
          },
          "include": true
        },
        {
          "id": "welcome.hello",
          "name": "hello",
          "displayName": "hello",
          "type": "file",
          "order": 2,
          "path": "welcome.hello",
          "urlPath": "/welcome/hello",
          "content": "<!-- component-HelloSwitch -->\n\n<!-- section-1 -->\n",
          "components": [
            {
              "id": "component-HelloSwitch",
              "name": "HelloSwitch",
              "displayName": "HelloSwitch",
              "type": "component",
              "path": "hello.component.HelloSwitch",
              "urlPath": "",
              "componentId": "HelloSwitch",
              "include": true
            }
          ],
          "sections": {
            "section1": {
              "option1": {
                "content": "# Hello there",
                "include": false
              },
              "option2": {
                "content": "# Greetings",
                "include": false
              }
            }
          },
          "include": true
        }
      ]
    },
    "welcome.intro": {
      "id": "welcome.intro",
      "name": "intro",
      "displayName": "intro",
      "type": "file",
      "order": 1,
      "path": "welcome.intro",
      "urlPath": "/welcome/intro",
      "content": "# Welcome\n\nThis is your custom web app road map. Follow the walkthrough to select your preferences and configure your application. You will be presented with options that will determine which content is included in your documentation, you can also edit the files directly - all changes are saved immediately.\nClick the button at the bottom of the sidebar at any time to download your light-weight, comprehensive web app development instructions manual.\n\n## What kind of web app are you making?\n\n<!-- component-FullStackOrFrontEnd -->\n\n<!-- section-1 -->\n\n## App directory structure\n\nYour app directory structure determines your route structure. Add or remove directories and files to determine the segments and paths that will be used to navigate your application\n\n<!-- component-AppStructure -->\n",
      "components": [
        {
          "id": "component-FullStackOrFrontEnd",
          "name": "FullStackOrFrontEnd",
          "displayName": "FullStackOrFrontEnd",
          "type": "component",
          "path": "intro.component.FullStackOrFrontEnd",
          "urlPath": "",
          "componentId": "FullStackOrFrontEnd",
          "include": true
        },
        {
          "id": "component-AppStructure",
          "name": "AppStructure",
          "displayName": "AppStructure",
          "type": "component",
          "path": "intro.component.AppStructure",
          "urlPath": "",
          "componentId": "AppStructure",
          "include": true
        }
      ],
      "sections": {
        "section1": {
          "option1": {
            "content": "# Full stack web app\n\nThis app will include full stack features that require database integration",
            "include": false
          },
          "option2": {
            "content": "# Front end web app\n\nThis app will be a front-end user experience, without a database",
            "include": false
          }
        }
      },
      "include": true
    },
    "intro.component.FullStackOrFrontEnd": {
      "id": "component-FullStackOrFrontEnd",
      "name": "FullStackOrFrontEnd",
      "displayName": "FullStackOrFrontEnd",
      "type": "component",
      "path": "intro.component.FullStackOrFrontEnd",
      "urlPath": "",
      "componentId": "FullStackOrFrontEnd",
      "include": true
    },
    "intro.component.AppStructure": {
      "id": "component-AppStructure",
      "name": "AppStructure",
      "displayName": "AppStructure",
      "type": "component",
      "path": "intro.component.AppStructure",
      "urlPath": "",
      "componentId": "AppStructure",
      "include": true
    },
    "welcome.hello": {
      "id": "welcome.hello",
      "name": "hello",
      "displayName": "hello",
      "type": "file",
      "order": 2,
      "path": "welcome.hello",
      "urlPath": "/welcome/hello",
      "content": "<!-- component-HelloSwitch -->\n\n<!-- section-1 -->\n",
      "components": [
        {
          "id": "component-HelloSwitch",
          "name": "HelloSwitch",
          "displayName": "HelloSwitch",
          "type": "component",
          "path": "hello.component.HelloSwitch",
          "urlPath": "",
          "componentId": "HelloSwitch",
          "include": true
        }
      ],
      "sections": {
        "section1": {
          "option1": {
            "content": "# Hello there",
            "include": false
          },
          "option2": {
            "content": "# Greetings",
            "include": false
          }
        }
      },
      "include": true
    },
    "hello.component.HelloSwitch": {
      "id": "component-HelloSwitch",
      "name": "HelloSwitch",
      "displayName": "HelloSwitch",
      "type": "component",
      "path": "hello.component.HelloSwitch",
      "urlPath": "",
      "componentId": "HelloSwitch",
      "include": true
    }
  }
};

export const getAllPagesInOrder = (): { path: string; url: string; title: string; order: number }[] => {
  const pages: { path: string; url: string; title: string; order: number }[] = [];

  const extractPages = (node: any, parentUrl = ""): void => {
    // Skip nodes with include: false
    if (node.include === false) {
      return;
    }

    if (node.type === "file") {
      pages.push({
        path: node.path,
        url: node.urlPath,
        title: node.displayName,
        order: node.order || 0,
      });
    } else if (node.type === "directory" && node.children) {
      for (const child of node.children) {
        extractPages(child, node.urlPath);
      }
    }
  };

  if (markdownData.root && markdownData.root.children) {
    for (const child of markdownData.root.children) {
      extractPages(child);
    }
  }

  return pages.sort((a, b) => a.order - b.order);
};

export const getFirstPagePath = (): string => {
  const pages = Object.values(markdownData.flatIndex)
    .filter((node) => node.type === "file" && node.include !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return pages.length > 0 ? pages[0].path : "";
};

export const getFirstPageUrl = (): string => {
  const pages = Object.values(markdownData.flatIndex)
    .filter((node) => node.type === "file" && node.include !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return pages.length > 0 ? pages[0].urlPath : "/";
};
