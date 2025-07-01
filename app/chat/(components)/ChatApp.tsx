//-| File path: components/Chat/ChatApp.tsx
//-| Filepath: components/Chat/ChatApp.tsx
"use client";
import Sidebar from "@/app/(components)/Sidebar";
import useScreenHeight from "@/app/(hooks)/useScreenHeight";
import ChatWindow from "@/app/chat/(components)/ChatWindow";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import Image from "next/image";

const ChatApp = () => {
  useScreenHeight();
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <div className="flex w-full h-screen relative overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 px-5 sm:px-10 items-center relative overflow-hidden">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-5 left-5 z-20 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border border-gray-700"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}

        <div className="absolute inset-5 bottom-16 sm:bottom-10 flex items-center gap-4 flex-col">
          <ChatWindow />
        </div>
        <div className="absolute bottom-0 rounded-t-lg bg-blue-400/20 flex flex-col items-center">
          <a
            href="https://www.youtube.com/@AzAnything/streams"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm font-bold px-2 py-1 text-white"
          >
            This app is a work in progress, check out my latest live-stream at
            @azanything for updates!
          </a>
        </div>

        <div className="absolute inset-0 -z-10 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black z-10 bg-overlay" />
          <div className="absolute top-0 right-0 left-0 h-36 z-10 top-vignette" />
          <Image
            className="object-cover object-center h-full w-full"
            src="/Astronaut in code with moon.png"
            alt="Astronaut in cyberspace background image"
            width={1456}
            height={832}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
