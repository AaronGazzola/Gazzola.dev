"use client";
import { Button } from "@/components/ui/button";
import configuration from "@/configuration";
import { cn } from "@/lib/tailwind.utils";
import { DataCyAttributes } from "@/types/cypress.types";
import { format } from "date-fns";
import { PersonStanding } from "lucide-react";
import Link from "next/link";

interface AdminWelcomeMessagesProps {
  className?: string;
}

export default function AdminWelcomeMessages({
  className,
}: AdminWelcomeMessagesProps) {
  const adminMessages = [
    "Hi! I'm Az. Need help making a web app?",
    "Sign up for free to chat with me :)",
  ];

  const currentTime = new Date();

  return (
    <div className={cn("space-y-2", className)}>
      {adminMessages.map((message, index) => (
        <div
          key={index}
          className="w-full py-3 pl-7"
          data-cy={`${DataCyAttributes.CHAT_MESSAGE_ITEM}-admin-${index}`}
        >
          <div className="w-full">
            <div className="flex items-center pl-1">
              <div className="flex items-center gap-3 pl-1 pr-2 w-full flex-row-reverse">
                <PersonStanding className="stroke-[1.5px] h-5 w-5 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {format(currentTime, "MMM d, HH:mm")}
                </span>
                <h3 className="tracking-wider font-medium text-sm text-gray-200">
                  Az Anything
                </h3>
              </div>
            </div>
            <div className="relative pt-1 pl-1">
              <hr className="border-gray-600 mt-1 mb-2" />
              <hr className="border-black opacity-50 absolute w-full top-[2px] -z-10" />
            </div>
          </div>
          <div
            className="font-medium tracking-wider text-gray-300 pt-1 space-y-2 py-2 px-3 pb-3 whitespace-pre-wrap bg-black/40 rounded text-right"
            data-cy={`${DataCyAttributes.CHAT_WINDOW_MESSAGE}-admin-${index}`}
          >
            {message}
          </div>
        </div>
      ))}

      <div className="w-full py-3 pl-7">
        <div className="flex justify-end pr-3">
          <Link href={configuration.paths.about}>
            <Button
              variant="outline"
              className="border-gray-400 bg-transparent text-gray-300 hover:bg-gray-800 rounded font-bold"
            >
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
