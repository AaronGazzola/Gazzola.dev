<!-- option-1 -->
## Basic React Query Hooks

**When to use**: Simple data fetching without authentication

**Example**:
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { getDataAction } from "./page.actions";

export const useGetData = () => {
  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const { data, error } = await getDataAction();
      if (error) throw error;
      return data;
    },
  });
};
```
<!-- /option-1 -->

<!-- option-2 -->
## Hooks with Better-Auth Client

**When to use**: When using Better-Auth for authentication

**Example**:
```typescript
"use client";

import { configuration, privatePaths } from "@/configuration";
import { signIn } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Toast } from "../(components)/Toast";
import { TestDataAttributes } from "@/test.types";
import { useAppStore } from "../layout.stores";
import { SignInData } from "../layout.types";
import { getUserAction } from "./layout.actions";

export const useGetUser = () => {
  const { setUser, reset } = useAppStore();
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
      }
      if (error) throw error;
      setUser(data ?? null);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSignIn = () => {
  const { setUser } = useAppStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (signInData: SignInData) => {
      const { error } = await signIn.email({
        email: signInData.email,
        password: signInData.password,
      });

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
          data-cy={TestDataAttributes.TOAST_SUCCESS}
        />
      ));
      router.push(configuration.paths.home);
    },
    onError: (error: Error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Sign In Failed"
          message={error.message || "Failed to sign in"}
          data-cy={TestDataAttributes.TOAST_ERROR}
        />
      ));
    },
  });
};
```
<!-- /option-2 -->

<!-- option-3 -->
## Hooks with Optimistic Updates

**When to use**: For better UX with immediate UI updates

**Example**:
```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostAction } from "./post.actions";

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { data, error } = await updatePostAction(id, title);
      if (error) throw error;
      return data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => {
        return old?.map((post: any) =>
          post.id === variables.id ? { ...post, title: variables.title } : post
        );
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
```
<!-- /option-3 -->

<!-- option-4 -->
## Hooks with File Upload

**When to use**: When Supabase storage is enabled

**Example**:
```typescript
"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Toast } from "../(components)/Toast";
import { uploadFileAction } from "./upload.actions";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "uploads");
      formData.append("path", `${Date.now()}-${file.name}`);

      const { data, error } = await uploadFileAction(formData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.custom(() => (
        <Toast
          variant="success"
          title="Success"
          message="File uploaded successfully"
        />
      ));
    },
    onError: (error: Error) => {
      toast.custom(() => (
        <Toast
          variant="error"
          title="Upload Failed"
          message={error.message || "Failed to upload file"}
        />
      ));
    },
  });
};
```
<!-- /option-4 -->

<!-- option-5 -->
## Hooks with Real-time Subscriptions (Supabase)

**When to use**: When using Supabase for real-time data

**Example**:
```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export const useRealtimeMessages = (channelId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, supabase]);

  return messages;
};
```
<!-- /option-5 -->
