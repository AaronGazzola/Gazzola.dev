import { LayoutInput, PageInput, AuthMethods, PageAccess } from "./READMEComponent.types";

export const buildReadmePlanPrompt = (
  title: string,
  description: string,
  layouts: LayoutInput[],
  pages: PageInput[],
  authMethods: AuthMethods,
  pageAccess: PageAccess[]
): string => {
  const layoutCount = layouts.length;
  const pageCount = pages.length;

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

  const layoutsSection = layouts.length > 0
    ? `LAYOUTS (${layoutCount} total):
${layouts.map((l, i) => `${i + 1}. ${l.name}
   Description: ${l.description}
   ID: ${l.id}`).join('\n')}`
    : 'No layouts defined.';

  const pagesWithDetails = pages.map((p) => {
    const access = pageAccess.find((pa) => pa.pageId === p.id);
    const accessLevels = [];
    if (access?.anon) accessLevels.push("Anon");
    if (access?.auth) accessLevels.push("Auth");
    if (access?.admin) accessLevels.push("Admin");
    const accessText = accessLevels.length > 0 ? accessLevels.join(", ") : "None";

    const pageLayouts = p.layoutIds
      .map((layoutId) => {
        const layout = layouts.find((l) => l.id === layoutId);
        return layout ? layout.name : null;
      })
      .filter(Boolean);
    const layoutText = pageLayouts.length > 0 ? pageLayouts.join(", ") : "None";

    return {
      ...p,
      accessText,
      layoutText,
    };
  });

  const pagesSection = `PAGES (${pageCount} total):
${pagesWithDetails.map((p, i) => `${i + 1}. ${p.name}
   Route: ${p.route}
   Description: ${p.description}
   Access: ${p.accessText}
   Layouts: ${p.layoutText}
   ID: ${p.id}`).join('\n\n')}`;

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

  return `🚨 CRITICAL ANTI-TRUNCATION REQUIREMENTS 🚨

You MUST analyze ALL ${layoutCount} layouts and ALL ${pageCount} pages individually. Do NOT use shortcuts like:
❌ "[Continue with similar descriptions...]"
❌ "[And so on for remaining pages...]"
❌ Summarizing multiple pages into one section

✅ REQUIRED: Explicitly plan content for EVERY layout (${layoutCount} total) and EVERY page (${pageCount} total)

This is an automated process - there is no human to answer questions or ask you to continue. Complete the ENTIRE plan in ONE response.

Generate a plain text plan for a comprehensive README.md document.

APP CONTEXT:
Title: ${title}
Description: ${description}

AUTHENTICATION METHODS:
${enabledAuthMethods.length > 0 ? enabledAuthMethods.join(", ") : "None - public app"}

${layoutsSection}

${pagesSection}

PAGES BY ACCESS LEVEL:
Anonymous Access (${anonPages.length} pages):
${anonPages.map((p) => `- ${p.name} (${p.route})`).join('\n') || 'None'}

Authenticated Users (${authPages.length} pages):
${authPages.map((p) => `- ${p.name} (${p.route})`).join('\n') || 'None'}

Admin Only (${adminPages.length} pages):
${adminPages.map((p) => `- ${p.name} (${p.route})`).join('\n') || 'None'}

# YOUR TASK

Create a detailed plain text plan for a README.md that will help end users understand this web application.

## PHASE 1: Content Analysis

For each of the ${layoutCount} layouts, analyze:
1. What shared UI elements it provides
2. Which pages use this layout (check layoutIds)
3. How it enhances user experience

For each of the ${pageCount} pages, analyze:
1. What users see on this page
2. What actions they can take
3. Key features and functionality
4. How it fits into the overall user flow
5. Which layouts wrap this page

## PHASE 2: README Structure Plan

Outline the exact structure of the README with specific content for each section:

### Section 1: Title and Overview
- H1: ${title}
- Overview (2-3 paragraphs):
  * What the app does
  * Who it's for
  * Key value proposition
  * Expand on: ${description}

${layouts.length > 0 ? `### Section 2: Layouts (${layoutCount} layouts)

For EACH layout, plan a detailed description covering:
- Layout name and purpose
- Shared UI elements (header, sidebar, footer)
- Which pages use it (reference the PAGES section above)
- How it enhances UX

YOU MUST LIST ALL ${layoutCount} LAYOUTS WITH FULL DESCRIPTIONS:
${layouts.map((l, i) => `
Layout ${i + 1}: ${l.name}
Content plan:
  - Purpose: [plan 2-3 sentences]
  - UI Elements: [plan detailed list]
  - Pages using it: [plan list of pages]
  - UX benefit: [plan 1-2 sentences]
`).join('\n')}` : ''}

### Section ${layouts.length > 0 ? '3' : '2'}: Pages (${pageCount} pages)

For EACH page, plan a detailed H3 section:
- Page name and route as header
- Access level (${anonPages.length} anon, ${authPages.length} auth, ${adminPages.length} admin)
${layouts.length > 0 ? '- Layouts applied\n' : ''}- 2-3 paragraphs describing what users see and do

🚨 YOU MUST LIST ALL ${pageCount} PAGES WITH FULL CONTENT PLANS:

${pagesWithDetails.map((p, i) => `
Page ${i + 1}: ${p.name} (${p.route})
Access: ${p.accessText}
${layouts.length > 0 ? `Layouts: ${p.layoutText}\n` : ''}Content plan:
  - What users see: [plan 2-3 sentences describing visual elements and content]
  - What actions they can take: [plan detailed list of user actions/interactions]
  - Key features: [plan specific functionality details]
  - User flow context: [plan how this page fits into the overall experience]
  - Description to expand: ${p.description}
`).join('\n')}`;

  return `${enabledAuthMethods.length > 0 ? `
### Section ${layouts.length > 0 ? '4' : '3'}: Authentication & Access Control

Plan content structure:
1. Introduction (1-2 paragraphs):
   - Overview of authentication system
   - List ALL ${enabledAuthMethods.length} authentication methods:
${enabledAuthMethods.map(method => `     * ${method}: [plan user-friendly explanation]`).join('\n')}

2. Access Levels subsection:
   - Explain access control model (1 paragraph)
   - List pages by access level:

   **Anonymous Access** (${anonPages.length} pages):
${anonPages.map(p => `   - ${p.name} (${p.route})`).join('\n') || '   None'}

   **Authenticated Users** (${authPages.length} pages):
${authPages.map(p => `   - ${p.name} (${p.route})`).join('\n') || '   None'}

   **Admin Only** (${adminPages.length} pages):
${adminPages.map(p => `   - ${p.name} (${p.route})`).join('\n') || '   None'}
` : ''}
### Section ${layouts.length > 0 ? (enabledAuthMethods.length > 0 ? '5' : '4') : (enabledAuthMethods.length > 0 ? '4' : '3')}: User Experience

Plan 2-3 paragraphs covering:
- How new users first encounter the app
- Common workflows and navigation paths
- How different user roles interact with the system
- Key interaction patterns

### Section ${layouts.length > 0 ? (enabledAuthMethods.length > 0 ? '6' : '5') : (enabledAuthMethods.length > 0 ? '5' : '4')}: Getting Started

Plan clear, friendly instructions:
- How to access the app
- First steps for new users
- How to create an account (if applicable)
- What to do after signing in

# OUTPUT FORMAT (PLAIN TEXT)

Write a detailed plain text plan describing the exact content for each section above.

CRITICAL RULES:
- List ALL ${layoutCount} layouts with full content descriptions
- List ALL ${pageCount} pages with full content descriptions
- Include ALL ${enabledAuthMethods.length} authentication methods with explanations
- Group ALL pages correctly by access level (${anonPages.length} anon, ${authPages.length} auth, ${adminPages.length} admin)
- Write for END USERS (not developers)
- Focus on WHAT users can DO, not technical implementation
- Target 600-900 words total for the final README
- No markdown in the plan - just plain text descriptions of what will go in each section

# FINAL VERIFICATION (REQUIRED)

End your plan with this verification:

## Content Coverage Verification

Layouts planned: ${layoutCount}/${layoutCount}
${layouts.map((l, i) => `  ${i + 1}. ${l.name}`).join('\n')}

Pages planned: ${pageCount}/${pageCount}
${pages.map((p, i) => `  ${i + 1}. ${p.name} (${p.route})`).join('\n')}

Authentication methods covered: ${enabledAuthMethods.length}/${enabledAuthMethods.length}
${enabledAuthMethods.map((m, i) => `  ${i + 1}. ${m}`).join('\n')}

Access levels covered:
- Anonymous: ${anonPages.length} pages
- Authenticated: ${authPages.length} pages
- Admin: ${adminPages.length} pages

Status: ✅ COMPLETE

Return your plan as plain text following the format above.`;
};

export const buildReadmeFromPlanPrompt = (
  plan: string,
  title: string,
  layouts: LayoutInput[],
  pages: PageInput[]
): string => {
  const layoutCount = layouts.length;
  const pageCount = pages.length;

  return `🚨 CRITICAL ANTI-TRUNCATION REQUIREMENTS 🚨

You MUST generate complete README content for ALL sections.

REQUIRED SECTIONS:
- Title and Overview
${layouts.length > 0 ? `- Layouts section (${layoutCount} layouts)\n` : ''}- Pages section (${pageCount} pages)
- Authentication & Access Control (if applicable)
- User Experience
- Getting Started

❌ DO NOT use shortcuts like:
- "[Similar descriptions for other pages...]"
- "[Continue pattern...]"
- Stopping early
- Omitting any layouts or pages from the plan

✅ REQUIRED: Write complete content for EVERY section following the plan

This is an automated process - complete EVERYTHING in ONE response.

PLAN:
${plan}

REFERENCE DATA:
Title: ${title}
Layouts: ${layoutCount}
Pages: ${pageCount}

# YOUR TASK

Convert the plain text plan above into a complete, well-formatted README.md document.

# MARKDOWN GENERATION RULES

1. **Follow the plan structure exactly**
   - Use the exact section order from the plan
   - Include every layout mentioned in the plan
   - Include every page mentioned in the plan
   - Include every authentication method mentioned

2. **Formatting requirements**
   - Use proper markdown headers (##, ###)
   - Write in friendly, professional tone for END USERS
   - Focus on WHAT users can DO, not technical details
   - No code blocks, API endpoints, or implementation details
   - No developer setup or deployment instructions

3. **Content completeness**
   - ${layouts.length > 0 ? `Write full descriptions for ALL ${layoutCount} layouts\n   - ` : ''}Write full descriptions for ALL ${pageCount} pages
   - Each page should have 2-3 detailed paragraphs
   - Include all authentication methods from the plan
   - Maintain all specific details (don't generalize)

4. **Structure format**

# ${title}

## Overview

[2-3 paragraphs based on plan]

${layouts.length > 0 ? `## Layouts

[For each of the ${layoutCount} layouts, write a detailed subsection]

### [Layout Name]

[Description of layout purpose, UI elements, pages using it, UX benefits]

` : ''}## Pages

[For each of the ${pageCount} pages, write a detailed H3 section]

### [Page Name] (\`[route]\`) [(Access Level)]
${layouts.length > 0 ? '\n[Layouts: List of layouts]\n' : ''}
[2-3 paragraphs: what users see, actions they can take, key features, how it fits user flow]

## Authentication & Access Control

[If applicable - introduction, methods, access levels with page lists]

## User Experience

[2-3 paragraphs about user journey, workflows, interaction patterns]

## Getting Started

[Clear instructions for new users]

# VALIDATION REQUIREMENTS

Before outputting, verify:
- ✅ Title (H1) included
- ✅ Overview section (2-3 paragraphs)
${layouts.length > 0 ? `- ✅ Layouts section with ${layoutCount} layout descriptions\n` : ''}- ✅ Pages section with ${pageCount} page descriptions
- ✅ Each page has route, access level, and 2-3 paragraphs
- ✅ Authentication section (if auth methods exist)
- ✅ User Experience section
- ✅ Getting Started section
- ✅ 600-900 words total
- ✅ End-user focused language (no technical jargon)
- ✅ Proper markdown formatting

# OUTPUT

Return ONLY the markdown README content. No explanations, no meta-commentary, no preamble.

Start with: # ${title}

End with the Getting Started section.

Complete ALL sections in ONE response.`;
};
