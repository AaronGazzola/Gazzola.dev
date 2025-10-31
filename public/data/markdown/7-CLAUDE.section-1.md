<!-- option-1 -->
## Core Technologies Stack

**When to use**: This is the default configuration for all projects

**Technologies**:
- **Next.js 15** with App Router architecture
- **TypeScript** for type safety
- **TailwindCSS v4** for styling
- **Shadcn** for UI components
- **Zustand** for state management
- **React Query** for server state management

**Import patterns**:
```typescript
import { create } from "zustand";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/shadcn.utils";
```

**Example component**:
```typescript
import { cn } from "@/lib/shadcn.utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn("px-4 py-2 rounded", className)}
      {...props}
    />
  );
}
```
<!-- /option-1 -->
