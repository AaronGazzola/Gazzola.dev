<!-- option-1 -->
## Basic Zustand Store

**When to use**: Simple client-side state management

**Example**:
```typescript
import { create } from "zustand";

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const initialState = {
  theme: 'light' as const,
};

export const useThemeStore = create<ThemeState>()((set) => ({
  ...initialState,
  setTheme: (theme) => set({ theme }),
}));
```
<!-- /option-1 -->

<!-- option-2 -->
## Persisted Store

**When to use**: When state needs to persist across sessions

**Example**:
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  notifications: boolean;
  language: string;
  setNotifications: (enabled: boolean) => void;
  setLanguage: (lang: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: true,
      language: 'en',
      setNotifications: (notifications) => set({ notifications }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
```
<!-- /option-2 -->

<!-- option-3 -->
## Store with Authentication State

**When to use**: When using Better-Auth with user session

**Example**:
```typescript
import { User } from "@prisma/client";
import { create } from "zustand";
import { AppState } from "./layout.types";

const initialState = {
  user: null,
};

export const useAppStore = create<AppState>()((set) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  reset: () => set(initialState),
}));
```
<!-- /option-3 -->

<!-- option-4 -->
## Store with Multi-Tenant Support

**When to use**: When using Better-Auth organization plugin

**Example**:
```typescript
import { create } from "zustand";

interface OrganizationState {
  activeOrganizationId: string | null;
  setActiveOrganization: (id: string | null) => void;
  reset: () => void;
}

const initialState = {
  activeOrganizationId: null,
};

export const useOrganizationStore = create<OrganizationState>()((set) => ({
  ...initialState,
  setActiveOrganization: (activeOrganizationId) => set({ activeOrganizationId }),
  reset: () => set(initialState),
}));
```
<!-- /option-4 -->
