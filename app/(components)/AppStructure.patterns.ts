import { PatternDetectionResult, RoutePattern } from "./AppStructure.types";

export const detectRequiredPatterns = (readme: string): PatternDetectionResult => {
  const lower = readme.toLowerCase();

  const countKeywords = (keywords: string[]): number => {
    return keywords.filter(keyword => lower.includes(keyword)).length;
  };

  const hasStrongKeyword = (keywords: string[]): boolean => {
    return keywords.some(keyword => keyword.includes(" ") && lower.includes(keyword));
  };

  const detectPattern = (keywords: string[]): boolean => {
    return countKeywords(keywords) >= 2 || hasStrongKeyword(keywords);
  };

  return {
    hasAdmin: detectPattern(["admin", "administrator", "admin panel", "admin dashboard", "role management"]),
    hasSettings: detectPattern(["settings", "preferences", "configuration", "account settings", "user preferences"]),
    hasModeration: detectPattern(["moderation", "moderator", "content moderation", "report", "flag content", "review content"]),
    hasSearch: detectPattern(["search", "filter", "find", "lookup", "query", "search bar"]),
    hasAnalytics: detectPattern(["analytics", "metrics", "statistics", "reporting", "insights", "dashboard"]),
    hasDashboard: detectPattern(["dashboard", "overview", "summary", "control panel"]),
    hasNotifications: detectPattern(["notification", "alert", "notification center", "push notification", "email notification"]),
    hasUserProfiles: detectPattern(["profile", "user profile", "account page", "user page", "public profile"]),
    hasMultiTenant: detectPattern(["tenant", "organization", "workspace", "team", "multi-tenant", "multi tenant"]),
  };
};

export const CONDITIONAL_PATTERNS: Record<keyof PatternDetectionResult, RoutePattern> = {
  hasAdmin: {
    name: "Admin Panel",
    description: "Administrative access with role-based permissions",
    routeStructure: "app/(admin)/admin/[...sections]/page.tsx",
    typicalFeatures: [
      "User management with CRUD operations (create, view, edit, delete users)",
      "Role assignment and permission control interface",
      "System configuration and global settings management",
      "Content moderation actions and review queue",
      "Activity logs and audit trails with filtering",
    ],
  },
  hasSettings: {
    name: "User Settings",
    description: "Multi-tab settings interface for user preferences",
    routeStructure: "app/(dashboard)/settings/[tab]/page.tsx or app/settings/page.tsx",
    typicalFeatures: [
      "Profile information editing (name, email, avatar upload)",
      "Password change with current password verification",
      "Notification preferences with granular toggle controls",
      "Privacy settings (profile visibility, data sharing options)",
      "Account deletion or deactivation with confirmation",
    ],
  },
  hasModeration: {
    name: "Content Moderation",
    description: "Review and moderate user-generated content",
    routeStructure: "app/(moderation)/moderation/queue/page.tsx",
    typicalFeatures: [
      "Content review queue with status filtering (pending, approved, rejected)",
      "Approve or reject actions with reason selection",
      "User reporting system with category classification",
      "Ban or suspend user accounts with duration selection",
      "Moderation history and action statistics dashboard",
    ],
  },
  hasSearch: {
    name: "Search Interface",
    description: "Advanced search with filters and results display",
    routeStructure: "app/search/page.tsx or app/[resource]/search/page.tsx",
    typicalFeatures: [
      "Search input with auto-complete suggestions",
      "Filter controls (category, date range, status, tags)",
      "Paginated search results with preview cards",
      "Sort options (relevance, date, popularity, alphabetical)",
      "Save search queries or view search history",
    ],
  },
  hasAnalytics: {
    name: "Analytics Dashboard",
    description: "Data visualization and metrics tracking",
    routeStructure: "app/(dashboard)/analytics/[metric]/page.tsx",
    typicalFeatures: [
      "Key performance indicator (KPI) cards with trend indicators",
      "Time-series charts (line, bar, area) with date range selector",
      "Data table with sorting, filtering, and export to CSV",
      "Comparison views (current vs previous period)",
      "Real-time metric updates with refresh controls",
    ],
  },
  hasDashboard: {
    name: "Dashboard Overview",
    description: "Centralized view of user data and quick actions",
    routeStructure: "app/(dashboard)/dashboard/page.tsx or app/dashboard/page.tsx",
    typicalFeatures: [
      "Overview cards showing summary statistics",
      "Recent activity feed or timeline",
      "Quick action buttons for common tasks",
      "Charts and graphs for key metrics",
      "Personalized widgets based on user role or preferences",
    ],
  },
  hasNotifications: {
    name: "Notification Center",
    description: "Notification management and preferences",
    routeStructure: "app/notifications/page.tsx",
    typicalFeatures: [
      "List of all notifications with read/unread status",
      "Notification type filtering (mentions, updates, system)",
      "Mark as read/unread or mark all as read actions",
      "Notification preferences per notification type",
      "Delete or archive old notifications",
    ],
  },
  hasUserProfiles: {
    name: "User Profile Pages",
    description: "Public or private user profile views",
    routeStructure: "app/users/[username]/page.tsx or app/profile/[id]/page.tsx",
    typicalFeatures: [
      "User bio and profile information display",
      "User-generated content list (posts, comments, uploads)",
      "Follow or connect actions with user",
      "Activity timeline or contribution history",
      "Social links and contact information",
    ],
  },
  hasMultiTenant: {
    name: "Multi-Tenant Organization",
    description: "Organization/workspace/team management",
    routeStructure: "app/[org]/[...paths]/page.tsx or app/organizations/[id]/page.tsx",
    typicalFeatures: [
      "Organization creation and settings management",
      "Team member invitation with role assignment",
      "Organization-scoped resources and data isolation",
      "Billing and subscription management per organization",
      "Switch between organizations in navigation",
    ],
  },
};
