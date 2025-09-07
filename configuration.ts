export interface NavigationItem {
  name: string;
  type: "page" | "segment";
  children?: NavigationItem[];
  order?: number;
}

//-| File path: configuration.ts
const configuration = {
  // Environment Variables
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  paths: {
    about: "/about",
    home: "/",
  },
};

export default configuration;
