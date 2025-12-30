import { extractJsonFromResponse } from "@/lib/ai-response.utils";
import { LOG_LABELS } from "@/lib/log.util";
import {
  generateId,
  PageGenerationAIResponse,
  PageInput,
  AuthGenerationAIResponse,
  DatabaseGenerationAIResponse,
  AuthMethods,
  PageAccess,
  DatabaseTable,
} from "./READMEComponent.types";

export const generatePagesPrompt = (
  title: string,
  description: string
): string => {
  return `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with { end with }

App Title: ${title}
App Description: ${description}

Analyze the app description and generate 3-6 relevant pages for this web application.

Consider:
- What pages would users need to accomplish the app's goals?
- What are the main user flows described?
- Common web app patterns (home, dashboard, profile, settings, etc.)
- Next.js routing conventions (/, /about, /[id], /[slug], etc.)

For each page, provide:
- name: User-friendly page name (e.g., "Home", "Dashboard", "User Profile")
- route: Next.js route path (e.g., "/", "/dashboard", "/profile/[id]")
- description: Brief description of what users do on this page (30-80 words)

JSON Format:
{
  "pages": [
    {
      "name": "Home",
      "route": "/",
      "description": "Landing page where users first arrive..."
    },
    {
      "name": "Dashboard",
      "route": "/dashboard",
      "description": "Main application interface where users..."
    }
  ]
}

Rules:
- Generate 3-6 pages based on app complexity
- Simple apps (blogs, landing pages) = 3-4 pages
- Complex apps (SaaS, platforms) = 5-6 pages
- Include at least a home page (/)
- Routes must follow Next.js conventions
- Descriptions should be specific to this app, not generic`;
};

export const parsePagesFromResponse = (response: string): PageInput[] | null => {
  const parsed = extractJsonFromResponse<PageGenerationAIResponse>(
    response,
    LOG_LABELS.README
  );

  if (!parsed || !parsed.pages || !Array.isArray(parsed.pages)) {
    return null;
  }

  return parsed.pages
    .filter(p => p.name && p.route)
    .map(p => ({
      id: generateId(),
      name: p.name,
      route: p.route,
      description: p.description || "",
    }));
};

export const generateAuthPrompt = (
  title: string,
  description: string,
  pages: PageInput[]
): string => {
  const pagesInfo = pages
    .map((p) => `- ID: ${p.id}, Name: ${p.name}, Route: ${p.route}, Description: ${p.description}`)
    .join("\\n");

  return `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with { end with }

App Title: ${title}
App Description: ${description}

Pages (with IDs):
${pagesInfo}

Based on the app description and pages, determine:
1. Which authentication methods would be appropriate for this app
2. What access level each page should have (public, user-authenticated, or admin-only)

Consider:
- Does the app need user accounts?
- Which pages should be accessible without login?
- Are there admin-only features?
- What auth methods fit the use case? (email/password, magic link, OAuth, etc.)

JSON Format:
{
  "authMethods": {
    "emailPassword": boolean,
    "magicLink": boolean,
    "phoneAuth": boolean,
    "otp": boolean,
    "googleAuth": boolean,
    "githubAuth": boolean,
    "appleAuth": boolean,
    "emailVerification": boolean,
    "mfa": boolean
  },
  "pageAccess": [
    {
      "pageId": "use-the-exact-ID-from-pages-above",
      "public": boolean,
      "user": boolean,
      "admin": boolean
    }
  ]
}

Rules:
- Set authMethods to true only if the app clearly needs that auth type
- For pageAccess, use the EXACT page IDs provided above
- Include a pageAccess entry for EVERY page
- public=true means anyone can access (no login required)
- user=true means authenticated users can access
- admin=true means only admins can access
- user and admin can both be true if both groups can access
- If public=true, user and admin should be false`;
};

export const parseAuthFromResponse = (
  response: string,
  pages: PageInput[]
): { authMethods: AuthMethods; pageAccess: PageAccess[] } | null => {
  const parsed = extractJsonFromResponse<AuthGenerationAIResponse>(
    response,
    LOG_LABELS.README
  );

  if (!parsed) return null;

  return {
    authMethods: parsed.authMethods,
    pageAccess: parsed.pageAccess.map((pa) => ({
      pageId: pa.pageId,
      public: pa.public,
      user: pa.user,
      admin: pa.admin,
    })),
  };
};

export const generateDatabasePrompt = (
  title: string,
  description: string,
  pages: PageInput[]
): string => {
  const pagesInfo = pages
    .map((p) => `- ${p.name} (${p.route}): ${p.description}`)
    .join("\\n");

  return `Return ONLY valid JSON. No explanations, no markdown, no code blocks. Start with { end with }

App Title: ${title}
App Description: ${description}

Pages:
${pagesInfo}

Based on the app description and pages, determine what database tables are needed.

Consider:
- What data needs to be stored?
- What are the main entities (users, posts, comments, etc.)?
- What relationships exist between entities?

For each table, provide a brief description of what it stores and its purpose.

JSON Format:
{
  "tables": [
    {
      "name": "users",
      "description": "Stores user account information including profile data, authentication credentials, and preferences"
    },
    {
      "name": "posts",
      "description": "Contains all user-created posts with content, metadata, and author references"
    }
  ]
}

Rules:
- Table names should be lowercase, plural, snake_case
- Provide 3-8 tables based on app complexity
- Descriptions should explain what data the table holds and its purpose (30-80 words)
- Consider core entities, relationships, and features described in pages`;
};

export const parseDatabaseFromResponse = (
  response: string
): DatabaseTable[] | null => {
  const parsed = extractJsonFromResponse<DatabaseGenerationAIResponse>(
    response,
    LOG_LABELS.README
  );

  if (!parsed || !parsed.tables || !Array.isArray(parsed.tables)) {
    return null;
  }

  return parsed.tables
    .filter((t) => t.name)
    .map((t) => ({
      id: generateId(),
      name: t.name,
      description: t.description || "",
    }));
};

export const generateFinalReadmePrompt = (
  title: string,
  description: string,
  pages: PageInput[],
  authMethods: AuthMethods,
  pageAccess: PageAccess[],
  databaseTables: DatabaseTable[]
): string => {
  const pagesSection = pages
    .map((p) => {
      const access = pageAccess.find((pa) => pa.pageId === p.id);
      const accessLevels = [];
      if (access?.public) accessLevels.push("Public");
      if (access?.user) accessLevels.push("User");
      if (access?.admin) accessLevels.push("Admin");
      const accessText = accessLevels.length > 0 ? ` (${accessLevels.join(", ")})` : "";

      return `### ${p.name} (\`${p.route}\`)${accessText}\\n\\n${p.description}`;
    })
    .join("\\n\\n");

  const enabledAuthMethods = Object.entries(authMethods)
    .filter(([_, enabled]) => enabled)
    .map(([method]) => {
      const methodNames: Record<string, string> = {
        emailPassword: "Email & Password",
        magicLink: "Magic Link",
        phoneAuth: "Phone/SMS",
        otp: "One-Time Password (OTP)",
        googleAuth: "Google OAuth",
        githubAuth: "GitHub OAuth",
        appleAuth: "Apple Sign In",
        emailVerification: "Email Verification",
        mfa: "Multi-Factor Authentication (MFA)",
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

  const authSection = enabledAuthMethods.length > 0
    ? `## Authentication & Access Control

${title} implements secure authentication with the following methods:

${enabledAuthMethods.map((method) => `- ${method}`).join("\\n")}

### Access Levels

The application enforces role-based access control across different pages:

${publicPages.length > 0 ? `**Public Access** (no authentication required):
${publicPages.map((p) => `- ${p.name} (${p.route})`).join("\\n")}
` : ""}
${userPages.length > 0 ? `**Authenticated Users**:
${userPages.map((p) => `- ${p.name} (${p.route})`).join("\\n")}
` : ""}
${adminPages.length > 0 ? `**Admin Only**:
${adminPages.map((p) => `- ${p.name} (${p.route})`).join("\\n")}
` : ""}`
    : "";

  const dbSection = databaseTables.length > 0
    ? `## Data & Storage

The application stores and manages the following data:

${databaseTables.map((t) => `### ${t.name}

${t.description}`).join("\\n\\n")}`
    : "";

  return `Generate a detailed, professional README.md for this web application based on the following information:

APP TITLE: ${title}

APP DESCRIPTION: ${description}

PAGES:
${pages.map((p) => {
  const access = pageAccess.find((pa) => pa.pageId === p.id);
  const accessLevels = [];
  if (access?.public) accessLevels.push("Public");
  if (access?.user) accessLevels.push("User");
  if (access?.admin) accessLevels.push("Admin");
  return "- " + p.name + " (" + p.route + ") [" + accessLevels.join(", ") + "]: " + p.description;
}).join("\\n")}

AUTHENTICATION METHODS:
${enabledAuthMethods.length > 0 ? enabledAuthMethods.join(", ") : "None - public app"}

PUBLIC PAGES (no login required):
${publicPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

AUTHENTICATED USER PAGES:
${userPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

ADMIN-ONLY PAGES:
${adminPages.map((p) => "- " + p.name + " (" + p.route + ")").join("\\n") || "None"}

DATABASE TABLES:
${databaseTables.map((t) => "- " + t.name + ": " + t.description).join("\\n") || "None"}

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

${dbSection ? "## Data & Storage\n\n[For EACH database table listed above, create a detailed section with:]\n- EXACT table name from DATABASE TABLES list as H3 header (### table_name)\n- 2-3 paragraphs explaining:\n  - What specific data this table stores (expand on the description provided)\n  - Why this data is needed for the application\n  - How users interact with or benefit from this data\n  - Keep it user-focused, not technical (no schema details, just what data means to users)\n\nIMPORTANT: Use the EXACT table names provided in DATABASE TABLES above. Create a separate ### subsection for each table.\n" : ""}

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
- Include ALL database tables listed above - create a ### subsection for each with the exact table name
- Make authentication and access control easy to understand
- Explain data storage from a user perspective (what data is tracked, why it matters)
- DO NOT include technical implementation details (no Next.js, React, API endpoints, database schemas)
- DO NOT include developer installation or deployment instructions
- Write 600-900 words total
- Use proper markdown headers (##, ###) for structure
- Maintain all specific details provided (limits, numbers, features) - don't drop or generalize them`;
};
