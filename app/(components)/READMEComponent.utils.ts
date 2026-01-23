import { extractJsonFromResponse } from "@/lib/ai-response.utils";
import { LOG_LABELS } from "@/lib/log.util";
import {
  AuthMethods,
  generateId,
  LayoutInput,
  PageAccess,
  PageGenerationAIResponse,
  PageInput,
} from "./READMEComponent.types";

export const generatePagesPrompt = (
  title: string,
  description: string,
  authMethods: AuthMethods
): string => {
  const authPagesNeeded: string[] = [];

  if (authMethods.emailPassword) {
    authPagesNeeded.push(
      "- Forgot Password page (/forgot-password) - Anon access - Where users request a password reset link"
    );
    authPagesNeeded.push(
      "- Reset Password page (/reset-password) - Anon access - Where users set a new password after clicking the reset link"
    );
  }
  if (authMethods.emailPassword && !authMethods.magicLink) {
    authPagesNeeded.push(
      "- Sign Up page (/sign-up) - Anon access - Where new users create an account with email and password"
    );
    authPagesNeeded.push(
      "- Sign In page (/sign-in) - Anon access - Where existing users sign in with email and password"
    );
  }
  if (authMethods.magicLink && !authMethods.emailPassword) {
    authPagesNeeded.push(
      "- Sign in page (/sign-in) - Anon access - Where users enter their email to receive a magic link for passwordless sign-in"
    );
  }
  if (authMethods.magicLink && authMethods.emailPassword) {
    authPagesNeeded.push(
      "- Sign in page (/sign-in) - Anon access - Users can select between email only sign in to receive a magic link for passwordless sign-in, or email and password sign in"
    );
    authPagesNeeded.push(
      "- Sign Up page (/sign-up) - Anon access - Users can select between creating an account with email only via magic link sign up, or email and password sign up"
    );
  }
  if (authMethods.emailPassword || authMethods.magicLink) {
    authPagesNeeded.push(
      "- Welcome page (/welcome) - Auth and admin access - First-time user profile setup after initial sign in. All relevant profile data is collected"
    );
  }

  const authPagesSection =
    authPagesNeeded.length > 0
      ? `\n\nAuthentication pages required based on selected auth methods:\n${authPagesNeeded.join("\n")}\nINCLUDE ALL these authentication pages in your response.`
      : "";

  return `You must return ONLY a valid JSON object. Do not include any explanations, markdown formatting, or code blocks. Your response must start with { and end with }.

App Title: ${title}
App Description: ${description}${authPagesSection}

Generate >=3 relevant pages AND appropriate layouts for this web application based on the description above.

LAYOUTS:
Layouts are reusable UI wrappers that provide shared elements (headers, sidebars, footers, navigation) for groups of pages.

Generate >=1 layouts based on these guidelines:
- ALWAYS include a "Main Layout" with:
  * Header containing the site name (${title})
  * A "Sign in" nav button for anon users, replaced with an authentication popover menu for auth and admin users, which contains a sign out button and other relevant buttons such as settings and/or profile nav buttons if appropriate  
  * Only include a sidebar if it makes sense for the app's UI (e.g., dashboards, content management apps benefit from sidebars; simple sites/blogs do not)
  * Footer (optional)
- Include an "Admin Layout" only if the app description mentions admin features, admin panel, or content moderation:
  * Admin-specific header with admin navigation
  * Admin sidebar with management tools
  * Should wrap any admin pages

For each layout, provide:
- name: Layout name (must be exactly "Main Layout" or "Admin Layout")
- description: What shared UI elements this layout provides (20-100 words), be specific about whether it includes a sidebar

PAGES:
Consider:
- What pages would users need to accomplish the app's goals?
- What are the main user flows described?
- Common web app patterns (home, dashboard, profile, settings, etc.)
- Authentication pages needed based on the auth methods above
- Next.js routing conventions (/, /about, /[id], /[slug], etc.)
- Which pages should be anon (anonymous), auth (authenticated), or admin-only
- Include an Admin page (/admin) only if admin features are mentioned in the description
- Which layout(s) should wrap each page

For each page, provide:
- name: User-friendly page name (e.g., "Home", "Dashboard", "User Profile")
- route: Next.js route path (e.g., "/", "/dashboard", "/profile/[id]")
- description: Brief description of what users do on this page (30-100 words)
- access: Who can access this page
- layoutNames: Array of layout names that should wrap this page (e.g., ["Main Layout"])

REQUIRED JSON FORMAT (return exactly this structure):
{
  "layouts": [
    {
      "name": "Main Layout",
      "description": "Primary layout with header (site name + auth button), optional sidebar for navigation, and footer for all pages"
    }
  ],
  "pages": [
    {
      "name": "Home",
      "route": "/",
      "description": "Landing page where users first arrive...",
      "access": {
        "anon": true,
        "auth": false,
        "admin": false
      },
      "layoutNames": ["Main Layout"]
    }
  ]
}

CRITICAL RULES:
- Generate >=3 pages (app pages + auth pages)
- Generate >=1 layouts (Main Layout always required, Admin Layout only if admin features exist)
- Main Layout must mention header with site name and auth button
- Main Layout should only include sidebar if it makes sense for the app type
- Include at least a home page (/)
- Include ALL authentication pages listed above
- Include an Admin page (/admin) ONLY if admin features are mentioned
- All authentication pages should have anon access
- Admin pages should have admin access and use "Admin Layout"
- Routes must follow Next.js conventions
- Descriptions should be specific to this app, not generic
- For access levels:
  - anon=true means anyone can access (no login required)
  - auth=true means authenticated users can access
  - admin=true means only admins can access
  - Multiple access levels can be true simultaneously (e.g., both anon and auth)
- Layout assignment guidelines:
  - All public/auth/user pages → "Main Layout"
  - Admin pages → "Admin Layout" (admin layout must exist if you create admin pages)

IMPORTANT: Return ONLY the JSON object. No additional text before or after.`;
};

export const parsePagesFromResponse = (
  response: string
): {
  layouts: LayoutInput[];
  pages: PageInput[];
  pageAccess: PageAccess[];
} | null => {
  console.log("📄 parsePagesFromResponse - Starting to parse response");
  console.log("📄 Raw response:", response);

  const parsed = extractJsonFromResponse<PageGenerationAIResponse>(
    response,
    LOG_LABELS.README
  );

  console.log("📄 Parsed result:", parsed);

  if (!parsed || !parsed.pages || !Array.isArray(parsed.pages)) {
    console.error("❌ Invalid parsed result - missing pages array");
    console.error("❌ Parsed:", parsed);
    return null;
  }

  console.log("✅ Found pages array with", parsed.pages.length, "pages");

  const layouts: LayoutInput[] = (parsed.layouts || [])
    .filter((l) => l.name && l.description)
    .map((l) => ({
      id: generateId(),
      name: l.name,
      description: l.description,
    }));

  console.log("📄 Processed layouts:", layouts);

  const layoutNameToIdMap = layouts.reduce(
    (map, layout) => {
      map[layout.name] = layout.id;
      return map;
    },
    {} as Record<string, string>
  );

  const pages = parsed.pages
    .filter((p) => p.name && p.route)
    .map((p) => {
      const layoutIds = (p.layoutNames || [])
        .map((layoutName) => layoutNameToIdMap[layoutName])
        .filter(Boolean);

      return {
        id: generateId(),
        name: p.name,
        route: p.route,
        description: p.description || "",
        layoutIds,
      };
    });

  console.log("📄 Processed pages:", pages);

  const pageAccess = parsed.pages
    .filter((p) => p.name && p.route && p.access)
    .map((p, index) => ({
      pageId: pages[index].id,
      anon: p.access.anon,
      auth: p.access.auth,
      admin: p.access.admin,
    }));

  console.log("📄 Processed pageAccess:", pageAccess);

  return { layouts, pages, pageAccess };
};

export const generateFinalReadmePrompt = (
  title: string,
  description: string,
  layouts: LayoutInput[],
  pages: PageInput[],
  authMethods: AuthMethods,
  pageAccess: PageAccess[]
): string => {
  const pagesSection = pages
    .map((p) => {
      const access = pageAccess.find((pa) => pa.pageId === p.id);
      const accessLevels = [];
      if (access?.anon) accessLevels.push("Anon");
      if (access?.auth) accessLevels.push("Auth");
      if (access?.admin) accessLevels.push("Admin");
      const accessText =
        accessLevels.length > 0 ? ` (${accessLevels.join(", ")})` : "";

      return `### ${p.name} (\`${p.route}\`)${accessText}\\n\\n${p.description}`;
    })
    .join("\\n\\n");

  const enabledAuthMethods = Object.entries(authMethods)
    .filter(([_, enabled]) => enabled)
    .map(([method]) => {
      const methodNames: Record<string, string> = {
        emailPassword: "Email & Password",
        emailVerification: "Email Verification",
        forgotPassword: "Forgot Password",
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

  const authSection =
    enabledAuthMethods.length > 0
      ? `## Authentication & Access Control

${title} implements secure authentication with the following methods:

${enabledAuthMethods.map((method) => `- ${method}`).join("\\n")}

### Access Levels

The application enforces role-based access control across different pages:

${
  anonPages.length > 0
    ? `**Anonymous Access** (no authentication required):
${anonPages.map((p) => `- ${p.name} (${p.route})`).join("\\n")}
`
    : ""
}
${
  authPages.length > 0
    ? `**Authenticated Users**:
${authPages.map((p) => `- ${p.name} (${p.route})`).join("\\n")}
`
    : ""
}
${
  adminPages.length > 0
    ? `**Admin Only**:
${adminPages.map((p) => `- ${p.name} (${p.route})`).join("\\n")}
`
    : ""
}`
      : "";

  const layoutsSection =
    layouts.length > 0
      ? `

LAYOUTS:
${layouts.map((l) => `- ${l.name}: ${l.description}`).join("\\n")}

PAGE-TO-LAYOUT MAPPINGS:
${
  pages
    .filter((p) => p.layoutIds.length > 0)
    .map((p) => {
      const pageLayouts = p.layoutIds
        .map((layoutId) => {
          const layout = layouts.find((l) => l.id === layoutId);
          return layout ? layout.name : null;
        })
        .filter(Boolean);
      return pageLayouts.length > 0
        ? `- ${p.name} (${p.route}): ${pageLayouts.join(", ")}`
        : null;
    })
    .filter(Boolean)
    .join("\\n") || "None"
}
`
      : "";

  return `Generate a detailed, professional README.md for this web application based on the following information:

APP TITLE: ${title}

APP DESCRIPTION: ${description}${layoutsSection}

PAGES:
${pages
  .map((p) => {
    const access = pageAccess.find((pa) => pa.pageId === p.id);
    const accessLevels = [];
    if (access?.anon) accessLevels.push("Anon");
    if (access?.auth) accessLevels.push("Auth");
    if (access?.admin) accessLevels.push("Admin");
    const pageLayouts = p.layoutIds
      .map((layoutId) => {
        const layout = layouts.find((l) => l.id === layoutId);
        return layout ? layout.name : null;
      })
      .filter(Boolean);
    const layoutText =
      pageLayouts.length > 0 ? ` {Layouts: ${pageLayouts.join(", ")}}` : "";
    return (
      "- " +
      p.name +
      " (" +
      p.route +
      ") [" +
      accessLevels.join(", ") +
      "]" +
      layoutText +
      ": " +
      p.description
    );
  })
  .join("\\n")}

AUTHENTICATION METHODS:
${enabledAuthMethods.length > 0 ? enabledAuthMethods.join(", ") : "None - public app"}

ANONYMOUS PAGES (no login required):
${anonPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

AUTHENTICATED USER PAGES:
${authPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

ADMIN-ONLY PAGES:
${adminPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

---

Generate a comprehensive README with the following structure:

# ${title}

[App title as H1]

## Overview

[2-3 paragraphs describing what the app does, who it's for, and key value proposition. Include the main description provided above and expand on it.]${layouts.length > 0 ? "\n\n## Layouts\n\n[For EACH layout listed in LAYOUTS above, create a section describing:]\n- The layout's name and purpose\n- What shared UI elements it provides (header, sidebar, footer, etc.)\n- Which pages use this layout (reference PAGE-TO-LAYOUT MAPPINGS above)\n- How it enhances the user experience" : ""}

## Pages

[For EACH page listed above, create a detailed section with:]
- Page name and route as H3 header
- Access level in parentheses (Anon, Auth, Admin, or combinations)${layouts.length > 0 ? "\n- Layouts applied to this page (if any)" : ""}
- 2-3 paragraphs describing:
  - What users see on this page
  - What actions they can take
  - Key features and functionality
  - How it fits into the overall user flow

${authSection ? "## Authentication & Access Control\n\n[Describe the authentication system with the following structure:]\n\n[Write 1-2 paragraphs introducing the authentication system and listing ALL authentication methods from AUTHENTICATION METHODS above. Explain each method briefly in user-friendly terms.]\n\n### Access Levels\n\n[Explain the access control model in 1 paragraph, then list pages grouped by access level:]\n\n**Anonymous Access** (no authentication required):\n[List all pages from ANONYMOUS PAGES section above with format: - Page Name (route)]\n\n**Authenticated Users**:\n[List all pages from AUTHENTICATED USER PAGES section above with format: - Page Name (route)]\n\n**Admin Only**:\n[List all pages from ADMIN-ONLY PAGES section above with format: - Page Name (route)]\n\nIMPORTANT: Include ALL authentication methods listed above. Include ALL pages in their correct access level groups.\n" : ""}

## User Experience

[Describe the typical user journey through the app:]
- How a new user first encounters the app
- Common workflows and navigation paths
- How different user roles interact with the system
- Key interaction patterns

## Getting Started

[Provide clear, friendly instructions for new users:]
- How to access the app
- First steps for new users
- How to create an account (if applicable)
- What to do after signing in

---

IMPORTANT REQUIREMENTS:
- Write in a friendly, professional tone for END USERS (not developers)
- Focus on WHAT users can DO, not HOW it's technically implemented
- Use clear, descriptive markdown formatting
- Include ALL pages with their access levels clearly marked in the header (Anon, Auth, Admin)${layouts.length > 0 ? "\n- Include ALL layouts with their descriptions and which pages use them" : ""}
- Include ALL authentication methods listed above - explain each one in user-friendly terms
- Make authentication and access control easy to understand
- DO NOT include technical implementation details (no Next.js, React, API endpoints, database schemas)
- DO NOT include developer installation or deployment instructions
- Write 600-900 words total
- Use proper markdown headers (##, ###) for structure
- Maintain all specific details provided (limits, numbers, features) - don't drop or generalize them`;
};
