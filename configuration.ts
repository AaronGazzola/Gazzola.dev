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
    home: "/",
  },
};

export const navigationData: NavigationItem[] = [
  {
    name: "welcome",
    type: "page",
  },
  {
    name: "installation",
    type: "segment",
    children: [
      {
        name: "IDE",
        type: "page",
      },
      {
        name: "Next.js",
        type: "page",
      },
      {
        name: "Essentials",
        type: "page",
      },
    ],
  },
];

export default configuration;
