//-\ filepath: components/Chat/Message.tsx
import { CircleUserRound } from "lucide-react";

interface MessageProps {
  role: string;
  message: string;
  isNew?: boolean;
  isInitial?: boolean;
}

const Message = ({ role, message, isNew, isInitial }: MessageProps) => {
  const isUser = role === "user" || role !== "assistant";

  return (
    <div className="w-full pb-10 pl-7 sm:pl-10">
      <div className="w-full">
        <div className="flex items-center">
          {isUser ? (
            <UserIcon />
          ) : (
            <CircleUserRound className="stroke-[1.5px]" />
          )}
          <h2 className="tracking-wider font-semibold text-lg sm:text-xl ml-3 text-gray-200 text-shadow-sm font-brand">
            {isUser ? "You" : "Az"}
          </h2>
        </div>
        <div className="relative">
          <>
            <hr className="border-gray-400 mt-0.5 mb-1" />
            <hr className="border-black opacity-10 absolute w-full top-[2px] -z-10" />
          </>
        </div>
      </div>
      <div className="text-base sm:text-lg font-medium tracking-wider text-shadow text-gray-300 pt-1 space-y-3">
        {message}
      </div>
    </div>
  );
};

const UserIcon = () => {
  return (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-white" />
    </div>
  );
};

export default Message;
