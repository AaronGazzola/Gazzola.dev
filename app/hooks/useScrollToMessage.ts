//-| File path: app/hooks/useScrollToMessage.ts
import { useEffect, useRef } from "react";
import { Message } from "@/types/chat.types";

export function useScrollToMessage(messages: Message[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return messagesEndRef;
}
