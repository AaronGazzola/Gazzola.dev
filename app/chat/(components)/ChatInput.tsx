//-| File path: app/chat/(components)/ChatInput.tsx
"use client";

import { useAuthStore } from "@/app/(stores)/auth.store";
import { useSendMessage } from "@/app/chat/(components)/ChatInput.hooks";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Send } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const chatFormSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").trim(),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

export default function ChatInput() {
  const { user } = useAuthStore();
  const sendMessageMutation = useSendMessage();

  const isAdmin = user?.role === "admin";

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (sendMessageMutation.isSuccess) {
      const successElement = document.querySelector(
        `[data-cy="${DataCyAttributes.SUCCESS_MESSAGE_SEND}"]`
      );
      if (successElement) {
        successElement.remove();
      }

      const successDiv = document.createElement("div");
      successDiv.setAttribute("data-cy", DataCyAttributes.SUCCESS_MESSAGE_SEND);
      successDiv.style.display = "none";
      document.body.appendChild(successDiv);

      setTimeout(() => {
        successDiv.remove();
      }, 100);
    }

    if (sendMessageMutation.isError) {
      const errorElement = document.querySelector(
        `[data-cy="${DataCyAttributes.ERROR_MESSAGE_SEND}"]`
      );
      if (errorElement) {
        errorElement.remove();
      }

      const errorDiv = document.createElement("div");
      errorDiv.setAttribute("data-cy", DataCyAttributes.ERROR_MESSAGE_SEND);
      errorDiv.style.display = "none";
      document.body.appendChild(errorDiv);

      setTimeout(() => {
        errorDiv.remove();
      }, 100);
    }
  }, [sendMessageMutation.isSuccess, sendMessageMutation.isError]);

  const handleSendMessage = () => {
    const messageContent = form.getValues("message");
    if (!messageContent.trim()) return;

    sendMessageMutation.mutate({
      messageContent,
      isNewConversation: false,
    });

    form.reset();
  };

  const handleCreateConversation = () => {
    const messageContent = form.getValues("message");
    if (!messageContent.trim()) return;

    sendMessageMutation.mutate({
      messageContent,
      isNewConversation: true,
    });

    form.reset();
  };

  const onSubmit = (data: ChatFormValues) => {
    handleSendMessage();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const isMessageEmpty = !form.watch("message")?.trim();
  const disabled = sendMessageMutation.isPending;

  return (
    <div
      className="pt-4 pl-4 pr-4 pb-4 relative"
      data-cy={DataCyAttributes.CHAT_INPUT_CONTAINER}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative"
          data-cy={DataCyAttributes.CHAT_INPUT_FORM}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type your message..."
                    disabled={disabled}
                    onKeyDown={handleKeyDown}
                    data-cy={DataCyAttributes.CHAT_INPUT_TEXTAREA}
                    className={cn(
                      "min-h-[80px] resize-none border border-white/10 focus:border-white/40 pr-16"
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="absolute right-2 bottom-2 flex flex-col gap-2">
            <Button
              type="submit"
              disabled={disabled || isMessageEmpty}
              size="icon"
              data-cy={DataCyAttributes.SEND_MESSAGE_BUTTON}
              className={cn(
                "h-8 w-8",
                isMessageEmpty
                  ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
            {isAdmin && (
              <Button
                type="button"
                onClick={handleCreateConversation}
                disabled={disabled || isMessageEmpty}
                size="icon"
                data-cy={DataCyAttributes.CREATE_NEW_CONVERSATION_BUTTON}
                className={cn(
                  "h-8 w-8",
                  isMessageEmpty
                    ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                )}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Create new conversation</span>
              </Button>
            )}
          </div>
        </form>
      </Form>
      {isAdmin && (
        <div className="text-xs text-gray-400 mt-2">
          Use the + button to create a new conversation
        </div>
      )}
    </div>
  );
}
