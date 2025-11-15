<!-- option-1 -->

## Setup Instructions for Lovable

### Step 1: Connect Your GitHub Account

1. Go to **Settings → Integrations → GitHub** in Lovable
2. Click **Connect GitHub**
3. Sign in to your GitHub account to authorize lovable.dev
4. Install the Lovable GitHub App on your account or organization
5. Select whether to give access to all repositories or only selected ones
6. Click **Install & Authorize**

### Step 2: Create and Connect Your Repository

1. In the Lovable editor, click the **GitHub icon** in the top-right corner
2. Click **Create Repository**
3. Choose the GitHub organization or account where your code should live
4. Lovable will create a new GitHub repository and push your project code to it

### Step 3: Add Your Roadmap to the Repository

1. Download your roadmap directory from the sidebar in Gazzola.dev
2. In Lovable, navigate to your project files
3. Paste your roadmap directory into your project root

### Step 4: Start Building with AI

1. Open the chat panel in Lovable
2. Direct the AI to investigate the roadmap:
   ```
   Please read and analyze the ROBOTS.md file in the roadmap folder,
   then help me implement the features described there.
   ```
3. The AI will read your roadmap and start helping you build!

### Important Notes

- Two-way sync: Edits in Lovable appear in GitHub, and vice versa
- Don't rename, move, or delete your GitHub repository after connecting
- Lovable currently tracks only the default branch of your repository
- You can only connect one GitHub account per Lovable account
<!-- /option-1 -->

<!-- option-2 -->

## Setup Instructions for Replit

### Step 1: Connect Your GitHub Account

1. Navigate to your Replit account settings
2. Scroll down to **Connected Services**
3. Click the GitHub **Connect** button
4. Authorize Replit to access your GitHub account

### Step 2: Create Your GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it appropriately for your project (e.g., `my-web-app`)
3. Choose visibility (public or private - private requires Replit Core membership)
4. Initialize with a README if desired
5. Copy the repository URL

### Step 3: Import Repository to Replit

**Option A - Rapid Import (Public Repositories):**

1. Copy your GitHub repository URL (starting with github.com)
2. In your browser, type: `https://replit.com/` and paste the GitHub URL at the end
3. Example: `https://replit.com/github.com/yourusername/your-repo`

**Option B - Guided Import (Public & Private):**

1. Navigate to [https://replit.com/import](https://replit.com/import)
2. Select **GitHub** from available import sources
3. Authorize access if prompted
4. Select the repository you want to import
5. Click **Import** to start the conversion process

### Step 4: Add Your Roadmap Files

1. Download your roadmap directory from the sidebar in Gazzola.dev
2. In Lovable, navigate to your project files
3. Paste your roadmap directory into your project root

### Step 5: Commit and Push to GitHub

1. Open the **Version Control** panel in Replit (Git icon in sidebar)
2. Stage your changes (click the + next to changed files)
3. Write a commit message: "Add project roadmap"
4. Click **Commit & push**

### Step 6: Start Building with AI

1. Open the Replit AI assistant
2. Direct it to your roadmap:
   ```
   Please read and follow the instructions in the roadmap/ROBOTS.md file
   to help me build this application.
   ```
3. Start developing with AI assistance!

### Important Notes

- There's no longer a limit on repository size (within Replit storage limits)
- Private repositories require Replit Core membership
- Replit attempts to auto-detect your app's language and dependencies
<!-- /option-2 -->

<!-- option-3 -->

## Setup Instructions for VS Code

### Step 1: Install Prerequisites

1. Download and install [VS Code](https://code.visualstudio.com/)
2. Install [Git](https://git-scm.com/) on your computer
3. Verify Git installation by opening a terminal and running: `git --version`

### Step 2: Create Your GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top-right and select **New repository**
3. Name your repository (e.g., `my-web-app`)
4. Choose visibility (public or private)
5. Optionally initialize with a README
6. Click **Create repository**
7. Copy the repository URL (HTTPS or SSH)

### Step 3: Clone Repository in VS Code

**Method 1 - Using Command Palette (Recommended):**

1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `⇧⌘P` (Mac)
3. Type `Git: Clone` and select it
4. Choose **Clone from GitHub**
5. Sign into GitHub if prompted
6. Select your repository from the dropdown
7. Choose a local folder for the project
8. Click **Open** when prompted

**Method 2 - Using URL:**

1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `⇧⌘P` (Mac)
3. Type `Git: Clone` and select it
4. Paste your repository URL
5. Select a destination folder
6. Click **Open** when prompted

### Step 4: Add Your Roadmap Files

1. Download your roadmap directory from the sidebar in Gazzola.dev
2. Drag and drop your downloaded roadmap files into the project root

### Step 5: Commit and Push to GitHub

1. Open the **Source Control** panel (Ctrl+Shift+G or ⌃⇧G)
2. Stage your changes by clicking the **+** icon next to changed files
3. Enter a commit message: "Add project roadmap"
4. Click the **✓ Commit** button
5. Click **Sync Changes** or **Push** to send to GitHub

### Step 6: Start Building with AI

1. Install the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension (requires subscription)
2. Or use [Continue](https://marketplace.visualstudio.com/items?itemName=Continue.continue) (free AI coding assistant)
3. Direct your AI assistant to the roadmap:
   ```
   Please read the roadmap/ROBOTS.md file and help me implement
   the features and requirements described there.
   ```
4. Start building your application!

### Important Notes

- Authentication with GitHub is built into VS Code
- You can use SSH or HTTPS for Git operations
- Install recommended extensions for your tech stack (React, TypeScript, etc.)
- Use the integrated terminal (`Ctrl+\`` or `⌃\``) for running commands
<!-- /option-3 -->
