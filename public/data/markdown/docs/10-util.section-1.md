<!-- option-1 -->
**Types file example (Client-side):**

```typescript
export interface AppState {
  data: any[];
  setData: (data: any[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export interface ApiData {
  id: string;
  name: string;
  value: number;
}
```
<!-- /option-1 -->

<!-- option-2 -->
**Types file example (With Database):**

```typescript
import { User } from "@prisma/client";

export interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  tempEmail?: string;
  setTempEmail: (tempEmail: string) => void;
  reset: () => void;
}

export interface SignInData {
  email: string;
  password: string;
}
```
<!-- /option-2 -->
