"use client";
import ChatWindow from "@/components/Chat/ChatWindow";
import useScreenHeight from "@/hooks/useScreenHeight";
import Image from "next/image";

const ChatApp = () => {
  useScreenHeight();

  return (
    <div className="flex flex-col w-full h-screen px-5 sm:px-10 items-center relative overflow-hidden">
      <div className="absolute inset-5 flex items-center gap-4 flex-col">
        <ChatWindow />
      </div>
      <div className="absolute inset-0 -z-10 overflow-hidden flex items-center justify-center ">
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
  );
};

export default ChatApp;
