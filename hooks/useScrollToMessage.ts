//-| File path: hooks/useScrollToMessage.ts
//-\ filepath: hooks/useScrollToMessage.ts
"use client";
import { Conversation } from "@/types/chat.types";
import { useEffect, useRef } from "react";

export const useScrollToMessage = (conversations: Conversation[]) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !conversations[0]?.messages.length) return;

    const totalScrollDistance = element.scrollHeight - element.clientHeight;
    let start: number | null = null;

    function step(timestamp: number) {
      if (!element) return;

      start = start ?? timestamp;
      const progress = timestamp - start;
      const duration = 500;

      const easeInOutQuad = (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const scrollDistance =
        easeInOutQuad(Math.min(progress / duration, 1)) *
        (totalScrollDistance - element.scrollTop);

      element.scrollTop += scrollDistance;

      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        element.scrollTop = totalScrollDistance;
      }
    }

    window.requestAnimationFrame(step);
  }, [conversations]);

  return { scrollRef };
};
