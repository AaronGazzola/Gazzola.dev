//-| File path: app/(components)/Header.hooks.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getYouTubeSubscriberCountAction } from "./Header.actions";

export const useYouTubeSubscriberCount = () => {
  return useQuery({
    queryKey: ["youtube-subscriber-count"],
    queryFn: async () => {
      const { data, error } = await getYouTubeSubscriberCountAction();
      if (error) throw new Error(error);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};