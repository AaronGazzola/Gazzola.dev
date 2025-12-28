export const ResendLogo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
  >
    <rect width="24" height="24" rx="4" fill="#000000" />
    <path
      d="M6 8h12v1.5H6V8zm0 3.5h12V13H6v-1.5zm0 3.5h7v1.5H6V15z"
      fill="white"
    />
    <path
      d="M15 15l3 2.5-3 2.5v-5z"
      fill="white"
    />
  </svg>
);

export const StripeLogo = () => (
  <svg
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
  >
    <rect width="28" height="28" rx="6" fill="#635BFF" />
    <path
      d="M13.3 11.5c0-.7.6-1 1.4-1 1.2 0 2.8.4 4 1V8.4c-1.3-.5-2.6-.8-4-.8-3.3 0-5.5 1.7-5.5 4.6 0 4.5 6.2 3.8 6.2 5.7 0 .7-.7 1-1.5 1-1.3 0-3-.6-4.3-1.3v3.2c1.5.6 3 1 4.3 1 3.3 0 5.6-1.7 5.6-4.6 0-4.8-6.2-4-6.2-5.7z"
      fill="white"
    />
  </svg>
);

export const LexicalLogo = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="h-5 w-5 flex-shrink-0"
  >
    <path
      d="M3 3h18v18H3V3z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M7 7h10M7 12h10M7 17h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const CloudflareLogo = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
  >
    <path
      d="M19.2 13.9l-1.5-3.1c-.1-.2-.3-.3-.5-.3h-3.4c-.3 0-.5.2-.5.5v.2l-.2.9c0 .1 0 .2.1.3.1.1.2.1.3.1h3.1l.9 1.8H6.8c-.2 0-.4-.2-.4-.4l.5-2.4c.1-.3.2-.6.4-.8.2-.2.5-.3.8-.3h5.5c.2 0 .4-.2.4-.4v-1c0-.2-.2-.4-.4-.4H8.1c-.9 0-1.6.2-2.2.6-.6.4-1 1-1.2 1.7l-.5 2.4c0 .1 0 .2-.1.2H2.8c-.2 0-.4.2-.4.4v1c0 .2.2.4.4.4h.9l-.6 2.4c-.1.3-.2.6-.4.8-.2.2-.5.3-.8.3H.8c-.2 0-.4.2-.4.4v1c0 .2.2.4.4.4h1.1c.9 0 1.6-.2 2.2-.6.6-.4 1-1 1.2-1.7l.6-2.4h11.8c.3 0 .6-.1.8-.3.2-.2.4-.5.5-.8l.2-.9c.1-.2.1-.4 0-.6z"
      fill="#F6821F"
    />
  </svg>
);

export const PlaywrightLogo = () => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
  >
    <defs>
      <linearGradient id="pw-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2D4552" />
        <stop offset="100%" stopColor="#1C2B33" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#pw-gradient)" />
    <path
      d="M50 20C63.8 20 75 31.2 75 45c0 6.9-2.8 13.1-7.3 17.6L50 80 32.3 62.6C27.8 58.1 25 51.9 25 45c0-13.8 11.2-25 25-25z"
      fill="#E44D26"
    />
    <path
      d="M50 35c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z"
      fill="white"
    />
  </svg>
);

export const VitestLogo = () => (
  <svg
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
  >
    <defs>
      <linearGradient id="vitest-yellow" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#FCC72B" />
        <stop offset="100%" stopColor="#FDB022" />
      </linearGradient>
      <linearGradient id="vitest-green" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#729B1B" />
        <stop offset="100%" stopColor="#578216" />
      </linearGradient>
    </defs>
    <rect width="256" height="256" fill="url(#vitest-green)" rx="32" />
    <path
      d="M128 40L200 200H56L128 40z"
      fill="url(#vitest-yellow)"
    />
    <path
      d="M128 90L170 170H86L128 90z"
      fill="url(#vitest-green)"
    />
  </svg>
);

import { Plus, Mail, Milestone } from "lucide-react";
import { SupabaseLogo as SupabaseLogoBase } from "./NextStepsComponent.utils";

export const MailIcon = () => <Mail className="h-5 w-5 flex-shrink-0" />;

export const MilestoneIcon = () => <Milestone className="h-5 w-5 flex-shrink-0" />;

export const SupabaseIcon = () => (
  <div className="h-5 w-5 flex-shrink-0">
    <SupabaseLogoBase className="h-full w-full" />
  </div>
);

export const PlaywrightPlusVitestLogo = () => (
  <div className="flex flex-col sm:flex-row items-center gap-0.5 flex-shrink-0 mr-1 lg:mr-2">
    <PlaywrightLogo />
    <Plus className="h-4 w-4 flex-shrink-0" />
    <VitestLogo />
  </div>
);
