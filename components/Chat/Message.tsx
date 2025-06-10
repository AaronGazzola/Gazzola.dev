import { CircleUserRound } from "lucide-react";

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
    <div className="w-full pb-6 pl-4">
      <div className="w-full">
        <div className="flex items-center">
          {isUser ? (
            <UserIcon />
          ) : (
            <CircleUserRound className="stroke-[1.5px] h-5 w-5 text-gray-400" />
          )}
          <h3 className="tracking-wider font-medium text-sm ml-3 text-gray-200 font-brand">
            {isUser ? "You" : "Az"}
          </h3>
          <span className="text-xs text-gray-500 ml-2">
            {date}
          </span>
        </div>
        <div className="relative">
          <hr className="border-gray-600 mt-1 mb-2" />
          <hr className="border-black opacity-10 absolute w-full top-[2px] -z-10" />
        </div>
      </div>
      <div className="text-sm font-medium tracking-wider text-gray-300 pt-1 space-y-2 ml-8">
        {message}
      </div>
    </div>
  );
};

const UserIcon = () => {
  return (
    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-white" />
    </div>
  );
};

export default Message;