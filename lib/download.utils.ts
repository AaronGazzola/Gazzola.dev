import {
  FileSystemEntry,
  InitialConfigurationType,
  MarkdownData,
  MarkdownNode,
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

export const generateAppStructureAscii = (
  appStructure: FileSystemEntry[]
): string => {
  const lines: string[] = ["```txt", "App Directory Structure:", ""];

  function renderTree(
    entries: FileSystemEntry[],
    parentPrefix = "",
    isLast = true
  ): void {
    entries.forEach((entry, index) => {
      const isLastEntry = index === entries.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";
      const prefix = parentPrefix + (isLast ? "    " : "│   ");

      lines.push(
        parentPrefix +
          connector +
          entry.name +
          (entry.type === "directory" ? "/" : "")
      );

      if (entry.children && entry.children.length > 0) {
        renderTree(entry.children, prefix, isLastEntry);
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
          authMethods.length > 0
            ? ` supporting ${authMethods.join(", ")}`
            : "";
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

    const cleanContent = processedContent
      .replace(/\\`/g, "`")
      .replace(/\\n/g, "\n")
      .replace(/\\\\/g, "\\");

    currentFolder.file(`${node.name}.md`, cleanContent);
  }
};

export const generateAndDownloadZip = async (
  markdownData: MarkdownData,
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
