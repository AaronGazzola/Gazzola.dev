import { FileSystemEntry, UserExperienceFileType } from "@/app/(editor)/layout.types";
import { PageInput } from "./READMEComponent.types";
import { RouteGrouping } from "./AppStructure.types";
import { generateId } from "./READMEComponent.types";
import { createRouteFromPath } from "./AppStructure.utils";

export const parseRoutesToStructure = (pages: PageInput[]): FileSystemEntry[] => {
  const sortedPages = [...pages].sort((a, b) => {
    const depthA = a.route.split("/").filter(Boolean).length;
    const depthB = b.route.split("/").filter(Boolean).length;
    return depthA - depthB;
  });

  let structure: FileSystemEntry[] = [
    {
      id: "app-root",
      name: "app",
      type: "directory",
      isExpanded: true,
      children: [
        { id: generateId(), name: "layout.tsx", type: "file" },
      ],
    },
  ];

  const routeGroupings = detectRouteGroups(sortedPages);

  if (routeGroupings.length > 0) {
    routeGroupings.forEach((grouping) => {
      const groupName = `(${grouping.name})`;
      const groupPath = `/${groupName}`;

      structure = createRouteFromPath(structure, groupPath, "", true);

      const groupEntry = findEntryByPath(structure, groupPath);
      if (groupEntry && groupEntry.type === "directory" && groupEntry.children) {
        if (!groupEntry.children.some((c) => c.name === "layout.tsx")) {
          groupEntry.children.unshift({
            id: generateId(),
            name: "layout.tsx",
            type: "file",
          });
        }
      }

      grouping.routes.forEach((page) => {
        const routeWithoutGroupPrefix = page.route === "/" ? groupPath : `${groupPath}${page.route}`;
        structure = createRouteFromPath(structure, routeWithoutGroupPrefix, "", true);
      });
    });

    const ungroupedPages = pages.filter(
      (page) => !routeGroupings.some((g) => g.routes.includes(page))
    );
    ungroupedPages.forEach((page) => {
      if (page.route !== "/") {
        structure = createRouteFromPath(structure, page.route, "", true);
      }
    });
  } else {
    sortedPages.forEach((page) => {
      if (page.route !== "/") {
        structure = createRouteFromPath(structure, page.route, "", true);
      }
    });
  }

  const appRoot = structure.find((entry) => entry.name === "app");
  if (appRoot && appRoot.type === "directory" && appRoot.children) {
    if (!appRoot.children.some((c) => c.name === "page.tsx")) {
      const layoutIndex = appRoot.children.findIndex((c) => c.name === "layout.tsx");
      appRoot.children.splice(layoutIndex + 1, 0, {
        id: generateId(),
        name: "page.tsx",
        type: "file",
      });
    }
  }

  return structure;
};

export const detectRouteGroups = (pages: PageInput[]): RouteGrouping[] => {
  const groupings: RouteGrouping[] = [];

  const authKeywords = ["login", "register", "signup", "sign-up", "auth", "forgot", "reset"];
  const authPages = pages.filter((p) =>
    authKeywords.some((keyword) => p.route.toLowerCase().includes(keyword))
  );
  if (authPages.length >= 2) {
    groupings.push({
      name: "auth",
      routes: authPages,
      semanticTheme: "authentication",
    });
  }

  const adminKeywords = ["admin"];
  const adminPages = pages.filter((p) =>
    adminKeywords.some((keyword) => p.route.toLowerCase().includes(keyword))
  );
  if (adminPages.length >= 2) {
    groupings.push({
      name: "admin",
      routes: adminPages,
      semanticTheme: "administration",
    });
  }

  const dashboardKeywords = ["dashboard"];
  const dashboardPages = pages.filter((p) =>
    p.route.toLowerCase().includes("dashboard") ||
    (p.route.startsWith("/") && !p.route.includes("/") && p.route !== "/")
  );
  if (dashboardPages.length >= 3) {
    groupings.push({
      name: "dashboard",
      routes: dashboardPages,
      semanticTheme: "main application",
    });
  }

  return groupings;
};

export const createUtilityFileEntry = (
  parentPath: string,
  fileType: UserExperienceFileType,
  isLayoutLevel: boolean = false
): FileSystemEntry => {
  const baseFileName = isLayoutLevel ? "layout" : "page";
  const extension = getExtensionForFileType(fileType);
  const fileName = `${baseFileName}.${fileType}.${extension}`;

  return {
    id: generateId(),
    name: fileName,
    type: "file",
  };
};

const getExtensionForFileType = (fileType: UserExperienceFileType): string => {
  switch (fileType) {
    case "hooks":
      return "tsx";
    case "actions":
      return "ts";
    case "stores":
      return "ts";
    case "types":
      return "ts";
    default:
      return "ts";
  }
};

export const findEntryByPath = (
  structure: FileSystemEntry[],
  path: string
): FileSystemEntry | null => {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return structure.find((e) => e.name === "app") || null;
  }

  let current: FileSystemEntry | undefined = structure.find((e) => e.name === "app");
  if (!current) return null;

  for (const segment of segments) {
    if (!current || current.type !== "directory" || !current.children) {
      return null;
    }
    const found: FileSystemEntry | undefined = current.children.find((c) => c.name === segment);
    if (!found) return null;
    current = found;
  }

  return current || null;
};

export const addUtilityFilesToStructure = (
  structure: FileSystemEntry[],
  pagePath: string,
  utilityFileTypes: UserExperienceFileType[]
): FileSystemEntry[] => {
  const updatedStructure = JSON.parse(JSON.stringify(structure)) as FileSystemEntry[];

  const parentDir = findEntryByPath(updatedStructure, pagePath);
  if (!parentDir || parentDir.type !== "directory" || !parentDir.children) {
    return structure;
  }

  utilityFileTypes.forEach((fileType) => {
    const utilityFile = createUtilityFileEntry(pagePath, fileType, false);
    const exists = parentDir.children!.some((c) => c.name === utilityFile.name);
    if (!exists) {
      const pageIndex = parentDir.children!.findIndex((c) => c.name === "page.tsx");
      if (pageIndex !== -1) {
        parentDir.children!.splice(pageIndex + 1, 0, utilityFile);
      } else {
        parentDir.children!.push(utilityFile);
      }
    }
  });

  return updatedStructure;
};

export const findCommonAncestor = (paths: string[]): string => {
  if (paths.length === 0) return "/app";
  if (paths.length === 1) return paths[0];

  const segments = paths.map((p) => p.split("/").filter(Boolean));
  let commonPath = "/app";

  const minLength = Math.min(...segments.map((s) => s.length));

  for (let i = 0; i < minLength; i++) {
    const segment = segments[0][i];
    if (segments.every((s) => s[i] === segment)) {
      commonPath += `/${segment}`;
    } else {
      break;
    }
  }

  return commonPath;
};

export const determineUtilityFilePlacement = (
  pagePath: string,
  fileType: UserExperienceFileType,
  isShared: boolean
): string => {
  const directory = pagePath;
  const fileName = `page.${fileType}.${getExtensionForFileType(fileType)}`;

  return `${directory}/${fileName}`;
};
