<!-- option-1 -->
### Store Example (With Database)

```typescript
import { UserRole } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, ExtendedUser, RedirectState } from "./layout.types";

const initialState = {
  user: null,
};

export const useAppStore = create<AppState>()((set) => ({
  ...initialState,
  setUser: (user) => set({ user, profile: user?.profile || null }),
  reset: () => set(initialState),
}));
```

**Usage with React Query:**
```typescript
import { useAppStore } from "@/stores/app.stores";
import { useGetUser } from "@/hooks/user.hooks";

export const UserProfile = () => {
  const setUser = useAppStore((state) => state.setUser);
  const user = useAppStore((state) => state.user);

  const { isLoading } = useGetUser({
    onSuccess: (data) => setUser(data),
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>Welcome, {user?.name}</div>;
};
```
<!-- /option-1 -->

<!-- option-2 -->
### Store Example (Without Database)

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "app-storage",
    }
  )
);
```

**Usage:**
```typescript
import { useAppStore } from "@/stores/app.stores";

export const ThemeToggle = () => {
  const { theme, setTheme } = useAppStore();

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Toggle Theme
    </button>
  );
};
```
<!-- /option-2 -->
