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
        "id": "welcome",
        "name": "welcome",
        "displayName": "welcome",
        "type": "file",
        "order": 1,
        "path": "welcome",
        "urlPath": "/welcome",
        "content": "# Welcome\n\nThis is your custom web app road map. Follow the walkthrough to select your preferences and configure your application. You will be presented with options that will determine which content is included in your documentation, you can also edit the files directly - all changes are saved immediately.\nClick the button at the bottom of the sidebar at any time to download your light-weight, comprehensive web app development instructions manual.\n\n## What kind of web app are you making?\n\n<!-- component-FullStackOrFrontEnd -->\n\n<!-- section-1 -->\n\n## App directory structure\n\nYour app directory structure determines your route structure. Add or remove directories and files to determine the segments and paths that will be used to navigate your application\n\n<!-- component-AppStructure -->\n",
        "segments": [
          {
            "id": "welcome-section1",
            "name": "section1",
            "displayName": "Section 1",
            "type": "segment",
            "path": "welcome.section1",
            "urlPath": "",
            "content": "<!-- option-1 -->\n\n# Full stack web app\n\nThis app will include full stack features that require database integration\n\n<!-- /option-1 -->\n\n<!-- option-2 -->\n\n# Front end web app\n\nThis app will be a front-end user experience, without a database\n\n<!-- /option-2 -->\n",
            "sectionId": "section1",
            "options": {
              "option1": "# Full stack web app\n\nThis app will include full stack features that require database integration",
              "option2": "# Front end web app\n\nThis app will be a front-end user experience, without a database"
            },
            "include": true
          }
        ],
        "components": [
          {
            "id": "component-FullStackOrFrontEnd",
            "name": "FullStackOrFrontEnd",
            "displayName": "FullStackOrFrontEnd",
            "type": "component",
            "path": "welcome.component.FullStackOrFrontEnd",
            "urlPath": "",
            "componentId": "FullStackOrFrontEnd",
            "include": true
          },
          {
            "id": "component-AppStructure",
            "name": "AppStructure",
            "displayName": "AppStructure",
            "type": "component",
            "path": "welcome.component.AppStructure",
            "urlPath": "",
            "componentId": "AppStructure",
            "include": true
          }
        ],
        "sections": {
          "section1": {
            "option1": "# Full stack web app\n\nThis app will include full stack features that require database integration",
            "option2": "# Front end web app\n\nThis app will be a front-end user experience, without a database"
          }
        },
        "include": true
      },
      {
        "id": "database",
        "name": "database",
        "displayName": "database",
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
            "segments": [],
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
            "segments": [],
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
            "segments": [],
            "components": [],
            "sections": {},
            "include": false
          }
        ]
      },
      {
        "id": "installation",
        "name": "installation",
        "displayName": "installation",
        "type": "directory",
        "path": "installation",
        "urlPath": "/installation",
        "include": true,
        "children": [
          {
            "id": "installation.ide",
            "name": "ide",
            "displayName": "IDE",
            "type": "file",
            "order": 2,
            "path": "installation.ide",
            "urlPath": "/installation/ide",
            "content": "# IDE Setup\n\nSetting up your Integrated Development Environment for optimal development experience.\n\n## Recommended IDEs\n\n### Visual Studio Code\n- **Download**: [VS Code](https://code.visualstudio.com/)\n- **Extensions**: \n  - TypeScript and JavaScript Language Features\n  - ES7+ React/Redux/React-Native snippets\n  - Tailwind CSS IntelliSense\n  - Prettier - Code formatter\n\n### WebStorm\n- **Download**: [WebStorm](https://www.jetbrains.com/webstorm/)\n- Built-in TypeScript and React support\n- Excellent refactoring tools\n\n## Configuration\n\n\\`\\`\\`json\n{\n  \"editor.formatOnSave\": true,\n  \"editor.codeActionsOnSave\": {\n    \"source.fixAll.eslint\": true\n  }\n}\n\\`\\`\\`",
            "segments": [],
            "components": [],
            "sections": {},
            "include": true
          },
          {
            "id": "installation.nextjs",
            "name": "nextjs",
            "displayName": "Next.js",
            "type": "file",
            "order": 3,
            "path": "installation.nextjs",
            "urlPath": "/installation/next.js",
            "content": "# Next.js Installation\n\nLearn how to install and configure Next.js for your project.\n\n## Prerequisites\n\nMake sure you have the following installed:\n- **Node.js** (version 18.x or higher)\n- **npm** or **yarn** package manager\n\n## Installation\n\n### Create a new Next.js app\n\n\\`\\`\\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\\`\\`\\`\n\n### Manual Installation\n\n\\`\\`\\`bash\nnpm install next@latest react@latest react-dom@latest\n\\`\\`\\`\n\n## Project Structure\n\n\\`\\`\\`\nmy-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n├── public/\n├── package.json\n└── next.config.js\n\\`\\`\\`\n\n## Configuration\n\n### next.config.js\n\n\\`\\`\\`javascript\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    appDir: true\n  }\n}\n\nmodule.exports = nextConfig\n\\`\\`\\`",
            "segments": [],
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
            "segments": [],
            "components": [],
            "sections": {},
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
          "id": "welcome",
          "name": "welcome",
          "displayName": "welcome",
          "type": "file",
          "order": 1,
          "path": "welcome",
          "urlPath": "/welcome",
          "content": "# Welcome\n\nThis is your custom web app road map. Follow the walkthrough to select your preferences and configure your application. You will be presented with options that will determine which content is included in your documentation, you can also edit the files directly - all changes are saved immediately.\nClick the button at the bottom of the sidebar at any time to download your light-weight, comprehensive web app development instructions manual.\n\n## What kind of web app are you making?\n\n<!-- component-FullStackOrFrontEnd -->\n\n<!-- section-1 -->\n\n## App directory structure\n\nYour app directory structure determines your route structure. Add or remove directories and files to determine the segments and paths that will be used to navigate your application\n\n<!-- component-AppStructure -->\n",
          "segments": [
            {
              "id": "welcome-section1",
              "name": "section1",
              "displayName": "Section 1",
              "type": "segment",
              "path": "welcome.section1",
              "urlPath": "",
              "content": "<!-- option-1 -->\n\n# Full stack web app\n\nThis app will include full stack features that require database integration\n\n<!-- /option-1 -->\n\n<!-- option-2 -->\n\n# Front end web app\n\nThis app will be a front-end user experience, without a database\n\n<!-- /option-2 -->\n",
              "sectionId": "section1",
              "options": {
                "option1": "# Full stack web app\n\nThis app will include full stack features that require database integration",
                "option2": "# Front end web app\n\nThis app will be a front-end user experience, without a database"
              },
              "include": true
            }
          ],
          "components": [
            {
              "id": "component-FullStackOrFrontEnd",
              "name": "FullStackOrFrontEnd",
              "displayName": "FullStackOrFrontEnd",
              "type": "component",
              "path": "welcome.component.FullStackOrFrontEnd",
              "urlPath": "",
              "componentId": "FullStackOrFrontEnd",
              "include": true
            },
            {
              "id": "component-AppStructure",
              "name": "AppStructure",
              "displayName": "AppStructure",
              "type": "component",
              "path": "welcome.component.AppStructure",
              "urlPath": "",
              "componentId": "AppStructure",
              "include": true
            }
          ],
          "sections": {
            "section1": {
              "option1": "# Full stack web app\n\nThis app will include full stack features that require database integration",
              "option2": "# Front end web app\n\nThis app will be a front-end user experience, without a database"
            }
          },
          "include": true
        },
        {
          "id": "database",
          "name": "database",
          "displayName": "database",
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
              "segments": [],
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
              "segments": [],
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
              "segments": [],
              "components": [],
              "sections": {},
              "include": false
            }
          ]
        },
        {
          "id": "installation",
          "name": "installation",
          "displayName": "installation",
          "type": "directory",
          "path": "installation",
          "urlPath": "/installation",
          "include": true,
          "children": [
            {
              "id": "installation.ide",
              "name": "ide",
              "displayName": "IDE",
              "type": "file",
              "order": 2,
              "path": "installation.ide",
              "urlPath": "/installation/ide",
              "content": "# IDE Setup\n\nSetting up your Integrated Development Environment for optimal development experience.\n\n## Recommended IDEs\n\n### Visual Studio Code\n- **Download**: [VS Code](https://code.visualstudio.com/)\n- **Extensions**: \n  - TypeScript and JavaScript Language Features\n  - ES7+ React/Redux/React-Native snippets\n  - Tailwind CSS IntelliSense\n  - Prettier - Code formatter\n\n### WebStorm\n- **Download**: [WebStorm](https://www.jetbrains.com/webstorm/)\n- Built-in TypeScript and React support\n- Excellent refactoring tools\n\n## Configuration\n\n\\`\\`\\`json\n{\n  \"editor.formatOnSave\": true,\n  \"editor.codeActionsOnSave\": {\n    \"source.fixAll.eslint\": true\n  }\n}\n\\`\\`\\`",
              "segments": [],
              "components": [],
              "sections": {},
              "include": true
            },
            {
              "id": "installation.nextjs",
              "name": "nextjs",
              "displayName": "Next.js",
              "type": "file",
              "order": 3,
              "path": "installation.nextjs",
              "urlPath": "/installation/next.js",
              "content": "# Next.js Installation\n\nLearn how to install and configure Next.js for your project.\n\n## Prerequisites\n\nMake sure you have the following installed:\n- **Node.js** (version 18.x or higher)\n- **npm** or **yarn** package manager\n\n## Installation\n\n### Create a new Next.js app\n\n\\`\\`\\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\\`\\`\\`\n\n### Manual Installation\n\n\\`\\`\\`bash\nnpm install next@latest react@latest react-dom@latest\n\\`\\`\\`\n\n## Project Structure\n\n\\`\\`\\`\nmy-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n├── public/\n├── package.json\n└── next.config.js\n\\`\\`\\`\n\n## Configuration\n\n### next.config.js\n\n\\`\\`\\`javascript\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    appDir: true\n  }\n}\n\nmodule.exports = nextConfig\n\\`\\`\\`",
              "segments": [],
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
              "segments": [],
              "components": [],
              "sections": {},
              "include": true
            }
          ]
        }
      ]
    },
    "welcome": {
      "id": "welcome",
      "name": "welcome",
      "displayName": "welcome",
      "type": "file",
      "order": 1,
      "path": "welcome",
      "urlPath": "/welcome",
      "content": "# Welcome\n\nThis is your custom web app road map. Follow the walkthrough to select your preferences and configure your application. You will be presented with options that will determine which content is included in your documentation, you can also edit the files directly - all changes are saved immediately.\nClick the button at the bottom of the sidebar at any time to download your light-weight, comprehensive web app development instructions manual.\n\n## What kind of web app are you making?\n\n<!-- component-FullStackOrFrontEnd -->\n\n<!-- section-1 -->\n\n## App directory structure\n\nYour app directory structure determines your route structure. Add or remove directories and files to determine the segments and paths that will be used to navigate your application\n\n<!-- component-AppStructure -->\n",
      "segments": [
        {
          "id": "welcome-section1",
          "name": "section1",
          "displayName": "Section 1",
          "type": "segment",
          "path": "welcome.section1",
          "urlPath": "",
          "content": "<!-- option-1 -->\n\n# Full stack web app\n\nThis app will include full stack features that require database integration\n\n<!-- /option-1 -->\n\n<!-- option-2 -->\n\n# Front end web app\n\nThis app will be a front-end user experience, without a database\n\n<!-- /option-2 -->\n",
          "sectionId": "section1",
          "options": {
            "option1": "# Full stack web app\n\nThis app will include full stack features that require database integration",
            "option2": "# Front end web app\n\nThis app will be a front-end user experience, without a database"
          },
          "include": true
        }
      ],
      "components": [
        {
          "id": "component-FullStackOrFrontEnd",
          "name": "FullStackOrFrontEnd",
          "displayName": "FullStackOrFrontEnd",
          "type": "component",
          "path": "welcome.component.FullStackOrFrontEnd",
          "urlPath": "",
          "componentId": "FullStackOrFrontEnd",
          "include": true
        },
        {
          "id": "component-AppStructure",
          "name": "AppStructure",
          "displayName": "AppStructure",
          "type": "component",
          "path": "welcome.component.AppStructure",
          "urlPath": "",
          "componentId": "AppStructure",
          "include": true
        }
      ],
      "sections": {
        "section1": {
          "option1": "# Full stack web app\n\nThis app will include full stack features that require database integration",
          "option2": "# Front end web app\n\nThis app will be a front-end user experience, without a database"
        }
      },
      "include": true
    },
    "welcome.section1": {
      "id": "welcome-section1",
      "name": "section1",
      "displayName": "Section 1",
      "type": "segment",
      "path": "welcome.section1",
      "urlPath": "",
      "content": "<!-- option-1 -->\n\n# Full stack web app\n\nThis app will include full stack features that require database integration\n\n<!-- /option-1 -->\n\n<!-- option-2 -->\n\n# Front end web app\n\nThis app will be a front-end user experience, without a database\n\n<!-- /option-2 -->\n",
      "sectionId": "section1",
      "options": {
        "option1": "# Full stack web app\n\nThis app will include full stack features that require database integration",
        "option2": "# Front end web app\n\nThis app will be a front-end user experience, without a database"
      },
      "include": true
    },
    "welcome.component.FullStackOrFrontEnd": {
      "id": "component-FullStackOrFrontEnd",
      "name": "FullStackOrFrontEnd",
      "displayName": "FullStackOrFrontEnd",
      "type": "component",
      "path": "welcome.component.FullStackOrFrontEnd",
      "urlPath": "",
      "componentId": "FullStackOrFrontEnd",
      "include": true
    },
    "welcome.component.AppStructure": {
      "id": "component-AppStructure",
      "name": "AppStructure",
      "displayName": "AppStructure",
      "type": "component",
      "path": "welcome.component.AppStructure",
      "urlPath": "",
      "componentId": "AppStructure",
      "include": true
    },
    "database": {
      "id": "database",
      "name": "database",
      "displayName": "database",
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
          "segments": [],
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
          "segments": [],
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
          "segments": [],
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
      "segments": [],
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
      "segments": [],
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
      "segments": [],
      "components": [],
      "sections": {},
      "include": false
    },
    "installation": {
      "id": "installation",
      "name": "installation",
      "displayName": "installation",
      "type": "directory",
      "path": "installation",
      "urlPath": "/installation",
      "include": true,
      "children": [
        {
          "id": "installation.ide",
          "name": "ide",
          "displayName": "IDE",
          "type": "file",
          "order": 2,
          "path": "installation.ide",
          "urlPath": "/installation/ide",
          "content": "# IDE Setup\n\nSetting up your Integrated Development Environment for optimal development experience.\n\n## Recommended IDEs\n\n### Visual Studio Code\n- **Download**: [VS Code](https://code.visualstudio.com/)\n- **Extensions**: \n  - TypeScript and JavaScript Language Features\n  - ES7+ React/Redux/React-Native snippets\n  - Tailwind CSS IntelliSense\n  - Prettier - Code formatter\n\n### WebStorm\n- **Download**: [WebStorm](https://www.jetbrains.com/webstorm/)\n- Built-in TypeScript and React support\n- Excellent refactoring tools\n\n## Configuration\n\n\\`\\`\\`json\n{\n  \"editor.formatOnSave\": true,\n  \"editor.codeActionsOnSave\": {\n    \"source.fixAll.eslint\": true\n  }\n}\n\\`\\`\\`",
          "segments": [],
          "components": [],
          "sections": {},
          "include": true
        },
        {
          "id": "installation.nextjs",
          "name": "nextjs",
          "displayName": "Next.js",
          "type": "file",
          "order": 3,
          "path": "installation.nextjs",
          "urlPath": "/installation/next.js",
          "content": "# Next.js Installation\n\nLearn how to install and configure Next.js for your project.\n\n## Prerequisites\n\nMake sure you have the following installed:\n- **Node.js** (version 18.x or higher)\n- **npm** or **yarn** package manager\n\n## Installation\n\n### Create a new Next.js app\n\n\\`\\`\\`bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n\\`\\`\\`\n\n### Manual Installation\n\n\\`\\`\\`bash\nnpm install next@latest react@latest react-dom@latest\n\\`\\`\\`\n\n## Project Structure\n\n\\`\\`\\`\nmy-app/\n├── app/\n│   ├── layout.tsx\n│   ├── page.tsx\n├── public/\n├── package.json\n└── next.config.js\n\\`\\`\\`\n\n## Configuration\n\n### next.config.js\n\n\\`\\`\\`javascript\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    appDir: true\n  }\n}\n\nmodule.exports = nextConfig\n\\`\\`\\`",
          "segments": [],
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
          "segments": [],
          "components": [],
          "sections": {},
          "include": true
        }
      ]
    },
    "installation.ide": {
      "id": "installation.ide",
      "name": "ide",
      "displayName": "IDE",
      "type": "file",
      "order": 2,
      "path": "installation.ide",
      "urlPath": "/installation/ide",
      "content": "# IDE Setup\n\nSetting up your Integrated Development Environment for optimal development experience.\n\n## Recommended IDEs\n\n### Visual Studio Code\n- **Download**: [VS Code](https://code.visualstudio.com/)\n- **Extensions**: \n  - TypeScript and JavaScript Language Features\n  - ES7+ React/Redux/React-Native snippets\n  - Tailwind CSS IntelliSense\n  - Prettier - Code formatter\n\n### WebStorm\n- **Download**: [WebStorm](https://www.jetbrains.com/webstorm/)\n- Built-in TypeScript and React support\n- Excellent refactoring tools\n\n## Configuration\n\n\\`\\`\\`json\n{\n  \"editor.formatOnSave\": true,\n  \"editor.codeActionsOnSave\": {\n    \"source.fixAll.eslint\": true\n  }\n}\n\\`\\`\\`",
      "segments": [],
      "components": [],
      "sections": {},
      "include": true
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
      "segments": [],
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
      "segments": [],
      "components": [],
      "sections": {},
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
