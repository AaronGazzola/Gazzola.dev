import {
  FileSystemEntry,
  InitialConfigurationType,
  MarkdownData,
  MarkdownNode,
  CodeFileNode,
} from "@/app/(editor)/layout.types";
import JSZip from "jszip";

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
    { id: "neondb", name: "NeonDB" },
    { id: "prisma", name: "Prisma" },
    { id: "betterAuth", name: "Better Auth" },
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

      case "prisma":
        return "Type-safe database ORM providing schema management, migrations, and query building for PostgreSQL database operations.";

      case "postgresql":
        return "Relational database system storing application data including user accounts, authentication sessions, and application-specific data.";

      case "neondb":
        return "Serverless PostgreSQL database hosting platform providing automatic scaling and branching capabilities.";

      case "betterAuth": {
        const authMethods: string[] = [];
        if (initialConfiguration.features.authentication.magicLink)
          authMethods.push("magic link");
        if (initialConfiguration.features.authentication.emailPassword)
          authMethods.push("email/password");
        if (initialConfiguration.features.authentication.otp)
          authMethods.push("OTP");
        if (initialConfiguration.features.authentication.googleAuth)
          authMethods.push("Google OAuth");
        if (initialConfiguration.features.authentication.githubAuth)
          authMethods.push("GitHub OAuth");
        if (initialConfiguration.features.authentication.appleAuth)
          authMethods.push("Apple Sign In");
        if (initialConfiguration.features.authentication.passwordOnly)
          authMethods.push("password-only");

        const methodsList =
          authMethods.length > 0 ? ` supporting ${authMethods.join(", ")}` : "";
        return `Authentication library providing secure user authentication and session management${methodsList}.`;
      }

      case "supabase": {
        const features: string[] = [];
        if (initialConfiguration.questions.useSupabase === "authOnly") {
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
          initialConfiguration.features.authentication.magicLink ||
          initialConfiguration.features.authentication.emailPassword ||
          initialConfiguration.features.authentication.otp;
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

    const lines: string[] = ["```css", "", ":root {"];

    colorKeys.forEach(({ key, css }) => {
      const color = (lightColors as any)[key];
      if (color) {
        lines.push(`  ${css}: ${color};`);
      }
    });

    lines.push(`  --font-sans:`);
    lines.push(`    ${lightTypography.fontSans};`);
    lines.push(`  --font-serif: ${lightTypography.fontSerif};`);
    lines.push(`  --font-mono:`);
    lines.push(`    ${lightTypography.fontMono};`);
    lines.push(`  --radius: ${lightOther.radius}rem;`);
    lines.push(`  --shadow-x: ${lightOther.shadow.offsetX};`);
    lines.push(`  --shadow-y: ${lightOther.shadow.offsetY}px;`);
    lines.push(`  --shadow-blur: ${lightOther.shadow.blurRadius}px;`);
    lines.push(`  --shadow-spread: ${lightOther.shadow.spread}px;`);
    lines.push(`  --shadow-opacity: ${lightOther.shadow.opacity};`);
    lines.push(
      `  --shadow-color: ${lightOther.shadow.color};`
    );
    lines.push(`  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
    lines.push(`  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
    lines.push(`  --shadow-sm:`);
    lines.push(
      `    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(
      `  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(`  --shadow-md:`);
    lines.push(
      `    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(`  --shadow-lg:`);
    lines.push(
      `    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(`  --shadow-xl:`);
    lines.push(
      `    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(`  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);`);
    lines.push(
      `  --tracking-normal: ${lightTypography.letterSpacing}em;`
    );
    lines.push(`  --spacing: ${lightOther.spacing}rem;`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.dark {`);

    colorKeys.forEach(({ key, css }) => {
      const color = (darkColors as any)[key];
      if (color) {
        lines.push(`  ${css}: ${color};`);
      }
    });

    lines.push(`  --font-sans:`);
    lines.push(`    ${darkTypography.fontSans};`);
    lines.push(`  --font-serif: ${darkTypography.fontSerif};`);
    lines.push(`  --font-mono:`);
    lines.push(`    ${darkTypography.fontMono};`);
    lines.push(`  --radius: ${darkOther.radius}rem;`);
    lines.push(`  --shadow-x: ${darkOther.shadow.offsetX};`);
    lines.push(`  --shadow-y: ${darkOther.shadow.offsetY}px;`);
    lines.push(`  --shadow-blur: ${darkOther.shadow.blurRadius}px;`);
    lines.push(`  --shadow-spread: ${darkOther.shadow.spread}px;`);
    lines.push(`  --shadow-opacity: ${darkOther.shadow.opacity};`);
    lines.push(
      `  --shadow-color: ${darkOther.shadow.color};`
    );
    lines.push(`  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
    lines.push(`  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);`);
    lines.push(`  --shadow-sm:`);
    lines.push(
      `    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(
      `  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(`  --shadow-md:`);
    lines.push(
      `    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(`  --shadow-lg:`);
    lines.push(
      `    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(`  --shadow-xl:`);
    lines.push(
      `    0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);`
    );
    lines.push(`  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`@theme inline {`);
    lines.push(`  --color-background: var(--background);`);
    lines.push(`  --color-foreground: var(--foreground);`);
    lines.push(`  --color-card: var(--card);`);
    lines.push(`  --color-card-foreground: var(--card-foreground);`);
    lines.push(`  --color-popover: var(--popover);`);
    lines.push(
      `  --color-popover-foreground: var(--popover-foreground);`
    );
    lines.push(`  --color-primary: var(--primary);`);
    lines.push(
      `  --color-primary-foreground: var(--primary-foreground);`
    );
    lines.push(`  --color-secondary: var(--secondary);`);
    lines.push(
      `  --color-secondary-foreground: var(--secondary-foreground);`
    );
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
    lines.push(
      `  --color-sidebar-foreground: var(--sidebar-foreground);`
    );
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
    lines.push(`.theme-radius {`);
    lines.push(`  border-radius: var(--radius);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.theme-shadow {`);
    lines.push(`  box-shadow: var(--shadow);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-state="checked"].theme-data-checked-bg-primary {`);
    lines.push(`  background-color: var(--primary);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-state="checked"].theme-data-checked-text-primary-foreground {`);
    lines.push(`  color: var(--primary-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-state="unchecked"].theme-data-unchecked-bg-input {`);
    lines.push(`  background-color: var(--input);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.theme-focus-ring:focus-visible {`);
    lines.push(`  outline: none;`);
    lines.push(`  box-shadow: 0 0 0 2px var(--ring);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-selected-single="true"].theme-data-selected-single-bg-primary {`);
    lines.push(`  background-color: var(--primary);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-selected-single="true"].theme-data-selected-single-text-primary-foreground {`);
    lines.push(`  color: var(--primary-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-start="true"].theme-data-range-start-bg-primary {`);
    lines.push(`  background-color: var(--primary);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-start="true"].theme-data-range-start-text-primary-foreground {`);
    lines.push(`  color: var(--primary-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-end="true"].theme-data-range-end-bg-primary {`);
    lines.push(`  background-color: var(--primary);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-end="true"].theme-data-range-end-text-primary-foreground {`);
    lines.push(`  color: var(--primary-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-middle="true"].theme-data-range-middle-bg-accent {`);
    lines.push(`  background-color: var(--accent);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`[data-range-middle="true"].theme-data-range-middle-text-accent-foreground {`);
    lines.push(`  color: var(--accent-foreground);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.theme-focus-border-ring:focus-visible {`);
    lines.push(`  border-color: var(--ring);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`.theme-focus-ring-color:focus-visible {`);
    lines.push(`  --tw-ring-color: var(--ring);`);
    lines.push(`}`);
    lines.push("```");

    return lines.join("\n");
  } catch (error) {
    return "";
  }
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
  getInitialConfiguration: () => InitialConfigurationType
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
        generateRouteMapAscii(appStructure)
      );
    }
  );

  processedContent = processedContent.replace(
    /<!-- component-LayoutAndStructure -->/g,
    () => {
      return (
        generateAppStructureAscii(appStructure) +
        "\n\n" +
        generateRouteMapAscii(appStructure)
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
    /<!-- component-InitialConfiguration -->/g,
    () => {
      return generateInitialConfigurationContent(getInitialConfiguration());
    }
  );

  processedContent = processedContent.replace(
    /<!-- component-(\w+) -->/g,
    (match, componentId) => {
      if (componentId === "FullStackOrFrontEnd") {
        return "";
      }
      return `[${componentId} Component]`;
    }
  );

  return processedContent;
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
        getInitialConfiguration
      );

      cleanContent = processedContent
        .replace(/\\`/g, "`")
        .replace(/\\n/g, "\n")
        .replace(/\\\\/g, "\\");
    }

    currentFolder.file(`${node.name}.${fileExtension}`, cleanContent);
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
  const roadmapFolder = zip.folder("Roadmap");

  if (markdownData.root && markdownData.root.children && roadmapFolder) {
    markdownData.root.children
      .filter((child) => child.include !== false)
      .forEach((child) => {
        processNode(
          child,
          zip,
          roadmapFolder,
          getSectionInclude,
          getSectionContent,
          getSectionOptions,
          appStructure,
          getPlaceholderValue,
          getInitialConfiguration
        );
      });

    codeFiles.forEach((codeFile) => {
      if (!codeFile.includeCondition()) return;

      const pathParts = codeFile.downloadPath?.split("/") || [];
      let currentFolder: JSZip | null = roadmapFolder;

      pathParts.forEach((part) => {
        if (currentFolder) {
          currentFolder = currentFolder.folder(part);
        }
      });

      if (currentFolder) {
        const fileContent = codeFile.content();
        currentFolder.file(codeFile.name, fileContent);
      }
    });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "roadmap.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
