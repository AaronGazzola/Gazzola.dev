# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# General rules:

- Don't include any comments in any files.
- Import "cn" from ""@/lib/tailwind.utils" to concatinate classes.
- All console.logs should be stringified and minified.

### Tech Stack

- **Framework**: Next.js 15 with App Router and Typescript
- **State Management**: Zustand with React Query
- **UI**: Tailwind CSS with shadcn/ui components

# File Organization and Naming Conventions

- Types and store files alongside anscenstor files
- Actions and hooks files alongside descendent files

## Hook, action, store and type patterns

- Better-auth client methods are called directly in the react-query hooks.
- Prisma client queries are called in actions via getAuthenticatedClient.
- Actions are called via react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store.
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from `"@prisma/client"`

### Types file example:

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

### Store file example:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState } from "./layout.types";

const initialState = {
  user: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      setTempEmail: (tempEmail) => set({ tempEmail }),
      reset: () => set(initialState),
    }),
    {
      name: "app-store",
    }
  )
);
```

### Actions file example:

```typescript
"use server";

import { ActionResponse, getActionResponse } from "@/lib/action.utils";
import { auth } from "@/lib/auth";
import { getAuthenticatedClient } from "@/lib/auth.utils";
import { User } from "@prisma/client";
import { headers } from "next/headers";

export const getUserAction = async (): Promise<ActionResponse<User | null>> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) return getActionResponse();

    const { db } = await getAuthenticatedClient();

    const prismaUser = await db.user.findUnique({
      where: { id: session.user.id },
    });

    return getActionResponse({ data: prismaUser });
  } catch (error) {
    return getActionResponse({ error });
  }
};
```

### Hooks file example

```typescript
"use client";

import { configuration } from "@/configuration";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Toast } from "@/app/(components)/Toast";
import { useAppStore } from "@/app/layout.store";
import { SignInData } from "@/app/layout.types";
import { signIn } from "@/lib/auth-client";
import { CypressDataAttributes } from "@/types/cypress.types";
import { toast } from "sonner";
import { getUserAction } from "./layout.actions";

export const useSignIn = () => {
  const { setUser, setTempEmail } = useAppStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (signInData: SignInData) => {
      const { error } = await signIn.email({
        email: signInData.email,
        password: signInData.password,
      });

      if (error?.status === 403) setTempEmail(signInData.email);

      if (error) throw error;
      const { data: userData, error: userError } = await getUserAction();
      if (userError) throw new Error(userError);

      return userData;
    },
    onSuccess: (data) => {
      if (data) {
        setUser(data);
      }
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Successfully signed in"
          data-cy={CypressDataAttributes.SIGN_IN_SUCCESS_TOAST}
        />
      ));
      router.push(configuration.paths.home);
    },
    onError: (
      error: {
        code?: string | undefined;
        message?: string | undefined;
        status: number;
        statusText: string;
      } | null
    ) => {
      if (error?.status === 403) return;
      toast.custom(() => (
        <Toast
          variant="error"
          title="Sign In Failed"
          message={error?.message || "Failed to sign in"}
          data-cy={CypressDataAttributes.SIGN_IN_ERROR_TOAST}
        />
      ));
    },
  });
};
```
