export interface NavigationItem {
  name: string;
  type: "page" | "segment";
  children?: NavigationItem[];
}

//-| File path: configuration.ts
const configuration = {
  // App Information
  title: "Gazzola.dev",
  description: "Aaron Gazzola's web development consultation chat app",

  // Environment Variables
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api",

  // Routes
  paths: {
    about: "/about",
    roadmap: "/roadmap",
    UI: "/ui",
    UX: "/ux",
    DB: "/db",
  },
};

export const navigationData: Record<string, NavigationItem[]> = {
  "/roadmap": [
    {
      name: "prompt",
      type: "segment",
      children: [{ name: "prompt.config", type: "page" }],
    },
  ],
  "/ui": [
    {
      name: "navigation",
      type: "segment",
      children: [{ name: "Breadcrumb", type: "page" }],
    },
  ],
  "/ux": [
    {
      name: "research",
      type: "segment",
      children: [{ name: "user-interviews.md", type: "page" }],
    },
  ],
  "/db": [
    {
      name: "schema",
      type: "segment",
      children: [{ name: "models.prisma", type: "page" }],
    },
  ],
};

export default configuration;
