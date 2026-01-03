import { extractJsonFromResponse } from "@/lib/ai-response.utils";
import { LOG_LABELS } from "@/lib/log.util";
import {
  AuthMethods,
  generateId,
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
    authPagesNeeded.push("- Sign Up page (/sign-up) - Public access - Where new users create an account with email and password");
    authPagesNeeded.push("- Sign In page (/sign-in) - Public access - Where existing users sign in with email and password");
    authPagesNeeded.push("- Forgot Password page (/forgot-password) - Public access - Where users request a password reset link");
    authPagesNeeded.push("- Reset Password page (/reset-password) - Public access - Where users set a new password after clicking the reset link");
  } else if (authMethods.magicLink) {
    authPagesNeeded.push("- Welcome page (/welcome) - Public access - Where users enter their email to receive a magic link for passwordless sign-in");
  }

  const authPagesSection = authPagesNeeded.length > 0
    ? `\n\nAuthentication pages required based on selected auth methods:\n${authPagesNeeded.join("\n")}\nINCLUDE ALL these authentication pages in your response.`
    : "";

  return `You must return ONLY a valid JSON object. Do not include any explanations, markdown formatting, or code blocks. Your response must start with { and end with }.

App Title: ${title}
App Description: ${description}${authPagesSection}

Generate 3-8 relevant pages for this web application based on the description above.

Consider:
- What pages would users need to accomplish the app's goals?
- What are the main user flows described?
- Common web app patterns (home, dashboard, profile, settings, etc.)
- Authentication pages needed based on the auth methods above
- Next.js routing conventions (/, /about, /[id], /[slug], etc.)
- Which pages should be public, user-only, or admin-only

For each page, provide:
- name: User-friendly page name (e.g., "Home", "Dashboard", "User Profile")
- route: Next.js route path (e.g., "/", "/dashboard", "/profile/[id]")
- description: Brief description of what users do on this page (30-80 words)
- access: Who can access this page

REQUIRED JSON FORMAT (return exactly this structure):
{
  "pages": [
    {
      "name": "Home",
      "route": "/",
      "description": "Landing page where users first arrive...",
      "access": {
        "public": true,
        "user": false,
        "admin": false
      }
    }
  ]
}

CRITICAL RULES:
- Generate 3-8 pages total (app pages + auth pages)
- Simple apps (blogs, landing pages) = 3-4 non-auth pages
- Complex apps (SaaS, platforms) = 5-6 non-auth pages
- Include at least a home page (/)
- Include ALL authentication pages listed above if any
- All authentication pages should have public access
- Routes must follow Next.js conventions
- Descriptions should be specific to this app, not generic
- For access levels:
  - public=true means anyone can access (no login required)
  - user=true means authenticated users can access
  - admin=true means only admins can access
  - If public=true, user and admin should be false
  - user and admin can both be true if both groups can access

IMPORTANT: Return ONLY the JSON object. No additional text before or after.`;
};

export const parsePagesFromResponse = (
  response: string
): { pages: PageInput[]; pageAccess: PageAccess[] } | null => {
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

  const pages = parsed.pages
    .filter((p) => p.name && p.route)
    .map((p) => ({
      id: generateId(),
      name: p.name,
      route: p.route,
      description: p.description || "",
    }));

  console.log("📄 Processed pages:", pages);

  const pageAccess = parsed.pages
    .filter((p) => p.name && p.route && p.access)
    .map((p, index) => ({
      pageId: pages[index].id,
      public: p.access.public,
      user: p.access.user,
      admin: p.access.admin,
    }));

  console.log("📄 Processed pageAccess:", pageAccess);

  return { pages, pageAccess };
};

export const generateFinalReadmePrompt = (
  title: string,
  description: string,
  pages: PageInput[],
  authMethods: AuthMethods,
  pageAccess: PageAccess[]
): string => {
  const pagesSection = pages
    .map((p) => {
      const access = pageAccess.find((pa) => pa.pageId === p.id);
      const accessLevels = [];
      if (access?.public) accessLevels.push("Public");
      if (access?.user) accessLevels.push("User");
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

  const publicPages = pages.filter((p) => {
    const access = pageAccess.find((pa) => pa.pageId === p.id);
    return access?.public;
  });

  const userPages = pages.filter((p) => {
    const access = pageAccess.find((pa) => pa.pageId === p.id);
    return access?.user && !access?.public;
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
  publicPages.length > 0
    ? `**Public Access** (no authentication required):
${publicPages.map((p) => `- ${p.name} (${p.route})`).join("\\n")}
`
    : ""
}
${
  userPages.length > 0
    ? `**Authenticated Users**:
${userPages.map((p) => `- ${p.name} (${p.route})`).join("\\n")}
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

  return `Generate a detailed, professional README.md for this web application based on the following information:

APP TITLE: ${title}

APP DESCRIPTION: ${description}

PAGES:
${pages
  .map((p) => {
    const access = pageAccess.find((pa) => pa.pageId === p.id);
    const accessLevels = [];
    if (access?.public) accessLevels.push("Public");
    if (access?.user) accessLevels.push("User");
    if (access?.admin) accessLevels.push("Admin");
    return (
      "- " +
      p.name +
      " (" +
      p.route +
      ") [" +
      accessLevels.join(", ") +
      "]: " +
      p.description
    );
  })
  .join("\\n")}

AUTHENTICATION METHODS:
${enabledAuthMethods.length > 0 ? enabledAuthMethods.join(", ") : "None - public app"}

PUBLIC PAGES (no login required):
${publicPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

AUTHENTICATED USER PAGES:
${userPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

ADMIN-ONLY PAGES:
${adminPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

---

Generate a comprehensive README with the following structure:

# ${title}

[App title as H1]

## Overview

[2-3 paragraphs describing what the app does, who it's for, and key value proposition. Include the main description provided above and expand on it.]

## Pages

[For EACH page listed above, create a detailed section with:]
- Page name and route as H3 header
- Access level in parentheses (Public, User, Admin, or combinations)
- 2-3 paragraphs describing:
  - What users see on this page
  - What actions they can take
  - Key features and functionality
  - How it fits into the overall user flow

${authSection ? "## Authentication & Access Control\n\n[Describe the authentication system with the following structure:]\n\n[Write 1-2 paragraphs introducing the authentication system and listing ALL authentication methods from AUTHENTICATION METHODS above. Explain each method briefly in user-friendly terms.]\n\n### Access Levels\n\n[Explain the access control model in 1 paragraph, then list pages grouped by access level:]\n\n**Public Access** (no authentication required):\n[List all pages from PUBLIC PAGES section above with format: - Page Name (route)]\n\n**Authenticated Users**:\n[List all pages from AUTHENTICATED USER PAGES section above with format: - Page Name (route)]\n\n**Admin Only**:\n[List all pages from ADMIN-ONLY PAGES section above with format: - Page Name (route)]\n\nIMPORTANT: Include ALL authentication methods listed above. Include ALL pages in their correct access level groups.\n" : ""}

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
- Include ALL pages with their access levels clearly marked in the header (Public, User, Admin)
- Include ALL authentication methods listed above - explain each one in user-friendly terms
- Make authentication and access control easy to understand
- DO NOT include technical implementation details (no Next.js, React, API endpoints, database schemas)
- DO NOT include developer installation or deployment instructions
- Write 600-900 words total
- Use proper markdown headers (##, ###) for structure
- Maintain all specific details provided (limits, numbers, features) - don't drop or generalize them`;
};
