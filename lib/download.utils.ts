import {
  CodeFileNode,
  FileSystemEntry,
  InitialConfigurationType,
  MarkdownData,
  MarkdownNode,
} from "@/app/(editor)/layout.types";
import type {
  DatabaseTable,
  RLSPolicy,
  RLSAccessType,
  UserRole,
} from "@/app/(components)/DatabaseConfiguration.types";
import { useDatabaseStore } from "@/app/(components)/DatabaseConfiguration.stores";
import JSZip from "jszip";
import { getDynamicRobotsFileName } from "./robots-file.utils";
import { CODE_FILE_CONFIGS } from "./code-file-config";
import type { ConfigSnapshot } from "./config-snapshot";

type RouteEntry = {
  path: string;
  children?: RouteEntry[];
};

export const generateRoutesFromFileSystem = (
  entries: FileSystemEntry[],
  parentPath: string = "",
  isRoot: boolean = false
): RouteEntry[] => {
  const routes: RouteEntry[] = [];

  entries.forEach((entry) => {
    if (entry.name === "app" && isRoot) {
      if (entry.children) {
        routes.push(...generateRoutesFromFileSystem(entry.children, "", false));
      }
      return;
    }

    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      if (entry.children) {
        routes.push(
          ...generateRoutesFromFileSystem(entry.children, parentPath, false)
        );
      }
      return;
    }

    if (entry.type === "file" && entry.name === "page.tsx") {
      const route: RouteEntry = {
        path: parentPath || "/",
      };
      routes.push(route);
    }

    if (entry.type === "directory" && entry.children) {
      const newPath = parentPath
        ? `${parentPath}/${entry.name}`
        : `/${entry.name}`;

      const hasPageFile = entry.children.some(
        (child) => child.type === "file" && child.name === "page.tsx"
      );

      if (hasPageFile) {
        const childRoutes = generateRoutesFromFileSystem(
          entry.children,
          newPath,
          false
        );
        if (childRoutes.length > 0) {
          const mainRoute = childRoutes.find((r) => r.path === newPath);
          if (mainRoute) {
            mainRoute.children = childRoutes.filter((r) => r.path !== newPath);
            routes.push(mainRoute);
          } else {
            routes.push({
              path: newPath,
              children: childRoutes,
            });
          }
        } else {
          routes.push({ path: newPath });
        }
      } else {
        routes.push(
          ...generateRoutesFromFileSystem(entry.children, newPath, false)
        );
      }
    }
  });

  return routes;
};

const getWireframeData = (): any => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storeState = localStorage.getItem("editor-storage");
    if (!storeState) {
      return null;
    }

    const parsed = JSON.parse(storeState);
    return parsed?.state?.wireframeState?.wireframeData;
  } catch (error) {
    return null;
  }
};

export const generateAppStructureAscii = (
  appStructure: FileSystemEntry[]
): string => {
  const lines: string[] = ["```txt", "App Directory Structure:", ""];
  const wireframeData = getWireframeData();

  const getLayoutElements = (layoutPath: string): string => {
    if (!wireframeData || !wireframeData.layouts) {
      return "";
    }

    const layoutData = wireframeData.layouts[layoutPath];
    if (
      !layoutData ||
      !layoutData.elements ||
      layoutData.elements.length === 0
    ) {
      return "";
    }

    const elementLabels = layoutData.elements
      .map((el: any) => {
        switch (el.type) {
          case "header":
            return "header";
          case "footer":
            return "footer";
          case "sidebar-left":
            return "left sidebar";
          case "sidebar-right":
            return "right sidebar";
          default:
            return el.type;
        }
      })
      .join(", ");

    return ` ──► [ ${elementLabels} ]`;
  };

  function renderTree(
    entries: FileSystemEntry[],
    parentPrefix = "",
    currentPath = "",
    isRoot = true,
    isInsideApp = false
  ): void {
    entries.forEach((entry, index) => {
      const isLastEntry = index === entries.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";
      const childPrefix = parentPrefix + (isLastEntry ? "    " : "│   ");

      const isLayoutFile = entry.type === "file" && entry.name === "layout.tsx";
      let layoutAnnotation = "";

      if (isLayoutFile && wireframeData && isInsideApp) {
        const layoutPath = currentPath || "/";
        layoutAnnotation = getLayoutElements(layoutPath);
      }

      const dirSuffix = entry.type === "directory" ? "/" : "";
      lines.push(
        parentPrefix + connector + entry.name + dirSuffix + layoutAnnotation
      );

      if (entry.children && entry.children.length > 0) {
        const isAppDir = entry.name === "app" && isRoot;
        const isRouteGroup =
          entry.name.startsWith("(") && entry.name.endsWith(")");

        const newPath = isAppDir
          ? "/"
          : isRouteGroup
            ? currentPath
            : currentPath === "/"
              ? `/${entry.name}`
              : currentPath
                ? `${currentPath}/${entry.name}`
                : `/${entry.name}`;

        renderTree(
          entry.children,
          childPrefix,
          newPath,
          false,
          isAppDir || isInsideApp
        );
      }
    });
  }

  if (appStructure.length > 0) {
    renderTree(appStructure);
  } else {
    lines.push("No app structure defined");
  }

  lines.push("", "```");
  return lines.join("\n");
};

export const generateRouteMapAscii = (
  appStructure: FileSystemEntry[]
): string => {
  const lines: string[] = [
    "```txt",
    "Route Map (Generated from App Structure):",
    "",
  ];

  const routes = generateRoutesFromFileSystem(appStructure, "", true);

  function renderRoutes(
    routes: RouteEntry[],
    parentPrefix = "",
    isLast = true
  ): void {
    routes.forEach((route, index) => {
      const isLastEntry = index === routes.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";
      const prefix = parentPrefix + (isLast ? "    " : "│   ");

      lines.push(parentPrefix + connector + route.path);

      if (route.children && route.children.length > 0) {
        renderRoutes(route.children, prefix, isLastEntry);
      }
    });
  }

  if (routes.length > 0) {
    renderRoutes(routes);
  } else {
    lines.push("No routes defined");
  }

  lines.push("", "```");
  return lines.join("\n");
};

const getFeaturesData = (): Record<string, any[]> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const storeState = localStorage.getItem("editor-storage");
    if (!storeState) {
      return {};
    }

    const parsed = JSON.parse(storeState);
    return parsed?.state?.features || {};
  } catch (error) {
    return {};
  }
};

export const generateFeatureFunctionMapAscii = (
  appStructure: FileSystemEntry[]
): string => {
  const lines: string[] = [
    "## Feature and Function Map",
    "",
  ];

  const featuresData = getFeaturesData();

  const fileTypeLabels: Record<string, string> = {
    hooks: "Hook",
    stores: "Store",
    actions: "Action",
    types: "Type",
  };

  const allFiles: Array<{
    filePath: string;
    fileName: string;
    type: "file" | "directory";
    fileId?: string;
  }> = [];

  const utilFileMap: Record<
    string,
    Array<{ featureName: string; functionName: string; pageFilePath: string }>
  > = {};

  const collectAllFiles = (
    entries: FileSystemEntry[],
    currentPath: string = "",
    isRoot: boolean = false
  ): void => {
    entries.forEach((entry) => {
      if (entry.name === "app" && isRoot) {
        if (entry.children) {
          collectAllFiles(entry.children, "/app", false);
        }
        return;
      }

      if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
        if (entry.children) {
          const newPath = currentPath
            ? `${currentPath}/${entry.name}`
            : `/${entry.name}`;
          collectAllFiles(entry.children, newPath, false);
        }
        return;
      }

      if (entry.type === "directory" && entry.children) {
        const newPath = currentPath
          ? `${currentPath}/${entry.name}`
          : `/${entry.name}`;
        collectAllFiles(entry.children, newPath, false);
      }

      if (entry.type === "file") {
        const filePath = currentPath
          ? `${currentPath}/${entry.name}`
          : `/${entry.name}`;
        allFiles.push({
          filePath,
          fileName: entry.name,
          type: entry.type,
          fileId: entry.id,
        });
      }
    });
  };

  collectAllFiles(appStructure, "", true);

  allFiles.forEach((file) => {
    lines.push(`### ${file.filePath}`);

    const isPageOrLayout =
      file.fileName === "page.tsx" || file.fileName === "layout.tsx";
    const isUtilFile =
      file.fileName.endsWith(".hooks.tsx") ||
      file.fileName.endsWith(".stores.ts") ||
      file.fileName.endsWith(".actions.ts") ||
      file.fileName.endsWith(".types.ts");

    if (isPageOrLayout && file.fileId) {
      const features = featuresData[file.fileId] || [];

      if (features.length > 0) {
        features.forEach((feature) => {
          const featureTitle = feature.title || "Untitled Feature";
          lines.push(`**Feature: ${featureTitle}**`);

          const fileTypes: Array<"hooks" | "stores" | "actions" | "types"> = [
            "hooks",
            "stores",
            "actions",
            "types",
          ];
          fileTypes.forEach((fileType) => {
            const functionData = feature.functionNames?.[fileType];
            if (functionData) {
              const functionName =
                typeof functionData === "string"
                  ? functionData
                  : functionData.name;
              const utilFile =
                typeof functionData === "object"
                  ? functionData.utilFile
                  : feature.linkedFiles?.[fileType];

              if (functionName && utilFile) {
                lines.push(
                  `- ${fileTypeLabels[fileType]}: \`${functionName}\` → \`${utilFile}\``
                );

                if (!utilFileMap[utilFile]) {
                  utilFileMap[utilFile] = [];
                }
                utilFileMap[utilFile].push({
                  featureName: featureTitle,
                  functionName,
                  pageFilePath: file.filePath,
                });
              }
            }
          });

          lines.push("");
        });
      } else {
        lines.push("*No features defined*");
        lines.push("");
      }
    } else if (isUtilFile) {
      const consumers = utilFileMap[file.filePath] || [];

      if (consumers.length > 0) {
        consumers.forEach((consumer) => {
          lines.push(
            `- \`${consumer.functionName}\` (used by: \`${consumer.pageFilePath}\` → ${consumer.featureName})`
          );
        });
      } else {
        lines.push("*No consumers found*");
      }

      lines.push("");
    } else {
      lines.push("*Not applicable*");
      lines.push("");
    }
  });

  return lines.join("\n");
};

const generateInitialConfigurationContent = (
  initialConfiguration: InitialConfigurationType
): string => {
  const lines: string[] = [];

  const technologies: {
    id: keyof InitialConfigurationType["technologies"];
    name: string;
  }[] = [
    { id: "nextjs", name: "Next.js" },
    { id: "tailwindcss", name: "TailwindCSS v4" },
    { id: "shadcn", name: "Shadcn/ui" },
    { id: "zustand", name: "Zustand" },
    { id: "reactQuery", name: "React Query" },
    { id: "supabase", name: "Supabase" },
    { id: "postgresql", name: "PostgreSQL" },
    { id: "vercel", name: "Vercel" },
    { id: "railway", name: "Railway" },
    { id: "cypress", name: "Cypress" },
    { id: "resend", name: "Resend" },
    { id: "stripe", name: "Stripe" },
    { id: "paypal", name: "PayPal" },
    { id: "openrouter", name: "OpenRouter" },
  ];

  const getInstallCommand = (techId: string): string => {
    const commands: Record<string, string> = {
      nextjs: "npx create-next-app@latest",
      tailwindcss: "npm i tailwindcss@next",
      shadcn: "npx shadcn@latest init",
      zustand: "npm i zustand",
      reactQuery: "npm i @tanstack/react-query",
      supabase: "npm i @supabase/supabase-js",
      neondb: "npm i @neondatabase/serverless",
      prisma: "npm i prisma",
      betterAuth: "npm i better-auth",
      resend: "npm i resend",
      stripe: "npm i stripe",
      paypal: "npm i @paypal/checkout-server-sdk",
      cypress: "npm i cypress -D",
      openrouter: "npm i openai",
    };
    return commands[techId] || "";
  };

  const getTechnologyExplanation = (
    techId: keyof InitialConfigurationType["technologies"]
  ): string => {
    switch (techId) {
      case "nextjs":
        return "React framework providing server-side rendering, routing, and full-stack capabilities essential for modern web applications.";

      case "tailwindcss":
        return "Utility-first CSS framework for rapid UI development with consistent styling across the application.";

      case "shadcn":
        return "Component library built on Radix UI and Tailwind CSS, providing accessible and customizable UI components.";

      case "zustand":
        return "Lightweight state management solution for managing global application state with minimal boilerplate.";

      case "reactQuery":
        return "Data fetching and caching library that manages server state, handling loading states, errors, and data synchronization.";

      case "vercel":
        return "Serverless deployment platform optimized for Next.js applications, providing automatic scaling and edge network distribution.";

      case "railway":
        return "Always-on server deployment platform required for continuous monitoring and background processes.";

      case "postgresql":
        return "Relational database system storing application data including user accounts, authentication sessions, and application-specific data.";

      case "supabase": {
        const features: string[] = [];
        if (initialConfiguration.questions.databaseProvider === "supabase") {
          features.push("authentication");
        } else {
          features.push("database");
          features.push("authentication");
        }
        if (initialConfiguration.features.fileStorage) {
          features.push("file storage");
        }
        if (initialConfiguration.features.realTimeNotifications.enabled) {
          features.push("real-time notifications");
        }
        return `Backend-as-a-service platform providing ${features.join(", ")} with built-in security and scalability.`;
      }

      case "resend": {
        const purposes: string[] = [];
        const hasEmailAuth =
          initialConfiguration.features.authentication.emailPassword ||
          initialConfiguration.features.authentication.magicLink;
        if (hasEmailAuth) {
          purposes.push("authentication emails");
        }
        if (
          initialConfiguration.features.realTimeNotifications.enabled &&
          initialConfiguration.features.realTimeNotifications.emailNotifications
        ) {
          purposes.push("notification emails");
        }
        return `Email delivery service for sending ${purposes.join(" and ")} with high deliverability rates.`;
      }

      case "openrouter":
        return "AI model routing platform providing access to multiple language models for AI-powered features.";

      case "stripe": {
        const paymentTypes: string[] = [];
        if (initialConfiguration.features.payments.stripePayments)
          paymentTypes.push("one-time payments");
        if (initialConfiguration.features.payments.stripeSubscriptions)
          paymentTypes.push("subscription billing");
        return `Payment processing platform for ${paymentTypes.join(" and ")} with secure transaction handling.`;
      }

      case "paypal":
        return "Payment processing platform for accepting PayPal payments with buyer and seller protection.";

      case "cypress":
        return "End-to-end testing framework for automated browser testing and quality assurance.";

      default:
        return "";
    }
  };

  technologies.forEach((tech) => {
    const isEnabled = initialConfiguration.technologies[tech.id];

    if (isEnabled) {
      const explanation = getTechnologyExplanation(tech.id);
      lines.push(`### ${tech.name}`);
      lines.push(explanation);
      const installCommand = getInstallCommand(tech.id);
      if (installCommand) {
        lines.push(`→ \`${installCommand}\``);
      }
      lines.push("");
    }
  });

  return lines.join("\n");
};

const generateThemeCss = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const themeStoreState = localStorage.getItem("theme-storage");
    if (!themeStoreState) {
      return "";
    }

    const parsed = JSON.parse(themeStoreState);
    const theme = parsed?.state?.theme;
    if (!theme) {
      return "";
    }

    const lightColors = theme.colors.light;
    const darkColors = theme.colors.dark;
    const lightTypography = theme.typography.light;
    const darkTypography = theme.typography.dark;
    const lightOther = theme.other.light;
    const darkOther = theme.other.dark;

    const formatShadow = (shadow: any) => {
      const hasOpacity = shadow.opacity !== undefined && shadow.opacity !== 1;
      const colorWithOpacity = hasOpacity
        ? shadow.color.replace(/\)$/, ` / ${shadow.opacity})`)
        : shadow.color;
      return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px ${colorWithOpacity}`;
    };

    const extractFontName = (fontValue: string): string => {
      if (!fontValue) return "Inter";

      const fontMap: Record<string, string> = {
        'inter': 'Inter',
        'fira-code': 'Fira Code',
        'fira code': 'Fira Code',
        'jetbrains': 'JetBrains Mono',
        'jetbrains-mono': 'JetBrains Mono',
        'roboto': 'Roboto',
        'open-sans': 'Open Sans',
        'lato': 'Lato',
        'montserrat': 'Montserrat',
        'poppins': 'Poppins',
        'source-code-pro': 'Source Code Pro',
        'merriweather': 'Merriweather',
        'playfair-display': 'Playfair Display',
      };

      if (fontValue.includes('var(--font-')) {
        const match = fontValue.match(/var\(--font-([^)]+)\)/);
        if (match && match[1]) {
          const varName = match[1].toLowerCase();
          if (fontMap[varName]) {
            return fontMap[varName];
          }
          return match[1]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      }

      const firstFont = fontValue.split(',')[0].trim();
      const cleaned = firstFont.replace(/['"]/g, '');
      return cleaned || "Inter";
    };

    const getFontVariableName = (fontName: string): string => {
      return fontName.toLowerCase().replace(/\s+/g, '-');
    };

    const getFontCssVariable = (fontName: string): string => {
      return `var(--font-${getFontVariableName(fontName)})`;
    };

    const getFontImportName = (fontName: string): string => {
      return fontName.replace(/\s+/g, '_');
    };

    const colorKeys = [
      { key: "background", css: "--background" },
      { key: "foreground", css: "--foreground" },
      { key: "card", css: "--card" },
      { key: "cardForeground", css: "--card-foreground" },
      { key: "popover", css: "--popover" },
      { key: "popoverForeground", css: "--popover-foreground" },
      { key: "primary", css: "--primary" },
      { key: "primaryForeground", css: "--primary-foreground" },
      { key: "secondary", css: "--secondary" },
      { key: "secondaryForeground", css: "--secondary-foreground" },
      { key: "muted", css: "--muted" },
      { key: "mutedForeground", css: "--muted-foreground" },
      { key: "accent", css: "--accent" },
      { key: "accentForeground", css: "--accent-foreground" },
      { key: "destructive", css: "--destructive" },
      { key: "destructiveForeground", css: "--destructive-foreground" },
      { key: "border", css: "--border" },
      { key: "input", css: "--input" },
      { key: "ring", css: "--ring" },
      { key: "chart1", css: "--chart-1" },
      { key: "chart2", css: "--chart-2" },
      { key: "chart3", css: "--chart-3" },
      { key: "chart4", css: "--chart-4" },
      { key: "chart5", css: "--chart-5" },
      { key: "sidebarBackground", css: "--sidebar" },
      { key: "sidebarForeground", css: "--sidebar-foreground" },
      { key: "sidebarPrimary", css: "--sidebar-primary" },
      {
        key: "sidebarPrimaryForeground",
        css: "--sidebar-primary-foreground",
      },
      { key: "sidebarAccent", css: "--sidebar-accent" },
      {
        key: "sidebarAccentForeground",
        css: "--sidebar-accent-foreground",
      },
      { key: "sidebarBorder", css: "--sidebar-border" },
      { key: "sidebarRing", css: "--sidebar-ring" },
    ];

    const isGoogleFont = (fontValue: string): boolean => {
      return fontValue.includes('var(--font-');
    };

    const fontSansValue = lightTypography.fontSans || "var(--font-inter)";
    const fontSerifValue = lightTypography.fontSerif || "var(--font-merriweather)";
    const fontMonoValue = lightTypography.fontMono || "var(--font-jetbrains)";
    const fontSansDarkValue = darkTypography.fontSans || lightTypography.fontSans || "var(--font-inter)";
    const fontSerifDarkValue = darkTypography.fontSerif || lightTypography.fontSerif || "var(--font-merriweather)";
    const fontMonoDarkValue = darkTypography.fontMono || lightTypography.fontMono || "var(--font-jetbrains)";

    const googleFontValues = [
      fontSansValue,
      fontSerifValue,
      fontMonoValue,
      fontSansDarkValue,
      fontSerifDarkValue,
      fontMonoDarkValue
    ].filter(isGoogleFont);

    const fontSans = extractFontName(fontSansValue);
    const fontSerif = extractFontName(fontSerifValue);
    const fontMono = extractFontName(fontMonoValue);
    const fontSansDark = extractFontName(fontSansDarkValue);
    const fontSerifDark = extractFontName(fontSerifDarkValue);
    const fontMonoDark = extractFontName(fontMonoDarkValue);

    const allGoogleFonts = new Set(googleFontValues.map(v => extractFontName(v)));
    const fontImports = Array.from(allGoogleFonts).map(font => getFontImportName(font)).join(', ');

    const fontConfigs: string[] = [];
    const fontVariables: string[] = [];
    const processedFonts = new Set<string>();

    allGoogleFonts.forEach((font) => {
      const importName = getFontImportName(font);
      const constName = `font${importName}`;
      const cssVarName = getFontVariableName(font);

      if (processedFonts.has(importName)) {
        return;
      }
      processedFonts.add(importName);

      if (font === fontSans || font === fontSansDark) {
        fontConfigs.push(
          ` * const ${constName} = ${importName}({`,
          " *   subsets: ['latin'],",
          ` *   variable: '--font-${cssVarName}',`,
          " * })",
          " * "
        );
        fontVariables.push(`${constName}.variable`);
      } else if (font === fontSerif || font === fontSerifDark) {
        fontConfigs.push(
          ` * const ${constName} = ${importName}({`,
          " *   weight: ['300', '400', '700'],",
          " *   subsets: ['latin'],",
          ` *   variable: '--font-${cssVarName}',`,
          " * })",
          " * "
        );
        fontVariables.push(`${constName}.variable`);
      } else {
        fontConfigs.push(
          ` * const ${constName} = ${importName}({`,
          " *   subsets: ['latin'],",
          ` *   variable: '--font-${cssVarName}',`,
          " * })",
          " * "
        );
        fontVariables.push(`${constName}.variable`);
      }
    });

    const lines: string[] = [
      "```css",
      "",
      "/**",
      " * FONT INSTALLATION INSTRUCTIONS:",
      " * ",
      " * Add the following imports to your app/layout.tsx:",
      " * ",
      ` * import { ${fontImports} } from 'next/font/google'`,
      " * ",
      ...fontConfigs,
      " * Then add to your html element:",
      ` * <html className={\`\${${fontVariables.join('} ${')}}\`}>`,
      " */",
      "",
      "@import \"tailwindcss\";",
      "@import \"tw-animate-css\";",
      "",
      ":root {"
    ];

    colorKeys.forEach(({ key, css }) => {
      const color = (lightColors as any)[key];
      if (color) {
        lines.push(`  ${css}: ${color};`);
      }
    });

    const getFontCssValue = (fontValue: string, fontName: string, fallback: string): string => {
      return isGoogleFont(fontValue) ? `${getFontCssVariable(fontName)}, ${fallback}` : fontValue;
    };

    lines.push(``);
    lines.push(`  --font-sans: ${getFontCssValue(fontSansValue, fontSans, 'sans-serif')};`);
    lines.push(`  --font-serif: ${getFontCssValue(fontSerifValue, fontSerif, 'serif')};`);
    lines.push(`  --font-mono: ${getFontCssValue(fontMonoValue, fontMono, 'monospace')};`);
    lines.push(`  --letter-spacing: ${lightTypography.letterSpacing}px;`);
    lines.push(``);
    lines.push(`  --radius: ${lightOther.radius}rem;`);
    lines.push(`  --spacing: ${lightOther.spacing}rem;`);
    lines.push(`  --shadow: ${formatShadow(lightOther.shadow)};`);
    lines.push(`  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
    lines.push(`  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
    lines.push(`  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
    lines.push(`  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);`);
    lines.push(`  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);`);
    lines.push(`  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);`);
    lines.push(`  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.dark {`);

    colorKeys.forEach(({ key, css }) => {
      const color = (darkColors as any)[key];
      if (color) {
        lines.push(`  ${css}: ${color};`);
      }
    });

    lines.push(``);
    lines.push(`  --font-sans: ${getFontCssValue(fontSansDarkValue, fontSansDark, 'sans-serif')};`);
    lines.push(`  --font-serif: ${getFontCssValue(fontSerifDarkValue, fontSerifDark, 'serif')};`);
    lines.push(`  --font-mono: ${getFontCssValue(fontMonoDarkValue, fontMonoDark, 'monospace')};`);
    lines.push(`  --letter-spacing: ${darkTypography.letterSpacing}px;`);
    lines.push(``);
    lines.push(`  --radius: ${darkOther.radius}rem;`);
    lines.push(`  --spacing: ${darkOther.spacing}rem;`);
    lines.push(`  --shadow: ${formatShadow(darkOther.shadow)};`);
    lines.push(`  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
    lines.push(`  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
    lines.push(`  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`);
    lines.push(`  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);`);
    lines.push(`  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);`);
    lines.push(`  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);`);
    lines.push(`  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`@layer base {`);
    lines.push(`  * {`);
    lines.push(`    @apply border-border;`);
    lines.push(`  }`);
    lines.push(`  body {`);
    lines.push(`    @apply bg-background text-foreground font-sans;`);
    lines.push(`    letter-spacing: var(--letter-spacing);`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`@theme inline {`);
    lines.push(`  --color-background: var(--background);`);
    lines.push(`  --color-foreground: var(--foreground);`);
    lines.push(`  --color-card: var(--card);`);
    lines.push(`  --color-card-foreground: var(--card-foreground);`);
    lines.push(`  --color-popover: var(--popover);`);
    lines.push(`  --color-popover-foreground: var(--popover-foreground);`);
    lines.push(`  --color-primary: var(--primary);`);
    lines.push(`  --color-primary-foreground: var(--primary-foreground);`);
    lines.push(`  --color-secondary: var(--secondary);`);
    lines.push(`  --color-secondary-foreground: var(--secondary-foreground);`);
    lines.push(`  --color-muted: var(--muted);`);
    lines.push(`  --color-muted-foreground: var(--muted-foreground);`);
    lines.push(`  --color-accent: var(--accent);`);
    lines.push(`  --color-accent-foreground: var(--accent-foreground);`);
    lines.push(`  --color-destructive: var(--destructive);`);
    lines.push(
      `  --color-destructive-foreground: var(--destructive-foreground);`
    );
    lines.push(`  --color-border: var(--border);`);
    lines.push(`  --color-input: var(--input);`);
    lines.push(`  --color-ring: var(--ring);`);
    lines.push(`  --color-chart-1: var(--chart-1);`);
    lines.push(`  --color-chart-2: var(--chart-2);`);
    lines.push(`  --color-chart-3: var(--chart-3);`);
    lines.push(`  --color-chart-4: var(--chart-4);`);
    lines.push(`  --color-chart-5: var(--chart-5);`);
    lines.push(`  --color-sidebar: var(--sidebar);`);
    lines.push(`  --color-sidebar-foreground: var(--sidebar-foreground);`);
    lines.push(`  --color-sidebar-primary: var(--sidebar-primary);`);
    lines.push(
      `  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);`
    );
    lines.push(`  --color-sidebar-accent: var(--sidebar-accent);`);
    lines.push(
      `  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);`
    );
    lines.push(`  --color-sidebar-border: var(--sidebar-border);`);
    lines.push(`  --color-sidebar-ring: var(--sidebar-ring);`);
    lines.push(``);
    lines.push(`  --font-sans: var(--font-sans);`);
    lines.push(`  --font-mono: var(--font-mono);`);
    lines.push(`  --font-serif: var(--font-serif);`);
    lines.push(``);
    lines.push(`  --radius-sm: calc(var(--radius) - 4px);`);
    lines.push(`  --radius-md: calc(var(--radius) - 2px);`);
    lines.push(`  --radius-lg: var(--radius);`);
    lines.push(`  --radius-xl: calc(var(--radius) + 4px);`);
    lines.push(``);
    lines.push(`  --shadow-2xs: var(--shadow-2xs);`);
    lines.push(`  --shadow-xs: var(--shadow-xs);`);
    lines.push(`  --shadow-sm: var(--shadow-sm);`);
    lines.push(`  --shadow: var(--shadow);`);
    lines.push(`  --shadow-md: var(--shadow-md);`);
    lines.push(`  --shadow-lg: var(--shadow-lg);`);
    lines.push(`  --shadow-xl: var(--shadow-xl);`);
    lines.push(`  --shadow-2xl: var(--shadow-2xl);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.radius {`);
    lines.push(`  border-radius: var(--radius);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.shadow {`);
    lines.push(`  box-shadow: var(--shadow);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.tracking {`);
    lines.push(`  letter-spacing: var(--letter-spacing);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.font-sans {`);
    lines.push(`  font-family: var(--font-sans);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.font-serif {`);
    lines.push(`  font-family: var(--font-serif);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.font-mono {`);
    lines.push(`  font-family: var(--font-mono);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-state="checked"].data-checked-bg-primary {`);
    lines.push(`  background-color: var(--primary);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-state="checked"].data-checked-text-primary-foreground {`);
    lines.push(`  color: var(--primary-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-state="unchecked"].data-unchecked-bg-input {`);
    lines.push(`  background-color: var(--input);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.focus-ring:focus-visible {`);
    lines.push(`  outline: none;`);
    lines.push(`  box-shadow: 0 0 0 2px var(--ring);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-selected-single="true"].data-selected-single-bg-primary {`);
    lines.push(`  background-color: var(--primary);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-selected-single="true"].data-selected-single-text-primary-foreground {`);
    lines.push(`  color: var(--primary-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-start="true"].data-range-start-bg-primary {`);
    lines.push(`  background-color: var(--primary);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-start="true"].data-range-start-text-primary-foreground {`);
    lines.push(`  color: var(--primary-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-end="true"].data-range-end-bg-primary {`);
    lines.push(`  background-color: var(--primary);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-end="true"].data-range-end-text-primary-foreground {`);
    lines.push(`  color: var(--primary-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-middle="true"].data-range-middle-bg-accent {`);
    lines.push(`  background-color: var(--accent);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-middle="true"].data-range-middle-text-accent-foreground {`);
    lines.push(`  color: var(--accent-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.focus-border-ring:focus-visible {`);
    lines.push(`  border-color: var(--ring);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.focus-ring-color:focus-visible {`);
    lines.push(`  --tw-ring-color: var(--ring);`);
    lines.push(`}`);
    lines.push("```");

    return lines.join("\n");
  } catch (error) {
    return "";
  }
};

const generateDatabasePreviewContent = (
  initialConfig: InitialConfigurationType
): string => {
  const databaseState = useDatabaseStore.getState();
  const lines: string[] = [];

  lines.push("# Database Configuration");
  lines.push("");

  if (initialConfig.questions.databaseProvider === "none") {
    lines.push("No database configuration selected.");
    return lines.join("\n");
  }

  lines.push("## Authentication Methods");
  lines.push("");

  const authMethods: string[] = [];
  if (initialConfig.features.authentication.emailPassword) authMethods.push("Email & Password");
  if (initialConfig.features.authentication.magicLink) authMethods.push("Magic Link");

  if (authMethods.length > 0) {
    authMethods.forEach(method => {
      lines.push(`- ${method}`);
    });
  } else {
    lines.push("*No authentication methods configured*");
  }
  lines.push("");

  lines.push("## Database Schema");
  lines.push("");

  const tables = databaseState.tables;
  if (tables.length === 0) {
    lines.push("*No tables defined*");
    lines.push("");
  } else {
    tables.forEach((table) => {
      lines.push(`### ${table.schema}.${table.name}`);
      lines.push("");

      if (table.columns.length > 0) {
        lines.push("**Columns:**");
        table.columns.forEach((column) => {
          const nullable = column.isOptional ? " (nullable)" : "";
          const defaultVal = column.defaultValue ? ` [default: ${column.defaultValue}]` : "";
          const unique = column.isUnique ? " (unique)" : "";
          lines.push(`- **${column.name}**: ${column.type}${nullable}${unique}${defaultVal}`);
        });
        lines.push("");
      }
    });
  }

  lines.push("## Row Level Security Policies");
  lines.push("");

  const rlsPolicies = databaseState.rlsPolicies;
  if (rlsPolicies.length === 0) {
    lines.push("*No RLS policies defined*");
    lines.push("");
  } else {
    const groupedPolicies: Record<string, typeof rlsPolicies> = {};
    rlsPolicies.forEach((policy) => {
      if (!groupedPolicies[policy.tableId]) {
        groupedPolicies[policy.tableId] = [];
      }
      groupedPolicies[policy.tableId].push(policy);
    });

    Object.entries(groupedPolicies).forEach(([tableId, policies]) => {
      const table = tables.find((t) => t.id === tableId);
      if (!table) return;

      lines.push(`### ${table.schema}.${table.name}`);
      lines.push("");

      policies.forEach((policy) => {
        lines.push(`**${policy.operation}**`);
        policy.rolePolicies?.forEach((rolePolicy) => {
          lines.push(`- Role: ${rolePolicy.role}`);
          lines.push(`- Access Type: ${rolePolicy.accessType}`);
        });
        lines.push("");
      });
    });
  }

  lines.push("## SQL Migration");
  lines.push("");
  const migrationSQL = databaseState.generateSupabaseMigration();
  lines.push("```sql");
  lines.push(migrationSQL);
  lines.push("```");

  return lines.join("\n");
};

const generateEnvironmentPreviewContent = (): string => {
  const lines: string[] = [];

  lines.push("# Development Environment Setup Guide");
  lines.push("");
  lines.push("Follow these steps to set up your development environment and start building your web app with AI.");
  lines.push("");

  lines.push("## 1. Create GitHub Account & Repository");
  lines.push("");
  lines.push("### Create GitHub Account");
  lines.push("If you don't already have one, sign up for a free GitHub account at [github.com/signup](https://github.com/signup).");
  lines.push("");
  lines.push("### Create a New Private Repository");
  lines.push("1. Name your project");
  lines.push("2. Select \"Private\" for repository visibility");
  lines.push("3. Do NOT initialize with README");
  lines.push("4. Click \"Create repository\"");
  lines.push("");
  lines.push("Visit [github.com/new](https://github.com/new) to create your repository.");
  lines.push("");

  lines.push("## 2. Install Visual Studio Code");
  lines.push("");
  lines.push("### Download VS Code");
  lines.push("Visual Studio Code is a free, open-source code editor.");
  lines.push("");
  lines.push("- Download the installer for your operating system");
  lines.push("- Run the installer and follow the setup wizard");
  lines.push("- Launch VS Code after installation completes");
  lines.push("");
  lines.push("Download from [code.visualstudio.com/download](https://code.visualstudio.com/download).");
  lines.push("");

  lines.push("## 3. Create Claude Account & Subscription");
  lines.push("");
  lines.push("### Create Claude Account");
  lines.push("Claude is an AI assistant that will help you build your application.");
  lines.push("");
  lines.push("Sign up at [claude.ai/signup](https://claude.ai/signup).");
  lines.push("");
  lines.push("### Choose a Subscription");
  lines.push("Select a subscription tier that fits your needs. The Pro tier is recommended for active development.");
  lines.push("");
  lines.push("View pricing at [claude.ai/upgrade](https://claude.ai/upgrade).");
  lines.push("");

  lines.push("## 4. Install Claude Code Extension");
  lines.push("");
  lines.push("### Install from VS Code Marketplace");
  lines.push("1. Visit the marketplace page");
  lines.push("2. Click \"Install\" on the marketplace page");
  lines.push("3. VS Code will automatically open and install the extension");
  lines.push("4. Sign in with your Claude account when prompted");
  lines.push("");
  lines.push("Install from [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code).");
  lines.push("");

  lines.push("## 5. Create Supabase Account & Project");
  lines.push("");
  lines.push("### Create Supabase Account");
  lines.push("Supabase provides your database and authentication services.");
  lines.push("");
  lines.push("Sign up at [supabase.com/dashboard/sign-up](https://supabase.com/dashboard/sign-up).");
  lines.push("");
  lines.push("### Create a New Project");
  lines.push("1. Click \"New Project\" in your dashboard");
  lines.push("2. Choose a project name");
  lines.push("3. Create a strong database password (save this!)");
  lines.push("4. Select a region close to your users");
  lines.push("5. Click \"Create new project\"");
  lines.push("");
  lines.push("Create at [supabase.com/dashboard/new](https://supabase.com/dashboard/new).");
  lines.push("");

  lines.push("## 6. Set Up Your Project with Claude");
  lines.push("");
  lines.push("### Copy and Paste Your First Prompt");
  lines.push("Copy the setup prompt from your starter kit, paste it into your Claude chat in VS Code, and follow the instructions.");
  lines.push("");

  lines.push("## 7. Deploy with Vercel (Optional)");
  lines.push("");
  lines.push("### Create Vercel Account");
  lines.push("Vercel provides free hosting and automatic deployments for your Next.js application.");
  lines.push("");
  lines.push("Sign up at [vercel.com/signup](https://vercel.com/signup).");
  lines.push("");
  lines.push("### Connect Your Repository");
  lines.push("1. Import your GitHub repository");
  lines.push("2. Add environment variables (from the process in the previous step)");
  lines.push("3. Click \"Deploy\"");
  lines.push("");
  lines.push("Your app will automatically deploy to a preview URL when you push a git commit to the main branch.");
  lines.push("");
  lines.push("Import at [vercel.com/new](https://vercel.com/new).");
  lines.push("");

  lines.push("## 8. Download and Unpack Your Starter Kit");
  lines.push("");
  lines.push("### Steps");
  lines.push("1. Download your starter kit");
  lines.push("2. Move your starter kit into your project directory");
  lines.push("3. Copy the final prompt and paste it into your Claude chat in VS Code");

  return lines.join("\n");
};

export const processContent = (
  content: string,
  filePath: string,
  getSectionInclude: (
    filePath: string,
    sectionId: string,
    optionId: string
  ) => boolean,
  getSectionContent: (
    filePath: string,
    sectionId: string,
    optionId: string
  ) => string,
  getSectionOptions: (
    filePath: string,
    sectionId: string
  ) => Record<string, { content: string; include: boolean }>,
  appStructure: FileSystemEntry[],
  getPlaceholderValue: (key: string) => string | null,
  getInitialConfiguration: () => InitialConfigurationType,
  previewMode: boolean = false,
  markdownData?: MarkdownData
): string => {
  let processedContent = content;

  processedContent = processedContent.replace(
    /\{\{([a-zA-Z][a-zA-Z0-9]*):([^}]*)\}\}/g,
    (match, key, defaultValue) => {
      const storeValue = getPlaceholderValue(key);
      return storeValue || defaultValue || "";
    }
  );

  processedContent = processedContent.replace(
    /<!-- section-(\d+) -->/g,
    (_, sectionNum) => {
      const sectionId = `section${sectionNum}`;
      const options = getSectionOptions(filePath, sectionId);

      const includedContent = Object.entries(options)
        .filter(([, option]) => option.include)
        .map(([, option]) => option.content)
        .join("\n\n");

      return includedContent;
    }
  );

  processedContent = processedContent.replace(
    /<!-- component-AppStructure -->/g,
    () => {
      return (
        generateAppStructureAscii(appStructure) +
        "\n\n" +
        generateRouteMapAscii(appStructure) +
        "\n\n" +
        generateFeatureFunctionMapAscii(appStructure)
      );
    }
  );

  processedContent = processedContent.replace(
    /<!-- component-LayoutAndStructure -->/g,
    () => {
      return (
        generateAppStructureAscii(appStructure) +
        "\n\n" +
        generateRouteMapAscii(appStructure) +
        "\n\n" +
        generateFeatureFunctionMapAscii(appStructure)
      );
    }
  );

  processedContent = processedContent.replace(
    /<!-- component-ThemeConfiguration -->/g,
    () => {
      return generateThemeCss();
    }
  );

  processedContent = processedContent.replace(
    /<!-- component-AppStructureAscii -->/g,
    () => {
      return (
        generateAppStructureAscii(appStructure) +
        "\n\n" +
        generateRouteMapAscii(appStructure) +
        "\n\n" +
        generateFeatureFunctionMapAscii(appStructure)
      );
    }
  );

  processedContent = processedContent.replace(
    /<!-- component-InitialConfiguration -->/g,
    () => {
      return generateInitialConfigurationContent(getInitialConfiguration());
    }
  );

  processedContent = processedContent.replace(
    /<!-- component-DatabaseConfiguration -->/g,
    () => {
      const databaseState = useDatabaseStore.getState();
      const initialConfig = getInitialConfiguration();

      if (initialConfig.questions.databaseProvider === "none") {
        return "No database configuration selected.";
      }

      const migrationSQL = databaseState.generateSupabaseMigration();

      return "```sql\n" + migrationSQL + "\n```";
    }
  );

  let hasREADMEComponent = false;
  processedContent = processedContent.replace(
    /<!-- component-(\w+) -->/g,
    (match, componentId) => {
      if (componentId === "FullStackOrFrontEnd") {
        return "";
      }

      if (previewMode) {
        if (componentId === "READMEComponent") {
          hasREADMEComponent = true;
          if (markdownData) {
            const readmeNode = markdownData.flatIndex["readme"];
            if (readmeNode && readmeNode.type === "file" && readmeNode.content) {
              return readmeNode.content;
            }
          }
          return "";
        }
        if (componentId === "DatabaseConfiguration") {
          return generateDatabasePreviewContent(getInitialConfiguration());
        }
        if (componentId === "NextStepsComponent") {
          return generateEnvironmentPreviewContent();
        }
      }

      return `[${componentId} Component]`;
    }
  );

  if (previewMode && hasREADMEComponent && processedContent.trim() === "") {
    return "Generate your README file to get started";
  }

  return processedContent;
};

const createConfigSnapshotFromInitialConfig = (
  initialConfig: InitialConfigurationType,
  tables: DatabaseTable[],
  rlsPolicies: RLSPolicy[]
): ConfigSnapshot => {
  return {
    supabase: initialConfig.technologies.supabase,
    postgresql: initialConfig.technologies.postgresql,
    nextjs: initialConfig.technologies.nextjs,
    typescript: initialConfig.technologies.typescript,
    tailwindcss: initialConfig.technologies.tailwindcss,
    shadcn: initialConfig.technologies.shadcn,
    zustand: initialConfig.technologies.zustand,
    reactQuery: initialConfig.technologies.reactQuery,
    vercel: initialConfig.technologies.vercel,
    railway: initialConfig.technologies.railway,
    playwright: initialConfig.technologies.playwright,
    cypress: initialConfig.technologies.cypress,
    resend: initialConfig.technologies.resend,
    stripe: initialConfig.technologies.stripe,
    paypal: initialConfig.technologies.paypal,
    openrouter: initialConfig.technologies.openrouter,
    databaseProvider: initialConfig.questions.databaseProvider,
    alwaysOnServer: initialConfig.questions.alwaysOnServer,
    tables,
    enums: [],
    rlsPolicies,
    authEnabled: initialConfig.features.authentication.enabled,
    authMethods: {
      emailPassword: initialConfig.features.authentication.emailPassword,
      magicLink: initialConfig.features.authentication.magicLink,
    },
    adminEnabled: initialConfig.features.admin.enabled,
    adminRoles: {
      admin: initialConfig.features.admin.admin,
      superAdmin: initialConfig.features.admin.superAdmin,
    },
    paymentsEnabled: initialConfig.features.payments.enabled,
    payments: {
      paypalPayments: initialConfig.features.payments.paypalPayments,
      stripePayments: initialConfig.features.payments.stripePayments,
      stripeSubscriptions: initialConfig.features.payments.stripeSubscriptions,
    },
    aiIntegrationEnabled: initialConfig.features.aiIntegration.enabled,
    aiIntegration: {
      imageGeneration: initialConfig.features.aiIntegration.imageGeneration,
      textGeneration: initialConfig.features.aiIntegration.textGeneration,
    },
    realTimeNotificationsEnabled: initialConfig.features.realTimeNotifications.enabled,
    realTimeNotifications: {
      emailNotifications: initialConfig.features.realTimeNotifications.emailNotifications,
      inAppNotifications: initialConfig.features.realTimeNotifications.inAppNotifications,
    },
    fileStorage: initialConfig.features.fileStorage,
    selectedIDE: "claudecode",
    theme: {
      selectedTheme: 0,
      colors: {
        light: {} as any,
        dark: {} as any,
      },
      typography: {
        light: {} as any,
        dark: {} as any,
      },
      other: {
        light: {} as any,
        dark: {} as any,
      },
    },
  };
};

const generateDatabaseConfigurationDoc = (
  initialConfig: InitialConfigurationType,
  tables: DatabaseTable[],
  rlsPolicies: RLSPolicy[]
): string => {
  if (initialConfig.questions.databaseProvider === "none") {
    return "No database configuration selected.";
  }

  const config = createConfigSnapshotFromInitialConfig(initialConfig, tables, rlsPolicies);
  const lines: string[] = [];

  lines.push("## Database Configuration");
  lines.push("");
  lines.push("### Generated Files");
  lines.push("");

  const NON_DATABASE_FILE_IDS = ["globals.css", "log.utils.ts", "robots-file"];

  const includedFiles = CODE_FILE_CONFIGS.filter((fileConfig) =>
    fileConfig.conditions.include(config) &&
    !NON_DATABASE_FILE_IDS.includes(fileConfig.id)
  );

  includedFiles.forEach((fileConfig) => {
    const filePath = typeof fileConfig.path === "function"
      ? fileConfig.path(config)
      : fileConfig.path;

    lines.push(`#### \`${filePath}\``);

    switch (fileConfig.id) {
      case "globals.css": {
        lines.push(`- Theme: Custom theme with light/dark mode`);
        lines.push(`- Colors: primary, secondary, accent, muted, destructive, etc.`);
        lines.push(`- Typography: sans, serif, mono font families`);
        break;
      }

      case "log.utils.ts": {
        lines.push(`- conditionalLog - Conditional logging with labels`);
        lines.push(`- LOG_LABELS enum for categorized logging`);
        break;
      }

      case "robots-file": {
        lines.push(`- IDE configuration for AI coding assistants`);
        lines.push(`- Core technologies and patterns documentation`);
        break;
      }

      default: {
        lines.push(`- ${fileConfig.metadata.description}`);
      }
    }

    lines.push("");
  });

  return lines.join("\n").trim();
};


export const generateRLSMigrationSQL = (
  rlsPolicies: RLSPolicy[],
  tables: DatabaseTable[],
  initialConfiguration: InitialConfigurationType
): string => {
  const lines: string[] = [];

  const authProvider =
    initialConfiguration.questions.databaseProvider === "supabase"
      ? "supabase"
      : "none";

  lines.push(`-- Enable Row Level Security on all tables`);
  lines.push(``);

  tables.forEach((table) => {
    if (table.schema === "auth" && authProvider === "supabase") {
      return;
    }

    if (table.schema === "better_auth") {
      return;
    }

    lines.push(
      `ALTER TABLE ${table.schema}.${table.name} ENABLE ROW LEVEL SECURITY;`
    );
  });

  lines.push(``);
  lines.push(`-- Create RLS helper function for admin role checks`);
  lines.push(`CREATE OR REPLACE FUNCTION is_admin()`);
  lines.push(`RETURNS boolean`);
  lines.push(`LANGUAGE sql`);
  lines.push(`SECURITY DEFINER`);
  lines.push(`STABLE`);
  lines.push(`AS $$`);
  lines.push(`  SELECT (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('admin', 'super-admin');`);
  lines.push(`$$;`);
  lines.push(``);
  lines.push(`-- Create RLS Policies`);
  lines.push(`-- Using native PostgreSQL roles: anon, authenticated`);
  lines.push(`-- Admin policies use authenticated role with is_admin() function check`);
  lines.push(``);

  const groupedPolicies: Record<string, RLSPolicy[]> = {};
  rlsPolicies.forEach((policy) => {
    if (!groupedPolicies[policy.tableId]) {
      groupedPolicies[policy.tableId] = [];
    }
    groupedPolicies[policy.tableId].push(policy);
  });

  Object.entries(groupedPolicies).forEach(([tableId, policies]) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;

    if (table.schema === "auth" && authProvider === "supabase") {
      return;
    }

    if (table.schema === "better_auth") {
      return;
    }

    lines.push(`-- Policies for ${table.schema}.${table.name}`);

    policies.forEach((policy) => {
      policy.rolePolicies?.forEach((rolePolicy) => {
        if (rolePolicy.accessType === "none") return;

        const policyName = `${table.name}_${policy.operation.toLowerCase()}_${rolePolicy.role}`;
        const postgresRole = rolePolicy.role === "admin" ? "authenticated" : rolePolicy.role;

        let usingClause = "";
        switch (rolePolicy.accessType) {
          case "public":
          case "global":
            if (rolePolicy.role === "admin") {
              usingClause = "(SELECT is_admin())";
            } else {
              usingClause = "true";
            }
            break;
          case "own":
            let userIdColumn = table.columns.find(
              (c) => c.name === "user_id" || c.name === "userId"
            )?.name;

            if (!userIdColumn) {
              const profileIdColumn = table.columns.find(
                (c) => c.name === "profile_id" && c.relation?.table === "profiles"
              );

              if (profileIdColumn) {
                if (rolePolicy.role === "authenticated") {
                  usingClause = `profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())`;
                } else if (rolePolicy.role === "admin") {
                  usingClause = `((SELECT is_admin()) OR profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))`;
                } else {
                  usingClause = "false";
                }
                break;
              }

              const reporterIdColumn = table.columns.find(
                (c) => c.name === "reporter_id" && c.relation?.table === "profiles"
              );

              if (reporterIdColumn) {
                if (rolePolicy.role === "authenticated") {
                  usingClause = `reporter_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())`;
                } else if (rolePolicy.role === "admin") {
                  usingClause = `((SELECT is_admin()) OR reporter_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))`;
                } else {
                  usingClause = "false";
                }
                break;
              }

              usingClause = "false";
              break;
            }

            if (rolePolicy.role === "authenticated") {
              usingClause = `auth.uid() = ${userIdColumn}`;
            } else if (rolePolicy.role === "admin") {
              usingClause = `((SELECT is_admin()) OR auth.uid() = ${userIdColumn})`;
            } else {
              usingClause = "false";
            }
            break;
          default:
            usingClause = "false";
        }

        lines.push(`CREATE POLICY "${policyName}"`);
        lines.push(`  ON ${table.schema}.${table.name}`);
        lines.push(`  FOR ${policy.operation}`);
        lines.push(`  TO ${postgresRole}`);
        if (policy.operation === "INSERT") {
          lines.push(`  WITH CHECK (${usingClause});`);
        } else if (policy.operation === "UPDATE") {
          lines.push(`  USING (${usingClause})`);
          lines.push(`  WITH CHECK (${usingClause});`);
        } else {
          lines.push(`  USING (${usingClause});`);
        }
        lines.push(``);
      });
    });
  });

  return lines.join("\n").trim();
};

const processNode = (
  node: MarkdownNode,
  zip: JSZip,
  currentFolder: JSZip,
  getSectionInclude: (
    filePath: string,
    sectionId: string,
    optionId: string
  ) => boolean,
  getSectionContent: (
    filePath: string,
    sectionId: string,
    optionId: string
  ) => string,
  getSectionOptions: (
    filePath: string,
    sectionId: string
  ) => Record<string, { content: string; include: boolean }>,
  appStructure: FileSystemEntry[],
  getPlaceholderValue: (key: string) => string | null,
  getInitialConfiguration: () => InitialConfigurationType
): void => {
  if (node.include === false) return;

  if (node.type === "directory") {
    const folder = currentFolder.folder(node.name);
    if (folder && node.children) {
      node.children.forEach((child) => {
        processNode(
          child,
          zip,
          folder,
          getSectionInclude,
          getSectionContent,
          getSectionOptions,
          appStructure,
          getPlaceholderValue,
          getInitialConfiguration
        );
      });
    }
  } else if (node.type === "file") {
    const fileExtension = (node as any).fileExtension || "md";
    const isComponentFile = fileExtension === "tsx";

    let cleanContent: string;

    if (isComponentFile) {
      cleanContent = node.content
        .replace(/\\`/g, "`")
        .replace(/\\n/g, "\n")
        .replace(/\\\$/g, "$")
        .replace(/\\\\/g, "\\");
    } else {
      const processedContent = processContent(
        node.content,
        node.path,
        getSectionInclude,
        getSectionContent,
        getSectionOptions,
        appStructure,
        getPlaceholderValue,
        getInitialConfiguration,
        false
      );

      cleanContent = processedContent
        .replace(/\\`/g, "`")
        .replace(/\\n/g, "\n")
        .replace(/\\\\/g, "\\");
    }

    const fileName = (node as any).isDynamicRobotsFile
      ? getDynamicRobotsFileName(getSectionInclude)
      : node.name;

    currentFolder.file(`${fileName}.${fileExtension}`, cleanContent);
  }
};

const loadFolderFromPublicData = async (
  zip: JSZip,
  targetFolder: JSZip,
  folderName: string
): Promise<void> => {
  try {
    const response = await fetch("/data/data-file-list.json");
    if (!response.ok) return;

    const fileList: string[] = await response.json();
    const folderFiles = fileList.filter(
      (path) => path.startsWith(`${folderName}/`) && !path.endsWith(".gitkeep")
    );

    for (const filePath of folderFiles) {
      const fileResponse = await fetch(`/data/${filePath}`);
      if (fileResponse.ok) {
        const content = await fileResponse.text();
        const relativePath = filePath.replace(`${folderName}/`, "");
        const pathParts = relativePath.split("/");
        const fileName = pathParts.pop();

        let currentFolder: JSZip | null = targetFolder;
        for (const part of pathParts) {
          if (currentFolder) {
            currentFolder = currentFolder.folder(part);
          }
        }

        if (currentFolder && fileName) {
          currentFolder.file(fileName, content);
        }
      }
    }
  } catch (error) {
    console.warn(`Could not load ${folderName} from public/data:`, error);
  }
};

export const generateAndDownloadZip = async (
  markdownData: MarkdownData,
  codeFiles: CodeFileNode[],
  getSectionInclude: (
    filePath: string,
    sectionId: string,
    optionId: string
  ) => boolean,
  getSectionContent: (
    filePath: string,
    sectionId: string,
    optionId: string
  ) => string,
  getSectionOptions: (
    filePath: string,
    sectionId: string
  ) => Record<string, { content: string; include: boolean }>,
  appStructure: FileSystemEntry[],
  getPlaceholderValue: (key: string) => string | null,
  getInitialConfiguration: () => InitialConfigurationType
): Promise<void> => {
  const zip = new JSZip();
  const projectName =
    getPlaceholderValue("projectName") || "My_Project";
  const folderName = `${projectName.replace(/\s+/g, "_")}_Starter_Kit`;
  const starterKitFolder = zip.folder(folderName);

  if (!starterKitFolder) {
    throw new Error("Failed to create starter kit folder");
  }

  const claudeFolder = starterKitFolder.folder(".claude");
  if (claudeFolder) {
    const settingsContent = {
      permissions: {
        allow: [
          "Bash(npm:*)",
          "Bash(npx:*)",
          "Bash(git:*)",
          "Bash(supabase:*)",
          "Bash(node:*)",
          "Bash(mkdir:*)",
          "Bash(rm:*)",
          "Bash(mv:*)",
          "Bash(cp:*)",
          "Bash(ls:*)",
          "Bash(cat:*)",
          "Bash(touch:*)",
          "Bash(unzip:*)"
        ]
      }
    };
    claudeFolder.file("settings.local.json", JSON.stringify(settingsContent, null, 2));
  }

  try {
    const claudeResponse = await fetch("/data/CLAUDE.md");
    if (claudeResponse.ok) {
      const claudeContent = await claudeResponse.text();
      starterKitFolder.file("CLAUDE.md", claudeContent);
    }
  } catch (error) {
    console.error("Failed to load CLAUDE.md:", error);
  }

  const documentationFolder = starterKitFolder.folder("documentation");
  if (!documentationFolder) {
    throw new Error("Failed to create documentation folder");
  }

  await loadFolderFromPublicData(zip, documentationFolder, "documentation");

  const initialConfigurationFolder = documentationFolder.folder("initial_configuration");
  if (!initialConfigurationFolder) {
    throw new Error("Failed to create initial_configuration folder");
  }

  const markdownFiles = [
    { path: "/data/markdown/1-README.md", name: "README.md" },
    { path: "/data/markdown/2-Theme.md", name: "Theme.md" },
    { path: "/data/markdown/3-App_Directory.md", name: "App_Directory.md" },
    { path: "/data/markdown/4-Database.md", name: "Database.md" },
  ];

  for (const file of markdownFiles) {
    try {
      const response = await fetch(file.path);
      if (response.ok) {
        const rawContent = await response.text();
        const processedContent = processContent(
          rawContent,
          file.path,
          getSectionInclude,
          getSectionContent,
          getSectionOptions,
          appStructure,
          getPlaceholderValue,
          getInitialConfiguration,
          true,
          markdownData
        );
        initialConfigurationFolder.file(file.name, processedContent);
      }
    } catch (error) {
      console.error(`Failed to load ${file.name}:`, error);
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${folderName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
