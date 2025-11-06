<!-- option-1 -->
## Getting Started

### Prerequisites

Before you begin, make sure you have these tools installed on your computer:

- **Node.js** (version 18 or higher) - Download from [nodejs.org](https://nodejs.org)
- **Git** - Download from [git-scm.com](https://git-scm.com)

To verify they're installed, open your terminal and run:

```bash
node --version
git --version
```

### Installation Steps

1. **Download the project files**

   Open your terminal and navigate to where you want to store the project, then run:

   ```bash
   git clone <your-repository-url>
   cd <your-project-name>
   ```

2. **Install dependencies**

   This downloads all the necessary libraries and tools:

   ```bash
   npm install
   ```
<!-- /option-1 -->

<!-- option-2 -->
3. **Set up your database**

   Install Prisma CLI globally:

   ```bash
   npm install -g prisma
   ```

   Initialize your database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```
<!-- /option-2 -->

<!-- option-3 -->
3. **Set up your Supabase project**

   - Visit [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Go to Project Settings > API to find your connection details
<!-- /option-3 -->
