//-| File path: app/(hooks)/useScrollToMessage.ts
import { Message } from "@/app/(types)/chat.types";
import { useEffect, useRef } from "react";

export function useScrollToMessage(messages: Message[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messages.length) return;
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    const timeoutId = setTimeout(scrollToBottom, 1);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  return messagesEndRef;
}
