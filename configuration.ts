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
    chat: (userId?: string) => (!userId ? "/" : `/chat/${userId}`),
    admin: "/admin",
    home: "/",
    testRls: "/test/rls",
    testRlsApi: "/api/test/rls",
    testRlsProfile: "/test/rls/profile",
  },
};

export default configuration;
