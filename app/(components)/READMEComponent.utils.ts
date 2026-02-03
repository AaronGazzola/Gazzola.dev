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

export const generateCompliancePages = (): {
  pages: PageInput[];
  pageAccess: PageAccess[];
} => {
  const pages: PageInput[] = [];
  const pageAccess: PageAccess[] = [];

  const termsPage: PageInput = {
    id: generateId(),
    name: "Terms and Conditions",
    route: "/terms",
    description:
      "Legal terms and conditions governing the use of the service, including user responsibilities, acceptable use policy, and liability disclaimers",
    layoutIds: [],
    isCompliancePage: true,
  };
  pages.push(termsPage);
  pageAccess.push({
    pageId: termsPage.id,
    anon: true,
    auth: true,
    admin: true,
  });

  const privacyPage: PageInput = {
    id: generateId(),
    name: "Privacy Policy",
    route: "/privacy",
    description:
      "Privacy policy detailing how user data is collected, used, stored, and protected, including information about cookies and third-party services",
    layoutIds: [],
    isCompliancePage: true,
  };
  pages.push(privacyPage);
  pageAccess.push({
    pageId: privacyPage.id,
    anon: true,
    auth: true,
    admin: true,
  });

  const aboutPage: PageInput = {
    id: generateId(),
    name: "About",
    route: "/about",
    description:
      "Information about the company or organization, mission statement, team information, and company history",
    layoutIds: [],
    isCompliancePage: true,
  };
  pages.push(aboutPage);
  pageAccess.push({
    pageId: aboutPage.id,
    anon: true,
    auth: true,
    admin: true,
  });

  const contactPage: PageInput = {
    id: generateId(),
    name: "Contact",
    route: "/contact",
    description:
      "Contact page with email form for inquiries and business contact details including address, phone number, and support email",
    layoutIds: [],
    isCompliancePage: true,
  };
  pages.push(contactPage);
  pageAccess.push({
    pageId: contactPage.id,
    anon: true,
    auth: true,
    admin: true,
  });

  return { pages, pageAccess };
};

export const generateAuthPages = (
  authMethods: AuthMethods
): { pages: PageInput[]; pageAccess: PageAccess[] } => {
  const pages: PageInput[] = [];
  const pageAccess: PageAccess[] = [];

  if (authMethods.emailPassword && !authMethods.magicLink) {
    const signUpPage: PageInput = {
      id: generateId(),
      name: "Sign Up",
      route: "/sign-up",
      description: "Where new users create an account with email and password",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(signUpPage);
    pageAccess.push({
      pageId: signUpPage.id,
      anon: true,
      auth: false,
      admin: false,
    });

    const signInPage: PageInput = {
      id: generateId(),
      name: "Sign In",
      route: "/sign-in",
      description: "Where existing users sign in with email and password",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(signInPage);
    pageAccess.push({
      pageId: signInPage.id,
      anon: true,
      auth: false,
      admin: false,
    });
  }

  if (authMethods.magicLink && !authMethods.emailPassword) {
    const signInPage: PageInput = {
      id: generateId(),
      name: "Sign In",
      route: "/sign-in",
      description:
        "Where users enter their email to receive a magic link for passwordless sign-in",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(signInPage);
    pageAccess.push({
      pageId: signInPage.id,
      anon: true,
      auth: false,
      admin: false,
    });
  }

  if (authMethods.magicLink && authMethods.emailPassword) {
    const signInPage: PageInput = {
      id: generateId(),
      name: "Sign In",
      route: "/sign-in",
      description:
        "Users can select between email only sign in to receive a magic link for passwordless sign-in, or email and password sign in",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(signInPage);
    pageAccess.push({
      pageId: signInPage.id,
      anon: true,
      auth: false,
      admin: false,
    });

    const signUpPage: PageInput = {
      id: generateId(),
      name: "Sign Up",
      route: "/sign-up",
      description:
        "Users can select between creating an account with email only via magic link sign up, or email and password sign up",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(signUpPage);
    pageAccess.push({
      pageId: signUpPage.id,
      anon: true,
      auth: false,
      admin: false,
    });
  }

  if (authMethods.emailPassword) {
    const forgotPasswordPage: PageInput = {
      id: generateId(),
      name: "Forgot Password",
      route: "/forgot-password",
      description: "Where users request a password reset link",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(forgotPasswordPage);
    pageAccess.push({
      pageId: forgotPasswordPage.id,
      anon: true,
      auth: false,
      admin: false,
    });

    const resetPasswordPage: PageInput = {
      id: generateId(),
      name: "Reset Password",
      route: "/reset-password",
      description:
        "Where users set a new password after clicking the reset link",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(resetPasswordPage);
    pageAccess.push({
      pageId: resetPasswordPage.id,
      anon: true,
      auth: false,
      admin: false,
    });
  }

  if (authMethods.emailPassword || authMethods.magicLink) {
    const verifyPage: PageInput = {
      id: generateId(),
      name: "Verify Email",
      route: "/verify",
      description:
        "Email verification page that displays a message informing users to check their inbox and click the verification link to complete their account setup and sign in.",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(verifyPage);
    pageAccess.push({
      pageId: verifyPage.id,
      anon: true,
      auth: false,
      admin: false,
    });

    const welcomePage: PageInput = {
      id: generateId(),
      name: "Welcome",
      route: "/welcome",
      description:
        "First-time user profile setup after initial sign in. All relevant profile data is collected",
      layoutIds: [],
      isAuthRequired: true,
    };
    pages.push(welcomePage);
    pageAccess.push({
      pageId: welcomePage.id,
      anon: false,
      auth: true,
      admin: true,
    });
  }

  return { pages, pageAccess };
};

export const generatePagesPrompt = (
  title: string,
  description: string,
  authMethods: AuthMethods
): string => {
  const authPagesInfo: string[] = [];

  if (authMethods.emailPassword && !authMethods.magicLink) {
    authPagesInfo.push(
      "- Sign Up (/sign-up)",
      "- Sign In (/sign-in)",
      "- Forgot Password (/forgot-password)",
      "- Reset Password (/reset-password)",
      "- Verify Email (/verify)",
      "- Welcome (/welcome)"
    );
  } else if (authMethods.magicLink && !authMethods.emailPassword) {
    authPagesInfo.push(
      "- Sign In (/sign-in)",
      "- Verify Email (/verify)",
      "- Welcome (/welcome)"
    );
  } else if (authMethods.magicLink && authMethods.emailPassword) {
    authPagesInfo.push(
      "- Sign In (/sign-in)",
      "- Sign Up (/sign-up)",
      "- Forgot Password (/forgot-password)",
      "- Reset Password (/reset-password)",
      "- Verify Email (/verify)",
      "- Welcome (/welcome)"
    );
  }

  const authPagesSection =
    authPagesInfo.length > 0
      ? `\n\nIMPORTANT: The following authentication pages will be automatically included (DO NOT generate these):\n${authPagesInfo.join("\n")}\n\nFocus ONLY on generating app-specific pages needed for the core functionality.`
      : "";

  return `You must return ONLY a valid JSON object. Do not include any explanations, markdown formatting, or code blocks. Your response must start with { and end with }.

App Title: ${title}
App Description: ${description}${authPagesSection}

Generate app-specific pages AND appropriate layouts for this web application based on the description above.

LAYOUTS:
Layouts are reusable UI wrappers that provide shared elements (headers, sidebars, footers, navigation) for groups of pages.

Generate >=1 layouts based on these guidelines:
- ALWAYS include a "Main Layout" configured appropriately for the app type
- Include an "Admin Layout" only if the app description mentions admin features, admin panel, or content moderation

For each layout, provide:
- name: Layout name (must be exactly "Main Layout" or "Admin Layout")
- options: Configuration object specifying which UI elements to include:
  * header.enabled: true/false - Include a header bar
  * header.title: true/false - Include app title linking to home (only if header.enabled)
  * header.navigationItems: true/false - Include nav items on large screens (only if header.enabled)
  * header.profileAvatarPopover: true/false - Include profile avatar with popover menu (sign out, profile, settings) for auth/admin users; shows "sign in" link for anon (only if header.enabled)
  * header.sticky: true/false - Header stays at top on scroll (only if header.enabled)
  * header.sidebarToggleButton: true/false - Include button to toggle sidebar visibility (only if header.enabled AND leftSidebar.enabled)
  * leftSidebar.enabled: true/false - Include left sidebar (recommend true for dashboards, admin panels; false for simple sites)
  * leftSidebar.title: true/false - Include app title linking to home (only if leftSidebar.enabled)
  * leftSidebar.navigationItems: true/false - Include nav items (only if leftSidebar.enabled)
  * leftSidebar.profileAvatarPopover: true/false - Include profile avatar with popover menu (only if leftSidebar.enabled)
  * rightSidebar.enabled: true/false - Include right sidebar (typically false unless app needs secondary navigation)
  * rightSidebar.title: true/false - Include app title linking to home (only if rightSidebar.enabled)
  * rightSidebar.navigationItems: true/false - Include nav items (only if rightSidebar.enabled)
  * rightSidebar.profileAvatarPopover: true/false - Include profile avatar with popover menu (only if rightSidebar.enabled)
  * footer.enabled: true/false - Include footer
  * footer.title: true/false - Include app title linking to home (only if footer.enabled)
  * footer.allNavItems: true/false - Include all navigation items (only if footer.enabled)
  * footer.legalNavItems: true/false - Include legal links like terms, privacy, contact, about (only if footer.enabled)

PAGES:
Consider:
- What pages would users need to accomplish the app's goals?
- What are the main user flows described?
- Common web app patterns (home, dashboard, profile, settings, etc.)
- Next.js routing conventions (/, /about, /[id], /[slug], etc.)
- Which pages should be anon (anonymous), auth (authenticated), or admin-only
- Include an Admin page (/admin) only if admin features are mentioned in the description
- Which layout(s) should wrap each page
- Generate as many pages as needed to fully support the app's functionality (typically 5-15 app-specific pages)

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
      "options": {
        "header": {
          "enabled": true,
          "title": true,
          "navigationItems": true,
          "profileAvatarPopover": true,
          "sticky": false,
          "sidebarToggleButton": false
        },
        "leftSidebar": {
          "enabled": false,
          "title": false,
          "navigationItems": false,
          "profileAvatarPopover": false
        },
        "rightSidebar": {
          "enabled": false,
          "title": false,
          "navigationItems": false,
          "profileAvatarPopover": false
        },
        "footer": {
          "enabled": true,
          "title": true,
          "allNavItems": false,
          "legalNavItems": true
        }
      }
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
- Generate 5-15 app-specific pages based on the app's needs (authentication pages are handled separately)
- Generate >=1 layouts (Main Layout always required, Admin Layout only if admin features exist)
- Each layout must have properly configured options matching the app type:
  * Simple sites/blogs: header with title + nav + profile, footer with legal links, NO sidebars
  * Dashboards/admin: header (possibly sticky) with title + profile + sidebar toggle, left sidebar with nav + profile, footer optional
  * Content management: similar to dashboards, consider right sidebar if needed
- Only enable secondary options when primary is enabled (e.g., header.title only if header.enabled)
- header.sidebarToggleButton only if both header.enabled AND leftSidebar.enabled
- Include at least a home page (/)
- DO NOT generate authentication pages (sign-in, sign-up, verify, welcome, forgot-password, reset-password) - these are automatically included
- Include an Admin page (/admin) ONLY if admin features are mentioned
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
    .filter((l) => l.name && l.options)
    .map((l) => ({
      id: generateId(),
      name: l.name,
      options: l.options,
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

  const formatLayoutOptions = (layout: LayoutInput): string => {
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

  const layoutsSection =
    layouts.length > 0
      ? `

LAYOUTS:
${layouts.map((l) => `- ${l.name}: ${formatLayoutOptions(l)}`).join("\\n")}

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
