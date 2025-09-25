import JSZip from "jszip";
import { FileSystemEntry, MarkdownData, MarkdownNode, InitialConfigurationType } from "@/app/(editor)/layout.types";

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

export const generateAppStructureAscii = (appStructure: FileSystemEntry[]): string => {
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

export const generateRouteMapAscii = (appStructure: FileSystemEntry[]): string => {
  const lines: string[] = ["```txt", "Route Map (Generated from App Structure):", ""];

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

const generateInitialConfigurationContent = (initialConfiguration: InitialConfigurationType): string => {
  const lines: string[] = ["## Required Technologies", ""];

  const technologies = [
    { id: "nextjs", name: "Next.js", required: true, reason: "Core technology stack" },
    { id: "tailwindcss", name: "TailwindCSS", required: true, reason: "Core technology stack" },
    { id: "shadcn", name: "Shadcn/ui", required: true, reason: "Core technology stack" },
    { id: "zustand", name: "Zustand", required: true, reason: "Core technology stack" },
    { id: "reactQuery", name: "React Query", required: true, reason: "Core technology stack" },
    { id: "supabase", name: "Supabase" },
    { id: "prisma", name: "Prisma" },
    { id: "betterAuth", name: "Better Auth" },
    { id: "postgresql", name: "PostgreSQL" },
    { id: "cypress", name: "Cypress" },
    { id: "resend", name: "Resend" },
    { id: "stripe", name: "Stripe" },
    { id: "paypal", name: "PayPal" },
  ];

  const hasDatabaseFunctionality =
    initialConfiguration.features.authentication.enabled ||
    initialConfiguration.features.admin.enabled ||
    initialConfiguration.features.fileStorage ||
    initialConfiguration.features.realTimeNotifications;

  const getFeatureReasons = (techId: string): string[] => {
    const reasons: string[] = [];

    if (techId === "prisma" || techId === "postgresql") {
      if (hasDatabaseFunctionality) {
        reasons.push("Database functionality required");
      }
    }

    if (techId === "supabase") {
      if (initialConfiguration.questions.supabaseAuthOnly && initialConfiguration.features.authentication.enabled) {
        reasons.push("Supabase-only authentication");
      }
      if (initialConfiguration.features.fileStorage) {
        reasons.push("File storage");
      }
      if (initialConfiguration.features.realTimeNotifications) {
        reasons.push("Real-time notifications");
      }
    }

    if (techId === "betterAuth") {
      if (initialConfiguration.features.authentication.enabled && !initialConfiguration.questions.supabaseAuthOnly) {
        reasons.push("Authentication system");
      }
    }

    if (techId === "resend") {
      if (initialConfiguration.features.emailSending) {
        reasons.push("Email sending");
      }
      if (initialConfiguration.features.authentication.enabled) {
        const hasEmailAuth = initialConfiguration.features.authentication.magicLink ||
          initialConfiguration.features.authentication.emailPassword ||
          initialConfiguration.features.authentication.otp;
        if (hasEmailAuth) {
          reasons.push("Email-based authentication");
        }
      }
    }

    if (techId === "stripe") {
      if (initialConfiguration.features.payments.stripePayments) {
        reasons.push("One-time payments");
      }
      if (initialConfiguration.features.payments.stripeSubscriptions) {
        reasons.push("Subscription billing");
      }
    }

    if (techId === "paypal") {
      if (initialConfiguration.features.payments.paypalPayments) {
        reasons.push("PayPal payments");
      }
    }

    return reasons;
  };

  technologies.forEach(tech => {
    const isRequired = tech.required ||
      initialConfiguration.technologies[tech.id as keyof typeof initialConfiguration.technologies];

    if (isRequired) {
      lines.push(`### ${tech.name}`);

      const reasons = getFeatureReasons(tech.id);
      if (tech.reason) {
        reasons.unshift(tech.reason);
      }

      if (reasons.length > 0) {
        lines.push("**Required for:**");
        reasons.forEach(reason => {
          lines.push(`- ${reason}`);
        });
      }

      lines.push("");
    }
  });

  if (initialConfiguration.features.authentication.enabled) {
    lines.push("## Authentication Features");
    lines.push("");

    const authFeatures = [
      { key: "magicLink", label: "Magic Link Authentication" },
      { key: "emailPassword", label: "Email & Password Authentication" },
      { key: "otp", label: "One-Time Password Authentication" },
      { key: "googleAuth", label: "Google OAuth" },
      { key: "githubAuth", label: "GitHub OAuth" },
      { key: "appleAuth", label: "Apple Sign In" },
    ];

    authFeatures.forEach(feature => {
      if (initialConfiguration.features.authentication[feature.key as keyof typeof initialConfiguration.features.authentication]) {
        lines.push(`- ${feature.label}`);
      }
    });
    lines.push("");
  }

  if (initialConfiguration.features.admin.enabled) {
    lines.push("## Admin Features");
    lines.push("");

    const adminFeatures = [
      { key: "superAdmins", label: "Super Admins" },
      { key: "orgAdmins", label: "Organization Admins" },
      { key: "orgMembers", label: "Organization Members" },
    ];

    adminFeatures.forEach(feature => {
      if (initialConfiguration.features.admin[feature.key as keyof typeof initialConfiguration.features.admin]) {
        lines.push(`- ${feature.label}`);
      }
    });
    lines.push("");
  }

  if (initialConfiguration.features.payments.enabled) {
    lines.push("## Payment Features");
    lines.push("");

    const paymentFeatures = [
      { key: "stripePayments", label: "Stripe One-time Payments" },
      { key: "stripeSubscriptions", label: "Stripe Subscriptions" },
      { key: "paypalPayments", label: "PayPal Payments" },
    ];

    paymentFeatures.forEach(feature => {
      if (initialConfiguration.features.payments[feature.key as keyof typeof initialConfiguration.features.payments]) {
        lines.push(`- ${feature.label}`);
      }
    });
    lines.push("");
  }

  const otherFeatures = [];
  if (initialConfiguration.features.fileStorage) {
    otherFeatures.push("File Storage");
  }
  if (initialConfiguration.features.realTimeNotifications) {
    otherFeatures.push("Real-time Notifications");
  }
  if (initialConfiguration.features.emailSending) {
    otherFeatures.push("Email Sending");
  }

  if (otherFeatures.length > 0) {
    lines.push("## Additional Features");
    lines.push("");
    otherFeatures.forEach(feature => {
      lines.push(`- ${feature}`);
    });
    lines.push("");
  }

  return lines.join("\n");
};

export const processContent = (
  content: string,
  filePath: string,
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean,
  getSectionContent: (filePath: string, sectionId: string, optionId: string) => string,
  getSectionOptions: (filePath: string, sectionId: string) => Record<string, { content: string; include: boolean }>,
  appStructure: FileSystemEntry[],
  getPlaceholderValue: (key: string) => string | null,
  getInitialConfiguration: () => InitialConfigurationType
): string => {
  let processedContent = content;

  processedContent = processedContent.replace(/\{\{([a-zA-Z][a-zA-Z0-9]*):([^}]*)\}\}/g, (match, key, defaultValue) => {
    const storeValue = getPlaceholderValue(key);
    return storeValue || defaultValue || '';
  });

  processedContent = processedContent.replace(/<!-- section-(\d+) -->/g, (_, sectionNum) => {
    const sectionId = `section${sectionNum}`;
    const options = getSectionOptions(filePath, sectionId);

    const includedContent = Object.entries(options)
      .filter(([, option]) => option.include)
      .map(([, option]) => option.content)
      .join('\n\n');

    return includedContent;
  });

  processedContent = processedContent.replace(/<!-- component-AppStructure -->/g, () => {
    return generateAppStructureAscii(appStructure) + "\n\n" + generateRouteMapAscii(appStructure);
  });

  processedContent = processedContent.replace(/<!-- component-InitialConfiguration -->/g, () => {
    return generateInitialConfigurationContent(getInitialConfiguration());
  });

  processedContent = processedContent.replace(/<!-- component-(\w+) -->/g, (match, componentId) => {
    if (componentId === "FullStackOrFrontEnd") {
      return "";
    }
    return `[${componentId} Component]`;
  });

  return processedContent;
};

const processNode = (
  node: MarkdownNode,
  zip: JSZip,
  currentFolder: JSZip,
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean,
  getSectionContent: (filePath: string, sectionId: string, optionId: string) => string,
  getSectionOptions: (filePath: string, sectionId: string) => Record<string, { content: string; include: boolean }>,
  appStructure: FileSystemEntry[],
  getPlaceholderValue: (key: string) => string | null,
  getInitialConfiguration: () => InitialConfigurationType
): void => {
  if (node.include === false) return;

  if (node.type === "directory") {
    const folder = currentFolder.folder(node.name);
    if (folder && node.children) {
      node.children.forEach(child => {
        processNode(child, zip, folder, getSectionInclude, getSectionContent, getSectionOptions, appStructure, getPlaceholderValue, getInitialConfiguration);
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
      .replace(/\\`/g, '`')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\');

    currentFolder.file(`${node.name}.md`, cleanContent);
  }
};

export const generateAndDownloadZip = async (
  markdownData: MarkdownData,
  getSectionInclude: (filePath: string, sectionId: string, optionId: string) => boolean,
  getSectionContent: (filePath: string, sectionId: string, optionId: string) => string,
  getSectionOptions: (filePath: string, sectionId: string) => Record<string, { content: string; include: boolean }>,
  appStructure: FileSystemEntry[],
  getPlaceholderValue: (key: string) => string | null,
  getInitialConfiguration: () => InitialConfigurationType
): Promise<void> => {
  const zip = new JSZip();
  const roadmapFolder = zip.folder("Roadmap");

  if (markdownData.root && markdownData.root.children && roadmapFolder) {
    markdownData.root.children
      .filter(child => child.include !== false)
      .forEach(child => {
        processNode(child, zip, roadmapFolder, getSectionInclude, getSectionContent, getSectionOptions, appStructure, getPlaceholderValue, getInitialConfiguration);
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