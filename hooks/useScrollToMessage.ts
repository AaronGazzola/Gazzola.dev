//-| File path: app/hooks/useScrollToMessage.ts
import { Message } from "@/types/chat.types";
import { useEffect, useRef } from "react";

export function useScrollToMessage(messages: Message[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return messagesEndRef;
}
