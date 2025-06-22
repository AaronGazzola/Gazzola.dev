//-| Filepath: components/Chat/Message.tsx
import { CircleUserRound, PersonStanding } from "lucide-react";

interface MessageProps {
  role: string;
  message: string;
  date: string;
  isNew?: boolean;
  isInitial?: boolean;
}

const Message = ({ role, message, date, isNew, isInitial }: MessageProps) => {
  const isUser = role === "user" || role !== "assistant";

  return (
    <div className="w-full py-3 pl-7">
      <div className="w-full">
        <div className="flex items-center pl-1 space-y-10">
          <div className="flex items-center">
            {isUser ? (
              <CircleUserRound className="stroke-[1.5px] h-5 w-5 text-gray-400" />
            ) : (
              <PersonStanding className="stroke-[1.5px] h-5 w-5 text-gray-400" />
            )}
            <h3 className="tracking-wider font-medium text-sm ml-3 text-gray-200 font-brand">
              {isUser ? "You" : "Az"}
            </h3>
            <span className="text-xs text-gray-500 ml-2 mt-1">{date}</span>
          </div>
        </div>
        <div className="relative pt-1 pl-1">
          <hr className="border-gray-600 mt-1 mb-2" />
          <hr className="border-black opacity-50 absolute w-full top-[2px] -z-10" />
        </div>
      </div>
      <div className="text-sm font-medium tracking-wider text-gray-300 pt-1 space-y-2 pl-2">
        {message}
      </div>
    </div>
  );
};

export default Message;