<!-- option-1 -->
**Hooks file example (Client-side):**

```typescript
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppStore } from "../layout.stores";

export const useGetData = () => {
  const { setData } = useAppStore();

  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const response = await fetch("/api/data");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setData(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateData = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (newData: any) => {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error("Failed to create");
      return response.json();
    },
    onSuccess: () => {
      router.refresh();
    },
  });
};
```
<!-- /option-1 -->

<!-- option-2 -->
**Hooks file example (Better Auth):**

```typescript
"use client";

import { configuration, privatePaths } from "@/configuration";
import { signIn } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toast } from "../(components)/Toast";
import { CypressDataAttributes } from "../../types/cypress.types";
import { useAppStore, useRedirectStore } from "../layout.stores";
import { SignInData } from "../layout.types";
import { getUserAction } from "./layout.actions";
import { useAuthLayoutStore } from "./layout.stores";

export const useGetUser = () => {
  const { setUser, reset } = useAppStore();
  const { reset: resetAuthLayout } = useAuthLayoutStore();
  const { setUserData } = useRedirectStore();
  const pathname = usePathname();

  const router = useRouter();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await getUserAction();
      if (!data || error) {
        if (privatePaths.includes(pathname)) {
          router.push(configuration.paths.signIn);
        }
        reset();
        resetAuthLayout();
      }
      if (error) throw error;
      setUser(data ?? null);

      setUserData(data);

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSignIn = () => {
  const { setUser, setTempEmail } = useAppStore();
  const { setUserData } = useRedirectStore();
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
        setUserData(data);
      }
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="Successfully signed in"
          data-cy={CypressDataAttributes.TOAST_SUCCESS}
        />
      ));
      if (data && !data.profile?.isOnboardingComplete) {
        router.push(configuration.paths.onboarding);
        return;
      }
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
          data-cy={CypressDataAttributes.TOAST_ERROR}
        />
      ));
    },
  });
};
```
<!-- /option-2 -->

<!-- option-3 -->
**Hooks file example (Supabase Auth):**

```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppStore } from "../layout.stores";

export const useGetUser = () => {
  const { setUser, reset } = useAppStore();
  const router = useRouter();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        reset();
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUser(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSignIn = () => {
  const { setUser } = useAppStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return data.user;
    },
    onSuccess: (user) => {
      setUser(user);
      router.push('/dashboard');
    },
  });
};
```
<!-- /option-3 -->
