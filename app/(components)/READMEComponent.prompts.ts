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

export const buildReadmePlan = (
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

  const anonPages = pages.filter((p) => {
    const access = pageAccess.find((pa) => pa.pageId === p.id);
    return access?.anon;
  });

  const authPages = pages.filter((p) => {
    const access = pageAccess.find((pa) => pa.pageId === p.id);
    return access?.auth && !access?.anon;
  });

  const adminPages = pages.filter((p) => {
    const access = pageAccess.find((pa) => pa.pageId === p.id);
    return access?.admin;
  });

  let plan = `# README STRUCTURE PLAN

## Section 1: Title and Overview

Title: ${title}

Overview Content:
- Write 2-3 paragraphs describing what the app does, who it's for, and the key value proposition
- Base the content on this description: ${description}
- Keep it user-friendly and focused on benefits, not technical details
`;

  if (layouts.length > 0) {
    plan += `\n## Section 2: Layouts

This section describes the shared UI wrappers that provide consistent elements across pages.

`;
    layouts.forEach((layout, i) => {
      const pagesUsingLayout = pages.filter((p) =>
        p.layoutIds.includes(layout.id)
      );
      plan += `### Layout ${i + 1}: ${layout.name}

Components: ${formatLayoutOptions(layout)}

Pages using this layout:
${pagesUsingLayout.map((p) => `- ${p.name} (${p.route})`).join("\n") || "- None"}

Content to write:
- Explain the purpose of this layout based on the components above
- Describe the shared UI elements it provides
- Mention how it enhances the user experience for the pages that use it

`;
    });
  }

  plan += `\n## Section ${layouts.length > 0 ? "3" : "2"}: Pages

This section describes each page in the application.

`;

  pages.forEach((page, i) => {
    const access = pageAccess.find((pa) => pa.pageId === page.id);
    const accessLevels = [];
    if (access?.anon) accessLevels.push("Anon");
    if (access?.auth) accessLevels.push("Auth");
    if (access?.admin) accessLevels.push("Admin");
    const accessText =
      accessLevels.length > 0 ? accessLevels.join(", ") : "None";

    const pageLayouts = page.layoutIds
      .map((layoutId) => {
        const layout = layouts.find((l) => l.id === layoutId);
        return layout ? layout.name : null;
      })
      .filter(Boolean);

    plan += `### Page ${i + 1}: ${page.name} (\`${page.route}\`) [${accessText}]

`;
    if (pageLayouts.length > 0) {
      plan += `Layouts: ${pageLayouts.join(", ")}

`;
    }
    plan += `Description: ${page.description}

Content to write:
- Write 2-3 paragraphs expanding on the description above
- Describe what users see and what actions they can take
- Explain how this page fits into the overall user flow
- Keep the focus on user benefits and functionality
- DO NOT change the page name, route, or access levels

`;
  });

  if (enabledAuthMethods.length > 0) {
    plan += `\n## Section ${layouts.length > 0 ? "4" : "3"}: Authentication & Access Control

Authentication Methods:
${enabledAuthMethods.map((m) => `- ${m}`).join("\n")}

Content to write:
- Write 1-2 paragraphs introducing the authentication system
- Explain each authentication method in user-friendly terms
- Describe the access control model

Access Levels:

**Anonymous Access** (${anonPages.length} pages):
${anonPages.map((p) => `- ${p.name} (${p.route})`).join("\n") || "None"}

**Authenticated Users** (${authPages.length} pages):
${authPages.map((p) => `- ${p.name} (${p.route})`).join("\n") || "None"}

**Admin Only** (${adminPages.length} pages):
${adminPages.map((p) => `- ${p.name} (${p.route})`).join("\n") || "None"}

`;
  }

  const sectionNum = layouts.length > 0
    ? (enabledAuthMethods.length > 0 ? "5" : "4")
    : (enabledAuthMethods.length > 0 ? "4" : "3");

  plan += `\n## Section ${sectionNum}: User Experience

Content to write:
- Write 2-3 paragraphs describing typical user journeys
- Explain how new users first encounter the app
- Describe common workflows and navigation paths
- Explain how different user roles interact with the system

`;

  const finalSectionNum = layouts.length > 0
    ? (enabledAuthMethods.length > 0 ? "6" : "5")
    : (enabledAuthMethods.length > 0 ? "5" : "4");

  plan += `## Section ${finalSectionNum}: Getting Started

Content to write:
- Provide clear, friendly instructions for new users
- Explain how to access the app
- Describe first steps for new users
${enabledAuthMethods.length > 0 ? "- Explain how to create an account\n" : ""}- Explain what to do after signing in (if applicable)
`;

  return plan;
};

export const buildReadmeFromPlanPrompt = (
  plan: string,
  title: string,
  layouts: LayoutInput[],
  pages: PageInput[]
): string => {
  const layoutCount = layouts.length;
  const pageCount = pages.length;

  return `Generate a complete README.md markdown document based on the structured plan provided below.

# PLAN TO FOLLOW

${plan}

# STRICT REQUIREMENTS

🚨 CRITICAL: You MUST follow the plan structure EXACTLY:

1. **Page Names, Routes, and Access Levels are FIXED**
   - Use the EXACT page name as specified (e.g., "Sign In", "Dashboard")
   - Use the EXACT route as specified (e.g., \`/sign-in\`, \`/dashboard\`)
   - Use the EXACT access levels as specified (e.g., [Anon], [Auth], [Admin])
   - DO NOT add pages that aren't in the plan
   - DO NOT remove pages that are in the plan
   - DO NOT change page names, routes, or access levels

2. **Layout Names are FIXED**
   - Use the EXACT layout names as specified
   - DO NOT add or remove layouts
   - DO NOT change layout names

3. **Section Structure is FIXED**
   - Follow the exact section order from the plan
   - Include all sections mentioned in the plan
   - Use the section numbers and titles as specified

4. **What You CAN Embellish**
   - Expand on page descriptions with 2-3 paragraphs of user-friendly content
   - Add reasonable details about what users see and do
   - Describe user workflows and interaction patterns
   - Explain how features benefit users
   - Write engaging, clear prose for end users

5. **What You CANNOT Do**
   - Add technical implementation details (no API endpoints, database schemas, code)
   - Add developer setup or deployment instructions
   - Invent pages, layouts, or features not in the plan
   - Change the fundamental structure or required elements

# FORMATTING REQUIREMENTS

- Use proper markdown headers (##, ###)
- Write in friendly, professional tone for END USERS (not developers)
- Focus on WHAT users can DO and WHY it's useful
- Target 600-900 words total
- Each page section should have 2-3 paragraphs

# CONTENT COMPLETENESS

✅ YOU MUST INCLUDE:
- Title (H1): ${title}
- Overview section (2-3 paragraphs)
${layouts.length > 0 ? `- Layouts section with ALL ${layoutCount} layouts\n` : ''}- Pages section with ALL ${pageCount} pages
- Each page with its exact name, route, and access level
- Authentication & Access Control (if in plan)
- User Experience section
- Getting Started section

❌ DO NOT:
- Use shortcuts like "[Similar for other pages...]"
- Stop early or omit any sections
- Add pages or layouts not in the plan
- Change names, routes, or access levels

# OUTPUT FORMAT

Return ONLY the markdown README content.
Start with: # ${title}
End with the Getting Started section.

Complete ALL ${pageCount} pages and ALL ${layoutCount} layouts in ONE response.`;
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
[AI_PAGE_${page.id}]

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

**Access Level Summary:**

| Access Level | Page Count |
|-------------|-------|
| 🌐 Anonymous | ${anonCount} pages |
| 🔐 Authenticated | ${authCount} pages |
| 👑 Admin | ${adminCount} pages |

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

export const buildPagesBatchPrompt = (
  title: string,
  description: string,
  batchPages: Array<{
    id: string;
    name: string;
    route: string;
    description: string;
    access: { anon: boolean; auth: boolean; admin: boolean };
  }>
): string => {
  const pagesContext = batchPages
    .map((p, i) => {
      const accessLevels = [];
      if (p.access.anon) accessLevels.push("Anon");
      if (p.access.auth) accessLevels.push("Auth");
      if (p.access.admin) accessLevels.push("Admin");
      return `${i + 1}. **${p.name}** (\`${p.route}\`) [${accessLevels.join(", ")}]
   Description: ${p.description}
   Key: page_${p.id}`;
    })
    .join("\n\n");

  return `You are generating concise page descriptions for a README.

Context:
- App: ${title}
- Description: ${description}

Generate 1-2 SHORT paragraphs for each page below:
- First paragraph: What users see and primary actions (2-3 sentences)
- Second paragraph (optional): How it fits in the user flow (1-2 sentences)

Keep it CONCISE and USER-FOCUSED. No technical details.

Pages to describe:
${pagesContext}

Return ONLY valid JSON with keys matching the "Key" field above:
{
  "page_${batchPages[0].id}": "1-2 paragraphs here",
  "page_${batchPages[1]?.id || "example"}": "1-2 paragraphs here"
}`;
};
