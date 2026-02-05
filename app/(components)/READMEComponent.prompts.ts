import { LayoutInput, PageInput, AuthMethods, PageAccess, AIContentMap } from "./READMEComponent.types";

export const formatLayoutOptions = (layout: LayoutInput): string => {
  const parts: string[] = [];
  if (layout.options.header.enabled) {
    const headerParts: string[] = ["Header"];
    const headerDetails: string[] = [];
    if (layout.options.header.title) headerDetails.push("app title");
    if (layout.options.header.navigationItems) headerDetails.push("navigation");
    if (layout.options.header.profileAvatarPopover) headerDetails.push("profile menu");
    if (layout.options.header.sticky) headerDetails.push("sticky");
    if (layout.options.header.sidebarToggleButton) headerDetails.push("sidebar toggle");
    if (headerDetails.length > 0) {
      headerParts.push(`(${headerDetails.join(", ")})`);
    }
    parts.push(headerParts.join(" "));
  }
  if (layout.options.leftSidebar.enabled) {
    const sidebarParts: string[] = ["Left Sidebar"];
    const sidebarDetails: string[] = [];
    if (layout.options.leftSidebar.title) sidebarDetails.push("app title");
    if (layout.options.leftSidebar.navigationItems) sidebarDetails.push("navigation");
    if (layout.options.leftSidebar.profileAvatarPopover) sidebarDetails.push("profile menu");
    if (sidebarDetails.length > 0) {
      sidebarParts.push(`(${sidebarDetails.join(", ")})`);
    }
    parts.push(sidebarParts.join(" "));
  }
  if (layout.options.rightSidebar.enabled) {
    const sidebarParts: string[] = ["Right Sidebar"];
    const sidebarDetails: string[] = [];
    if (layout.options.rightSidebar.title) sidebarDetails.push("app title");
    if (layout.options.rightSidebar.navigationItems) sidebarDetails.push("navigation");
    if (layout.options.rightSidebar.profileAvatarPopover) sidebarDetails.push("profile menu");
    if (sidebarDetails.length > 0) {
      sidebarParts.push(`(${sidebarDetails.join(", ")})`);
    }
    parts.push(sidebarParts.join(" "));
  }
  if (layout.options.footer.enabled) {
    const footerParts: string[] = ["Footer"];
    const footerDetails: string[] = [];
    if (layout.options.footer.title) footerDetails.push("app title");
    if (layout.options.footer.allNavItems) footerDetails.push("all nav items");
    if (layout.options.footer.legalNavItems) footerDetails.push("legal links");
    if (footerDetails.length > 0) {
      footerParts.push(`(${footerDetails.join(", ")})`);
    }
    parts.push(footerParts.join(" "));
  }
  return parts.join(", ");
};


export const buildReadmeTemplate = (
  title: string,
  description: string,
  layouts: LayoutInput[],
  pages: PageInput[],
  authMethods: AuthMethods,
  pageAccess: PageAccess[]
): string => {
  const enabledAuthMethods = Object.entries(authMethods)
    .filter(([_, enabled]) => enabled)
    .map(([method]) => {
      const methodNames: Record<string, string> = {
        emailPassword: "Email & Password",
        magicLink: "Magic Link",
      };
      return methodNames[method] || method;
    });

  let template = `# ${title}

[AI_OVERVIEW]

`;

  if (layouts.length > 0) {
    template += `## Layouts

`;
    layouts.forEach((layout) => {
      const pagesUsingLayout = pages.filter((p) =>
        p.layoutIds.includes(layout.id)
      );
      template += `### ${layout.name}

**Components:** ${formatLayoutOptions(layout)}

**Pages using this layout:**
${pagesUsingLayout.map((p) => `- ${p.name} (\`${p.route}\`)`).join("\n") || "- None"}

`;
    });
  }

  template += `## Pages

`;

  pages.forEach((page) => {
    const access = pageAccess.find((pa) => pa.pageId === page.id);
    const accessBadges = [];
    if (access?.anon) accessBadges.push("🌐 Anon");
    if (access?.auth) accessBadges.push("🔐 Auth");
    if (access?.admin) accessBadges.push("👑 Admin");
    const accessText = accessBadges.length > 0 ? accessBadges.join(" | ") : "None";

    const pageLayouts = page.layoutIds
      .map((layoutId) => {
        const layout = layouts.find((l) => l.id === layoutId);
        return layout ? layout.name : null;
      })
      .filter(Boolean);

    template += `### ${page.name} (\`${page.route}\`)

**Access:** ${accessText}
`;
    if (pageLayouts.length > 0) {
      template += `**Layouts:** ${pageLayouts.join(", ")}
`;
    }
    template += `

${page.description}

`;
  });

  if (enabledAuthMethods.length > 0) {
    const anonCount = pages.filter((p) => {
      const access = pageAccess.find((pa) => pa.pageId === p.id);
      return access?.anon;
    }).length;

    const authCount = pages.filter((p) => {
      const access = pageAccess.find((pa) => pa.pageId === p.id);
      return access?.auth;
    }).length;

    const adminCount = pages.filter((p) => {
      const access = pageAccess.find((pa) => pa.pageId === p.id);
      return access?.admin;
    }).length;

    template += `## Authentication & Access Control

**Authentication Methods:** ${enabledAuthMethods.join(", ")}

**Access Levels:**
- 🌐 Anonymous: ${anonCount} pages
- 🔐 Authenticated: ${authCount} pages
- 👑 Admin: ${adminCount} pages

**Page Access:**

${pages.map((p) => {
  const access = pageAccess.find((pa) => pa.pageId === p.id);
  const accessBadges = [];
  if (access?.anon) accessBadges.push("🌐 Anon");
  if (access?.auth) accessBadges.push("🔐 Auth");
  if (access?.admin) accessBadges.push("👑 Admin");
  const accessText = accessBadges.length > 0 ? accessBadges.join(", ") : "None";
  return `- **${p.name}** (\`${p.route}\`) - ${accessText}`;
}).join("\n")}

`;
  }

  template += `## Getting Started

[AI_GETTING_STARTED]`;

  return template;
};

export const buildOverviewBatchPrompt = (
  title: string,
  description: string,
  authMethods: AuthMethods
): string => {
  const enabledAuthMethods = Object.entries(authMethods)
    .filter(([_, enabled]) => enabled)
    .map(([method]) => {
      const methodNames: Record<string, string> = {
        emailPassword: "Email & Password",
        magicLink: "Magic Link",
      };
      return methodNames[method] || method;
    });

  return `You are generating concise content for a README.

Context:
- App: ${title}
- Description: ${description}
- Auth Methods: ${enabledAuthMethods.join(", ")}

Generate TWO pieces of content:

1. **overview**: 2-3 paragraphs introducing the app
   - What the app does
   - Who it's for
   - Key value proposition
   - Keep it user-friendly (NOT technical)

2. **gettingStarted**: 1-2 paragraphs on how to begin using the app
   - How to access the app
   - First steps for new users
   ${enabledAuthMethods.length > 0 ? "- How to create an account\n   " : ""}- What to do after signing in

Keep it CONCISE and USER-FOCUSED. No technical jargon or implementation details.

Return ONLY valid JSON:
{
  "overview": "2-3 paragraphs here",
  "gettingStarted": "1-2 paragraphs here"
}`;
};

