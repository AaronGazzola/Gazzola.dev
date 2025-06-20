//-| File Path: configuration.ts
const config = {
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
  },
};

export default config;
