export interface NavigationItem {
  name: string;
  type: "page" | "segment";
  children?: NavigationItem[];
}

//-| File path: configuration.ts
const configuration = {
  // Environment Variables
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  paths: {
    about: "/about",
  },
};

export const navigationData: NavigationItem[] = [
  {
    name: "prompt",
    type: "segment",
    children: [{ name: "prompt.config", type: "page" }],
  },
];

export default configuration;
