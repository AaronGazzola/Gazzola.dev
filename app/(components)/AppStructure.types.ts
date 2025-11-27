import { Feature, FileSystemEntry, UserExperienceFileType } from "@/app/(editor)/layout.types";

export type RouteEntry = {
  path: string;
  children?: RouteEntry[];
};

export type ScreenSize = "xs" | "sm" | "md" | "lg";

export type AppStructureTemplate = {
  id: string;
  name: string;
  structure: FileSystemEntry[];
  features?: Record<string, Feature[]>;
};

export interface AppStructureAIResponse {
  structure: FileSystemEntry[];
  features?: Record<string, Feature[]>;
}

export const PAGE_FILE_ICON = "theme-text-chart-4";

export const LAYOUT_COLORS = [
  {
    border: "theme-border-chart-5",
    icon: "theme-text-chart-5",
  },
  {
    border: "theme-border-destructive",
    icon: "theme-text-destructive",
  },
  {
    border: "theme-border-primary",
    icon: "theme-text-primary",
  },
];

export const APP_STRUCTURE_TEMPLATES: AppStructureTemplate[] = [
  {
    id: "blank",
    name: "Blank",
    structure: [
      {
        id: "app-blank",
        name: "app",
        type: "directory",
        isExpanded: true,
        children: [
          { id: "layout-blank", name: "layout.tsx", type: "file" },
          { id: "page-blank", name: "page.tsx", type: "file" },
          { id: "page-blank-stores", name: "page.stores.ts", type: "file" },
          { id: "page-blank-hooks", name: "page.hooks.tsx", type: "file" },
        ],
      },
    ],
    features: {
      "page-blank": [
        {
          id: "home-feature",
          title: "Home Page",
          description: "Main landing page content and hero section",
          linkedFiles: {
            stores: "/app/page.stores.ts",
            hooks: "/app/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
    },
  },
  {
    id: "auth",
    name: "Auth (grouped routes)",
    structure: [
      {
        id: "app-auth",
        name: "app",
        type: "directory",
        isExpanded: true,
        children: [
          { id: "layout-auth", name: "layout.tsx", type: "file" },
          {
            id: "auth-group",
            name: "(auth)",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "auth-layout", name: "layout.tsx", type: "file" },
              {
                id: "login-dir",
                name: "login",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "login-page", name: "page.tsx", type: "file" },
                  { id: "login-stores", name: "page.stores.ts", type: "file" },
                  { id: "login-hooks", name: "page.hooks.tsx", type: "file" },
                ],
              },
              {
                id: "register-dir",
                name: "register",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "register-page", name: "page.tsx", type: "file" },
                  { id: "register-stores", name: "page.stores.ts", type: "file" },
                  { id: "register-hooks", name: "page.hooks.tsx", type: "file" },
                ],
              },
            ],
          },
          {
            id: "dashboard-group",
            name: "(dashboard)",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "dashboard-layout", name: "layout.tsx", type: "file" },
              { id: "dashboard-page", name: "page.tsx", type: "file" },
              { id: "dashboard-stores", name: "page.stores.ts", type: "file" },
              { id: "dashboard-hooks", name: "page.hooks.tsx", type: "file" },
              {
                id: "settings-dir",
                name: "settings",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "settings-page", name: "page.tsx", type: "file" },
                  { id: "settings-stores", name: "page.stores.ts", type: "file" },
                  { id: "settings-hooks", name: "page.hooks.tsx", type: "file" },
                ],
              },
            ],
          },
        ],
      },
    ],
    features: {
      "login-page": [
        {
          id: "login-feature",
          title: "Login Form",
          description: "User authentication form with email and password",
          linkedFiles: {
            stores: "/app/(auth)/login/page.stores.ts",
            hooks: "/app/(auth)/login/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "register-page": [
        {
          id: "register-feature",
          title: "Registration Form",
          description: "New user account creation form",
          linkedFiles: {
            stores: "/app/(auth)/register/page.stores.ts",
            hooks: "/app/(auth)/register/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "dashboard-page": [
        {
          id: "dashboard-feature",
          title: "Dashboard Overview",
          description: "Main dashboard view with user data summary",
          linkedFiles: {
            stores: "/app/(dashboard)/page.stores.ts",
            hooks: "/app/(dashboard)/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "settings-page": [
        {
          id: "settings-feature",
          title: "User Settings",
          description: "Account settings and preferences management",
          linkedFiles: {
            stores: "/app/(dashboard)/settings/page.stores.ts",
            hooks: "/app/(dashboard)/settings/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
    },
  },
  {
    id: "nested",
    name: "Nested layouts",
    structure: [
      {
        id: "app-nested",
        name: "app",
        type: "directory",
        isExpanded: true,
        children: [
          { id: "layout-nested", name: "layout.tsx", type: "file" },
          { id: "page-nested", name: "page.tsx", type: "file" },
          { id: "page-nested-stores", name: "page.stores.ts", type: "file" },
          { id: "page-nested-hooks", name: "page.hooks.tsx", type: "file" },
          {
            id: "products-dir",
            name: "products",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "products-layout", name: "layout.tsx", type: "file" },
              { id: "products-page", name: "page.tsx", type: "file" },
              { id: "products-stores", name: "page.stores.ts", type: "file" },
              { id: "products-hooks", name: "page.hooks.tsx", type: "file" },
              {
                id: "category-dir",
                name: "[category]",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "category-layout", name: "layout.tsx", type: "file" },
                  { id: "category-page", name: "page.tsx", type: "file" },
                  { id: "category-stores", name: "page.stores.ts", type: "file" },
                  { id: "category-hooks", name: "page.hooks.tsx", type: "file" },
                  {
                    id: "product-dir",
                    name: "[id]",
                    type: "directory",
                    isExpanded: true,
                    children: [
                      { id: "product-page", name: "page.tsx", type: "file" },
                      { id: "product-stores", name: "page.stores.ts", type: "file" },
                      { id: "product-hooks", name: "page.hooks.tsx", type: "file" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    features: {
      "page-nested": [
        {
          id: "home-nested-feature",
          title: "Home Page",
          description: "Main landing page with navigation to products",
          linkedFiles: {
            stores: "/app/page.stores.ts",
            hooks: "/app/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "products-page": [
        {
          id: "products-feature",
          title: "Product List",
          description: "Grid display of product catalog",
          linkedFiles: {
            stores: "/app/products/page.stores.ts",
            hooks: "/app/products/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "category-page": [
        {
          id: "category-feature",
          title: "Category View",
          description: "Filtered products by category",
          linkedFiles: {
            stores: "/app/products/[category]/page.stores.ts",
            hooks: "/app/products/[category]/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "product-page": [
        {
          id: "product-feature",
          title: "Product Details",
          description: "Individual product information and actions",
          linkedFiles: {
            stores: "/app/products/[category]/[id]/page.stores.ts",
            hooks: "/app/products/[category]/[id]/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
    },
  },
  {
    id: "blog",
    name: "Blog structure",
    structure: [
      {
        id: "app-blog",
        name: "app",
        type: "directory",
        isExpanded: true,
        children: [
          { id: "layout-blog", name: "layout.tsx", type: "file" },
          { id: "page-blog", name: "page.tsx", type: "file" },
          { id: "page-blog-stores", name: "page.stores.ts", type: "file" },
          { id: "page-blog-hooks", name: "page.hooks.tsx", type: "file" },
          {
            id: "blog-dir",
            name: "blog",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "blog-layout", name: "layout.tsx", type: "file" },
              { id: "blog-page", name: "page.tsx", type: "file" },
              { id: "blog-stores", name: "page.stores.ts", type: "file" },
              { id: "blog-hooks", name: "page.hooks.tsx", type: "file" },
              {
                id: "slug-dir",
                name: "[slug]",
                type: "directory",
                isExpanded: true,
                children: [
                  { id: "slug-page", name: "page.tsx", type: "file" },
                  { id: "slug-stores", name: "page.stores.ts", type: "file" },
                  { id: "slug-hooks", name: "page.hooks.tsx", type: "file" },
                ],
              },
            ],
          },
          {
            id: "about-dir",
            name: "about",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "about-page", name: "page.tsx", type: "file" },
              { id: "about-stores", name: "page.stores.ts", type: "file" },
              { id: "about-hooks", name: "page.hooks.tsx", type: "file" },
            ],
          },
          {
            id: "contact-dir",
            name: "contact",
            type: "directory",
            isExpanded: true,
            children: [
              { id: "contact-page", name: "page.tsx", type: "file" },
              { id: "contact-stores", name: "page.stores.ts", type: "file" },
              { id: "contact-hooks", name: "page.hooks.tsx", type: "file" },
            ],
          },
        ],
      },
    ],
    features: {
      "page-blog": [
        {
          id: "blog-home-feature",
          title: "Blog Home",
          description: "Featured posts and recent articles",
          linkedFiles: {
            stores: "/app/page.stores.ts",
            hooks: "/app/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "blog-page": [
        {
          id: "post-list-feature",
          title: "Post List",
          description: "Paginated blog post listing",
          linkedFiles: {
            stores: "/app/blog/page.stores.ts",
            hooks: "/app/blog/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "slug-page": [
        {
          id: "post-content-feature",
          title: "Post Content",
          description: "Full blog post with comments",
          linkedFiles: {
            stores: "/app/blog/[slug]/page.stores.ts",
            hooks: "/app/blog/[slug]/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "about-page": [
        {
          id: "about-feature",
          title: "About Section",
          description: "Company/author information",
          linkedFiles: {
            stores: "/app/about/page.stores.ts",
            hooks: "/app/about/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
      "contact-page": [
        {
          id: "contact-feature",
          title: "Contact Form",
          description: "Contact form submission",
          linkedFiles: {
            stores: "/app/contact/page.stores.ts",
            hooks: "/app/contact/page.hooks.tsx",
          },
          functionNames: {},
          isEditing: false,
        },
      ],
    },
  },
];
