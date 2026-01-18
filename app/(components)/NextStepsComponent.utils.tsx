export const ClaudeCodeLogo = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    imageRendering="optimizeQuality"
    fillRule="evenodd"
    clipRule="evenodd"
    viewBox="0 0 512 509.64"
    className={className}
    style={style}
  >
    <path
      fill="#D77655"
      d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.612-115.613 115.612H115.612C52.026 509.639 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"
    />
    <path
      fill="#FCF2EE"
      fillRule="nonzero"
      d="M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z"
    />
  </svg>
);

export const GitHubSmallLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.865 20.17 8.839 21.49C9.339 21.58 9.521 21.27 9.521 21C9.521 20.77 9.513 20.14 9.508 19.31C6.726 19.91 6.139 17.77 6.139 17.77C5.685 16.61 5.029 16.3 5.029 16.3C4.121 15.68 5.098 15.69 5.098 15.69C6.101 15.76 6.629 16.73 6.629 16.73C7.521 18.28 8.97 17.84 9.539 17.58C9.631 16.93 9.889 16.49 10.175 16.24C7.955 16 5.62 15.13 5.62 11.31C5.62 10.22 6.01 9.32 6.649 8.62C6.546 8.37 6.203 7.33 6.747 5.93C6.747 5.93 7.586 5.66 9.497 6.99C10.31 6.77 11.157 6.66 12 6.66C12.843 6.66 13.69 6.77 14.504 6.99C16.414 5.66 17.252 5.93 17.252 5.93C17.797 7.33 17.454 8.37 17.351 8.62C17.991 9.32 18.38 10.22 18.38 11.31C18.38 15.14 16.041 15.99 13.813 16.24C14.172 16.55 14.491 17.16 14.491 18.09C14.491 19.43 14.479 20.51 14.479 20.84C14.479 21.11 14.659 21.42 15.169 21.31C19.137 19.99 22 16.24 22 11.82C22 6.477 17.523 2 12 2Z"
    />
  </svg>
);

export const VSCodeLogo = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M29.01 5.03L23.244 2.254C22.764 2.008 22.228 1.888 21.691 1.904L21.244 1.914L10.309 12.672L4.486 8.291C4.149 8.019 3.721 7.88 3.284 7.9C2.847 7.92 2.433 8.099 2.12 8.404L0.67 9.746C0.237 10.181 0.237 10.892 0.67 11.327L5.68 16.167L0.67 21.007C0.237 21.442 0.237 22.153 0.67 22.588L2.12 23.93C2.433 24.235 2.847 24.414 3.284 24.434C3.721 24.454 4.149 24.315 4.486 24.043L10.309 19.662L21.244 30.42L21.691 30.43C22.228 30.446 22.764 30.326 23.244 30.08L29.01 27.304C29.626 26.992 30 26.351 30 25.657V6.677C30 5.983 29.626 5.342 29.01 5.03ZM23.244 24.657L13.45 16.167L23.244 7.677V24.657Z"
      fill="#007ACC"
    />
  </svg>
);

export const SupabaseLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 109 113"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#paint1_linear)"
      fillOpacity="0.2"
    />
    <path
      d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
      fill="#3ECF8E"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="53.9738"
        y1="54.974"
        x2="94.1635"
        y2="71.8295"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#249361" />
        <stop offset="1" stopColor="#3ECF8E" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="36.1558"
        y1="30.578"
        x2="54.4844"
        y2="65.0806"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const NextJsLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <mask
      id="mask0_408_139"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="180"
      height="180"
    >
      <circle cx="90" cy="90" r="90" fill="black" />
    </mask>
    <g mask="url(#mask0_408_139)">
      <circle cx="90" cy="90" r="90" fill="black" />
      <path
        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
        fill="url(#paint0_linear_408_139)"
      />
      <rect
        x="115"
        y="54"
        width="12"
        height="72"
        fill="url(#paint1_linear_408_139)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_408_139"
        x1="109"
        y1="116.5"
        x2="144.5"
        y2="160.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_408_139"
        x1="121"
        y1="54"
        x2="120.799"
        y2="106.875"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const NodeJsLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 256 289"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    className={className}
  >
    <path
      d="M127.999 288.463c-3.975 0-7.685-1.06-11.13-2.915l-35.247-20.936c-5.3-2.915-2.65-3.975-1.06-4.505 7.155-2.385 8.48-2.915 15.9-7.156.795-.53 1.856-.265 2.65.265l27.032 16.166c1.06.53 2.385.53 3.18 0l105.74-61.217c1.06-.53 1.59-1.59 1.59-2.915V83.08c0-1.325-.53-2.385-1.59-2.915l-105.74-60.953c-1.06-.53-2.385-.53-3.18 0L20.405 80.166c-1.06.53-1.59 1.855-1.59 2.915v122.17c0 1.06.53 2.385 1.59 2.915l28.887 16.695c15.636 7.95 25.44-1.325 25.44-10.6V93.68c0-1.59 1.326-3.18 3.181-3.18h13.516c1.59 0 3.18 1.326 3.18 3.18v120.58c0 20.936-11.396 33.126-31.272 33.126-6.095 0-10.865 0-24.38-6.625l-27.827-15.9C4.24 220.885 0 213.465 0 205.515V83.346C0 75.396 4.24 67.976 11.13 64L116.87 2.783c6.625-3.71 15.635-3.71 22.26 0L244.87 64C251.76 67.976 256 75.132 256 83.346v122.17c0 7.95-4.24 15.37-11.13 19.345L139.13 286.08c-3.445 1.59-7.42 2.385-11.13 2.385zm32.596-84.009c-46.377 0-55.917-21.2-55.917-39.221 0-1.59 1.325-3.18 3.18-3.18h13.78c1.59 0 2.916 1.06 2.916 2.65 2.12 14.045 8.215 20.936 36.306 20.936 22.26 0 31.802-5.035 31.802-16.96 0-6.891-2.65-11.926-37.367-15.372-28.886-2.915-46.907-9.275-46.907-32.33 0-21.467 18.022-34.186 48.232-34.186 33.921 0 50.617 11.66 52.737 37.101 0 .795-.265 1.59-.795 2.385-.53.53-1.325 1.06-2.12 1.06h-13.78c-1.326 0-2.65-1.06-2.916-2.385-3.18-14.575-11.395-19.345-33.126-19.345-24.38 0-27.296 8.48-27.296 14.84 0 7.686 3.445 10.07 36.306 14.31 32.597 4.24 47.967 10.336 47.967 33.127-.265 23.321-19.345 36.571-53.266 36.571z"
      fill="#539E43"
    />
  </svg>
);

export const VercelLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 76 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
  </svg>
);

export const SETUP_PROMPT = `I need help setting up my Next.js project. Please work through these steps one at a time, pause to ask for my input only when needed:

1. CHECK PREREQUISITES
   - Check if git and Node.js are installed by running: git --version && node --version
   - If git is missing: guide me to install it for my operating system
   - If Node.js is missing or version is below 18: direct me to download the LTS version from nodejs.org

2. INSTALL NEXT.JS
   - Once prerequisites are confirmed, install Next.js in the current directory
   - Use the command: npx create-next-app@latest . --no-tailwind --yes
   - This accepts all defaults (TypeScript, ESLint, App Router) but skips Tailwind so we can install v4 manually later

3. CLEAN UP BOILERPLATE
   - After installation, help me delete unnecessary boilerplate files
   - Set up a clean initial project structure

4. CONFIGURE ENVIRONMENT (only when we reach this step)
   - Guide me to find my Supabase credentials in the dashboard:

     To get your keys:
     1. Go to your Supabase project dashboard
     2. Click "Project Settings" in the left sidebar
     3. Click "API Keys" in the left settings menu
     4. Scroll down to "Publishable key" and click the copy button next to the "default" key and paste it here (starts with "sb_publishable_")
     5. Scroll down to "Secret keys" and click the copy button next to the "default" key and paste it here (starts with "sb_secret_")
     6. Also copy the URL in your browser's URL/search bar (starts with: "https://supabase.com/dashboard/project/") and paste it here 

   - After I provide these credentials, create a .env.local file (extract the supabase URL and project ref from the full url provided, eg: "https://supabase.com/dashboard/project/cqblezzhywdjerslhgho/settings/api-keys/legacy" -> "https://cqblezzhywdjerslhgho.supabase.co" + "cqblezzhywdjerslhgho"):
     NEXT_PUBLIC_SUPABASE_URL=<my-project-url>
     NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<my-anon-key>
     NEXT_PUBLIC_SUPABASE_PROJECT_REF=<my-project-ref>
     SUPABASE_SECRET_KEY=<my-service-role-key>

   - Verify .gitignore includes .env.local
   - Add a .env.example file with the supabase key variable names without the values

5. INITIAL COMMIT AND PUSH
   - Commit and push the changes
   - Note: I'm already authenticated with GitHub from when I cloned this repository
   - Run git add . && git commit -m "Initial Next.js setup" && git push`;

export const generateFinalPrompt = (
  starterKitName: string
) => `I need help setting up my project using the starter kit. Please work through these steps:

1. LOCATE STARTER KIT
   - Search the repository for a directory or ZIP file name containing "${starterKitName}" (it may have "(3)" or something similar appended)
   - If not found, ask me: "I couldn't find the ${starterKitName}. Please download it from Gazzola.dev and add it to your project directory, then let me know when it's ready."
   - Wait for my confirmation before proceeding

2. EXTRACT AND ORGANIZE
   - If it's a ZIP file, extract it
   - Move all contents from the starter kit to the project root:
     * documentation/ directory (and all contents) → root
     * CLAUDE.md → root
     * README.md from documentation/initial_configuration/ → root (overwrite if exists)
   - Verify all files and folders are in place
   - IMPORTANT: Delete the "${starterKitName}" directory or zip file after extracting all contents

3. CREATE IMPLEMENTATION PLAN
   - Read documentation/starter_kit.plan.md
   - Switch to plan mode and create a step-by-step plan from the instructions in that document

Important: Follow the starter_kit.plan.md document exactly. It contains all the detailed instructions for the setup process.`;
