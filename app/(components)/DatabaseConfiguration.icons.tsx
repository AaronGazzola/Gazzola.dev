export const BetterAuthIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 500 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="69" y="121" width="86.9879" height="259" fill="currentColor" />
    <rect
      x="337.575"
      y="121"
      width="92.4247"
      height="259"
      fill="currentColor"
    />
    <rect
      x="427.282"
      y="121"
      width="83.4555"
      height="174.52"
      transform="rotate(90 427.282 121)"
      fill="currentColor"
    />
    <rect
      x="430"
      y="296.544"
      width="83.4555"
      height="177.238"
      transform="rotate(90 430 296.544)"
      fill="currentColor"
    />
    <rect
      x="252.762"
      y="204.455"
      width="92.0888"
      height="96.7741"
      transform="rotate(90 252.762 204.455)"
      fill="currentColor"
    />
  </svg>
);

export const NeonDBIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.82l7 3.5v7.36l-7-3.5V9.82zm16 0v7.36l-7 3.5v-7.36l7-3.5z" />
  </svg>
);

interface Technology {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

import { SiSupabase, SiPrisma, SiPostgresql } from "react-icons/si";

export const technologies: Technology[] = [
  { id: "supabase", name: "Supabase", icon: SiSupabase },
  { id: "neondb", name: "NeonDB", icon: NeonDBIcon },
  { id: "betterAuth", name: "Better Auth", icon: BetterAuthIcon },
  { id: "prisma", name: "Prisma", icon: SiPrisma },
  { id: "postgresql", name: "PostgreSQL", icon: SiPostgresql },
];

export type { Technology };
