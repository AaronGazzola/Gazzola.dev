//-| File path: app/(components)/Header.hooks.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { RefObject, useEffect, useRef, useState } from "react";
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
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 1
      ) {
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
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isExpanded) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      if (isExpanded && scrollTop + clientHeight >= scrollHeight - 10) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsExpanded(false);
        }, 3000);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [setIsExpanded, isExpanded]);
};