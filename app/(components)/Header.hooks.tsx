//-| File path: app/(components)/Header.hooks.tsx
"use client";

import { getBrowserAPI } from "@/lib/env.utils";
import { useQuery } from "@tanstack/react-query";
import { RefObject, useEffect, useRef } from "react";
import { getYouTubeSubscriberCountAction } from "./Header.actions";
import { useHeaderStore } from "./Header.store";

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

export const useAutoScroll = (
  scrollContainerRef: RefObject<HTMLDivElement>,
  scrollSpeed: number = 1,
  isActive: boolean = true
) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const scroll = () => {
      const maxScroll = container.scrollWidth / 2;

      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
    };

    intervalRef.current = setInterval(scroll, 30);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [scrollContainerRef, scrollSpeed, isActive]);
};

export const useHeaderCollapseOnScroll = () => {
  const { setIsExpanded, isExpanded } = useHeaderStore();

  useEffect(() => {
    if (isExpanded) {
      const win = getBrowserAPI(() => window);
      win?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isExpanded]);

  useEffect(() => {
    const win = getBrowserAPI(() => window);

    const handleScroll = () => {
      if (!isExpanded) return;

      const scrollTop = win?.scrollY || 0;
      const viewportHeight = win?.innerHeight || 0;
      const headerHeight = viewportHeight;
      const collapseThreshold = headerHeight * 0.7;

      if (scrollTop >= collapseThreshold) {
        setIsExpanded(false);
      }
    };

    win?.addEventListener("scroll", handleScroll);

    return () => {
      win?.removeEventListener("scroll", handleScroll);
    };
  }, [setIsExpanded, isExpanded]);
};
