import Orbit from "./Orbit";
import clsx from "clsx";
import { sourceCodePro } from "@/app/styles/fonts";
import { GithubLogo, UpworkLogo } from "@/app/ui/SVG";

const Bio = () => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center">
      <div className="flex flex-col p-10 m-2 relative text-gray-200 max-w-md">
        <div className="border border-gray-400 border-t-transparent border-r-transparent rounded-bl-[15px] absolute left-3 bottom-3 w-16 h-16"></div>
        <div className="border border-gray-400 border-b-transparent border-l-transparent rounded-tr-[20px] absolute right-3 top-6 w-16 h-16"></div>
        <h1
          className={clsx(
            sourceCodePro.className,
            "text-[1.4rem] mb-4 text-gray-100"
          )}
        >
          An Insightful Technologist
        </h1>
        <p className="text-md">
          My role as your Trusted Tech Ally is to enhance the efficiency and
          creativity in your digital endeavors.
        </p>
        <p className="text-md">
          I am insightful and autonomous, granting me the foresight and
          independence to proactively discern and dismantle barriers, ensuring
          your projects flow smoothly and reach new heights of success.
        </p>
        <div className="flex items-center justify-around mt-4">
          <a
            href="https://github.com/AaronGazzola"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-end relative cursor-pointer group"
          >
            <div className="absolute border-b border-gray-300 group-hover:border-blue-400 bottom-0 left-[43px] right-0 opacity-75"></div>
            <div className="relative p-2">
              <div className="absolute inset-0 rotate-45">
                <div className="absolute top-1/2 -right-2 w-2 border-t border-gray-300 group-hover:border-blue-400"></div>
                <div className="absolute inset-0 left-1/2 border border-transparent border-r-gray-300 border-b-gray-300 group-hover:border-b-blue-400 group-hover:border-r-blue-400 rounded-r-full w-1/2 "></div>
              </div>
              <div className="absolute inset-0 button-rotate">
                <div className="absolute inset-0 left-1/2 border border-transparent border-b-gray-300 group-hover:border-transparent group-hover:border-b-blue-400 rounded-r-full w-1/2"></div>
              </div>
              <GithubLogo className="fill-gray-300 w-7 h-7 group-hover:fill-purple-300" />
            </div>
            <span
              className={clsx(
                sourceCodePro.className,
                "tracking-[0.3rem] mb-1 ml-3 group-hover:text-blue-300"
              )}
            >
              GITHUB
            </span>
          </a>
          <a
            href="https://www.upwork.com/freelancers/~017424c1cc6bed64e2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-end relative pr-2 cursor-pointer group"
          >
            <span
              className={clsx(
                sourceCodePro.className,
                "tracking-[0.3rem] mb-1 mr-3 group-hover:text-blue-300"
              )}
            >
              UPWORK
            </span>
            <div className="absolute border-b border-gray-300 group-hover:border-blue-400 bottom-0 right-[52px] left-0 opacity-75"></div>
            <div className="relative p-2">
              <div className="absolute inset-0 rotate-[135deg]">
                <div className="absolute top-1/2 -right-2 w-2 border-t border-gray-300 group-hover:border-blue-400"></div>
                <div className="absolute inset-0 left-1/2 border border-transparent border-r-gray-300 border-b-gray-300 group-hover:border-b-blue-400 group-hover:border-r-blue-400 rounded-r-full w-1/2 "></div>
              </div>
              <div className="absolute inset-0 button-rotate-reverse">
                <div className="absolute inset-0 left-1/2 border border-transparent border-b-gray-300 group-hover:border-transparent group-hover:border-b-blue-400 rounded-r-full w-1/2"></div>
              </div>
              <UpworkLogo className="fill-gray-300 w-7 h-7 group-hover:fill-purple-300" />
            </div>
          </a>
        </div>
      </div>

      <Orbit />
    </div>
  );
};

export default Bio;
