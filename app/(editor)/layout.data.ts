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
        "id": "starthere",
        "name": "starthere",
        "displayName": "Start here",
        "type": "directory",
        "path": "starthere",
        "urlPath": "/starthere",
        "include": true,
        "children": [
          {
            "id": "starthere.welcome",
            "name": "welcome",
            "displayName": "Welcome",
            "type": "file",
            "order": 1,
            "path": "starthere.welcome",
            "urlPath": "/starthere/welcome",
            "content": "# [Your app name] development roadmap\n\nThis web app is built with:\n\n<!-- section-1 -->\n",
            "components": [],
            "sections": {
              "section1": {
                "option1": {
                  "content": "- **Next.js (TypeScript)** - A powerful React framework with built-in TypeScript support for building full-stack web applications",
                  "include": false
                },
                "option2": {
                  "content": "- **Tailwind CSS** - A utility-first CSS framework for rapidly building custom user interfaces",
                  "include": false
                },
                "option3": {
                  "content": "- **shadcn/ui** - Beautifully designed, copy-and-paste React components built with Radix UI and Tailwind CSS",
                  "include": false
                },
                "option4": {
                  "content": "- **Zustand** - A small, fast, and scalable state management solution for React applications",
                  "include": false
                },
                "option5": {
                  "content": "- **React Query** - Powerful data synchronization for React that makes fetching, caching, and updating server state simple",
                  "include": false
                },
                "option6": {
                  "content": "- **Supabase** - An open-source Firebase alternative providing database, authentication, and real-time subscriptions",
                  "include": false
                },
                "option7": {
                  "content": "- **Prisma** - A next-generation ORM that provides type-safe database access and powerful migration tools",
                  "include": false
                }
              }
            },
            "include": true
          },
          {
            "id": "starthere.appdirectory",
            "name": "appdirectory",
            "displayName": "App directory",
            "type": "file",
            "order": 2,
            "path": "starthere.appdirectory",
            "urlPath": "/starthere/appdirectory",
            "content": "# Welcome\n\nThis is your app. There are many like it, but this one it yours.\n\n## App directory structure\n\n### Paths compile to routes\n\nThe paths in the app directory are compiled (by Next.js) into routes.\n**Example:** If you want a login page at \\`example.com/login\\`, then you can add a page file here: \\`app/login/page.tsx\\`\n\n### Layouts wrap pages\n\nFiles named \\`layout.tsx\\` wrap adjacent and descendant pages\n**Example:** You can add a header to the layout in \\`app/layout.tsx\\`, and a sidebar in \\`app/(dashboard)/layout.tsx\\`\n\n<!-- component-AppStructure -->\n",
            "components": [
              {
                "id": "component-AppStructure",
                "name": "AppStructure",
                "displayName": "AppStructure",
                "type": "component",
                "path": "appdirectory.component.AppStructure",
                "urlPath": "",
                "componentId": "AppStructure",
                "include": true
              }
            ],
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
          "id": "starthere",
          "name": "starthere",
          "displayName": "Start here",
          "type": "directory",
          "path": "starthere",
          "urlPath": "/starthere",
          "include": true,
          "children": [
            {
              "id": "starthere.welcome",
              "name": "welcome",
              "displayName": "Welcome",
              "type": "file",
              "order": 1,
              "path": "starthere.welcome",
              "urlPath": "/starthere/welcome",
              "content": "# [Your app name] development roadmap\n\nThis web app is built with:\n\n<!-- section-1 -->\n",
              "components": [],
              "sections": {
                "section1": {
                  "option1": {
                    "content": "- **Next.js (TypeScript)** - A powerful React framework with built-in TypeScript support for building full-stack web applications",
                    "include": false
                  },
                  "option2": {
                    "content": "- **Tailwind CSS** - A utility-first CSS framework for rapidly building custom user interfaces",
                    "include": false
                  },
                  "option3": {
                    "content": "- **shadcn/ui** - Beautifully designed, copy-and-paste React components built with Radix UI and Tailwind CSS",
                    "include": false
                  },
                  "option4": {
                    "content": "- **Zustand** - A small, fast, and scalable state management solution for React applications",
                    "include": false
                  },
                  "option5": {
                    "content": "- **React Query** - Powerful data synchronization for React that makes fetching, caching, and updating server state simple",
                    "include": false
                  },
                  "option6": {
                    "content": "- **Supabase** - An open-source Firebase alternative providing database, authentication, and real-time subscriptions",
                    "include": false
                  },
                  "option7": {
                    "content": "- **Prisma** - A next-generation ORM that provides type-safe database access and powerful migration tools",
                    "include": false
                  }
                }
              },
              "include": true
            },
            {
              "id": "starthere.appdirectory",
              "name": "appdirectory",
              "displayName": "App directory",
              "type": "file",
              "order": 2,
              "path": "starthere.appdirectory",
              "urlPath": "/starthere/appdirectory",
              "content": "# Welcome\n\nThis is your app. There are many like it, but this one it yours.\n\n## App directory structure\n\n### Paths compile to routes\n\nThe paths in the app directory are compiled (by Next.js) into routes.\n**Example:** If you want a login page at \\`example.com/login\\`, then you can add a page file here: \\`app/login/page.tsx\\`\n\n### Layouts wrap pages\n\nFiles named \\`layout.tsx\\` wrap adjacent and descendant pages\n**Example:** You can add a header to the layout in \\`app/layout.tsx\\`, and a sidebar in \\`app/(dashboard)/layout.tsx\\`\n\n<!-- component-AppStructure -->\n",
              "components": [
                {
                  "id": "component-AppStructure",
                  "name": "AppStructure",
                  "displayName": "AppStructure",
                  "type": "component",
                  "path": "appdirectory.component.AppStructure",
                  "urlPath": "",
                  "componentId": "AppStructure",
                  "include": true
                }
              ],
              "sections": {},
              "include": true
            }
          ]
        }
      ]
    },
    "starthere": {
      "id": "starthere",
      "name": "starthere",
      "displayName": "Start here",
      "type": "directory",
      "path": "starthere",
      "urlPath": "/starthere",
      "include": true,
      "children": [
        {
          "id": "starthere.welcome",
          "name": "welcome",
          "displayName": "Welcome",
          "type": "file",
          "order": 1,
          "path": "starthere.welcome",
          "urlPath": "/starthere/welcome",
          "content": "# [Your app name] development roadmap\n\nThis web app is built with:\n\n<!-- section-1 -->\n",
          "components": [],
          "sections": {
            "section1": {
              "option1": {
                "content": "- **Next.js (TypeScript)** - A powerful React framework with built-in TypeScript support for building full-stack web applications",
                "include": false
              },
              "option2": {
                "content": "- **Tailwind CSS** - A utility-first CSS framework for rapidly building custom user interfaces",
                "include": false
              },
              "option3": {
                "content": "- **shadcn/ui** - Beautifully designed, copy-and-paste React components built with Radix UI and Tailwind CSS",
                "include": false
              },
              "option4": {
                "content": "- **Zustand** - A small, fast, and scalable state management solution for React applications",
                "include": false
              },
              "option5": {
                "content": "- **React Query** - Powerful data synchronization for React that makes fetching, caching, and updating server state simple",
                "include": false
              },
              "option6": {
                "content": "- **Supabase** - An open-source Firebase alternative providing database, authentication, and real-time subscriptions",
                "include": false
              },
              "option7": {
                "content": "- **Prisma** - A next-generation ORM that provides type-safe database access and powerful migration tools",
                "include": false
              }
            }
          },
          "include": true
        },
        {
          "id": "starthere.appdirectory",
          "name": "appdirectory",
          "displayName": "App directory",
          "type": "file",
          "order": 2,
          "path": "starthere.appdirectory",
          "urlPath": "/starthere/appdirectory",
          "content": "# Welcome\n\nThis is your app. There are many like it, but this one it yours.\n\n## App directory structure\n\n### Paths compile to routes\n\nThe paths in the app directory are compiled (by Next.js) into routes.\n**Example:** If you want a login page at \\`example.com/login\\`, then you can add a page file here: \\`app/login/page.tsx\\`\n\n### Layouts wrap pages\n\nFiles named \\`layout.tsx\\` wrap adjacent and descendant pages\n**Example:** You can add a header to the layout in \\`app/layout.tsx\\`, and a sidebar in \\`app/(dashboard)/layout.tsx\\`\n\n<!-- component-AppStructure -->\n",
          "components": [
            {
              "id": "component-AppStructure",
              "name": "AppStructure",
              "displayName": "AppStructure",
              "type": "component",
              "path": "appdirectory.component.AppStructure",
              "urlPath": "",
              "componentId": "AppStructure",
              "include": true
            }
          ],
          "sections": {},
          "include": true
        }
      ]
    },
    "starthere.welcome": {
      "id": "starthere.welcome",
      "name": "welcome",
      "displayName": "Welcome",
      "type": "file",
      "order": 1,
      "path": "starthere.welcome",
      "urlPath": "/starthere/welcome",
      "content": "# [Your app name] development roadmap\n\nThis web app is built with:\n\n<!-- section-1 -->\n",
      "components": [],
      "sections": {
        "section1": {
          "option1": {
            "content": "- **Next.js (TypeScript)** - A powerful React framework with built-in TypeScript support for building full-stack web applications",
            "include": false
          },
          "option2": {
            "content": "- **Tailwind CSS** - A utility-first CSS framework for rapidly building custom user interfaces",
            "include": false
          },
          "option3": {
            "content": "- **shadcn/ui** - Beautifully designed, copy-and-paste React components built with Radix UI and Tailwind CSS",
            "include": false
          },
          "option4": {
            "content": "- **Zustand** - A small, fast, and scalable state management solution for React applications",
            "include": false
          },
          "option5": {
            "content": "- **React Query** - Powerful data synchronization for React that makes fetching, caching, and updating server state simple",
            "include": false
          },
          "option6": {
            "content": "- **Supabase** - An open-source Firebase alternative providing database, authentication, and real-time subscriptions",
            "include": false
          },
          "option7": {
            "content": "- **Prisma** - A next-generation ORM that provides type-safe database access and powerful migration tools",
            "include": false
          }
        }
      },
      "include": true
    },
    "starthere.appdirectory": {
      "id": "starthere.appdirectory",
      "name": "appdirectory",
      "displayName": "App directory",
      "type": "file",
      "order": 2,
      "path": "starthere.appdirectory",
      "urlPath": "/starthere/appdirectory",
      "content": "# Welcome\n\nThis is your app. There are many like it, but this one it yours.\n\n## App directory structure\n\n### Paths compile to routes\n\nThe paths in the app directory are compiled (by Next.js) into routes.\n**Example:** If you want a login page at \\`example.com/login\\`, then you can add a page file here: \\`app/login/page.tsx\\`\n\n### Layouts wrap pages\n\nFiles named \\`layout.tsx\\` wrap adjacent and descendant pages\n**Example:** You can add a header to the layout in \\`app/layout.tsx\\`, and a sidebar in \\`app/(dashboard)/layout.tsx\\`\n\n<!-- component-AppStructure -->\n",
      "components": [
        {
          "id": "component-AppStructure",
          "name": "AppStructure",
          "displayName": "AppStructure",
          "type": "component",
          "path": "appdirectory.component.AppStructure",
          "urlPath": "",
          "componentId": "AppStructure",
          "include": true
        }
      ],
      "sections": {},
      "include": true
    },
    "appdirectory.component.AppStructure": {
      "id": "component-AppStructure",
      "name": "AppStructure",
      "displayName": "AppStructure",
      "type": "component",
      "path": "appdirectory.component.AppStructure",
      "urlPath": "",
      "componentId": "AppStructure",
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
