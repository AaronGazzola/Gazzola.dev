import { Role } from "@/app/lib/constants";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import urlRegexSafe from "url-regex-safe";
import UserIcon from "./UserIcon";

const Message = ({
  message = "",
  role = Role.Admin,
  isNew = false,
  isInitial = false,
  isLoading = false,
}: {
  message?: string;
  role?: Role;
  isNew?: boolean;
  isInitial?: boolean;
  isLoading?: boolean;
}) => {
  const isUser = role === Role.User;
  const urlRegex = urlRegexSafe();
  if (!message && !isLoading) return null;
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
          {isLoading ? (
            <svg
              className="stroke-gray-500"
              width="100%"
              height="1"
              viewBox="0 0 100 2"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="1"
                x2="100"
                y2="1"
                strokeWidth="2"
                className="animatedLine"
              />
            </svg>
          ) : (
            <>
              <hr className="border-gray-400 mt-0.5 mb-1" />
              <hr className="border-black opacity-10 absolute w-full top-[2px] -z-10" />{" "}
            </>
          )}
        </div>
      </div>
      <div className="text-base sm:text-lg font-medium tracking-wider text-shadow text-gray-300 pt-1 space-y-3">
        {message.split("\n").map((text, i) => {
          const links = text.match(urlRegex) ?? [];
          return (
            <p key={i}>
              {text.split(urlRegex).map((part, i) => (
                <Fragment key={i}>
                  {part}
                  {urlRegex.test(links[i]) && (
                    <Link
                      className="text-blue-300 hover:text-blue-600 cursor-pointer break-words"
                      href={`https://${links[i]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {links[i]}
                    </Link>
                  )}
                </Fragment>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Message;
