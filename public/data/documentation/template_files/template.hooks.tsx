import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/supabase/browser-client";
import {
  getUserProfileAction,
  createPostAction,
  updatePostAction,
  deletePostAction,
  getPostsAction,
} from "./template.actions";
import type { PostInsert, PostUpdate } from "./template.types";
import { usePostsStore } from "./template.stores";

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfileAction(userId),
  });
}

export function useUserAuth() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const signIn = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        throw new Error("Failed to sign in");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
        throw new Error("Failed to sign out");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return { signIn, signOut };
}

export function usePosts(userId?: string) {
  const setPosts = usePostsStore((state) => state.setPosts);

  return useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const posts = await getPostsAction(userId);
      setPosts(posts);
      return posts;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const addPost = usePostsStore((state) => state.addPost);

  return useMutation({
    mutationFn: (post: PostInsert) => createPostAction(post),
    onSuccess: (newPost) => {
      addPost(newPost);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const updatePost = usePostsStore((state) => state.updatePost);

  return useMutation({
    mutationFn: ({
      postId,
      updates,
    }: {
      postId: string;
      updates: PostUpdate;
    }) => updatePostAction(postId, updates),
    onSuccess: (updatedPost) => {
      updatePost(updatedPost.id, updatedPost);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const removePost = usePostsStore((state) => state.removePost);

  return useMutation({
    mutationFn: (postId: string) => deletePostAction(postId),
    onSuccess: (_, postId) => {
      removePost(postId);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useRealtimePosts() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { addPost, updatePost, removePost } = usePostsStore();

  return useQuery({
    queryKey: ["realtimePosts"],
    queryFn: () => {
      const channel = supabase
        .channel("posts-changes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "posts",
          },
          (payload) => {
            addPost(payload.new as any);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "posts",
          },
          (payload) => {
            updatePost(payload.new.id as string, payload.new as any);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "posts",
          },
          (payload) => {
            removePost(payload.old.id as string);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
}
