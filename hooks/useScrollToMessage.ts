//-\ filepath: hooks/useScrollToMessage.ts
"use client";
import { Message } from "@/types/chat.types";
import { useEffect, useRef } from "react";

export const useScrollToMessage = (messages: Message[]) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || messages.length === 0) return;

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
  }, [messages]);

  return { scrollRef };
};
