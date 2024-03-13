import Orbit from "./Orbit";
import clsx from "clsx";
import { sourceCodePro } from "@/app/styles/fonts";
import Buttons from "./Buttons";

const Bio = () => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center my-16 mb-10">
      <div className="flex flex-col p-6 sm:p-10 m-2 relative text-gray-200 max-w-md">
        <div className="border border-gray-400 border-t-transparent border-r-transparent rounded-bl-[15px] absolute left-1 sm:left-3 bottom-1 sm:bottom-3 w-16 h-16"></div>
        <div className="border border-gray-400 border-b-transparent border-l-transparent rounded-tr-[20px] absolute right-1 sm:right-3 top-4 sm:top-6 w-16 h-16"></div>
        <h1
          className={clsx(
            sourceCodePro.className,
            "text-[1.4rem] mb-4 text-gray-100"
          )}
        >
          An Insightful Technologist
        </h1>
        <p className="text-md sm:text-lg">
          As technology evolves, the horizon expands for those who understand
          the full spectrum of development. With extensive experience in design,
          production, testing and continuous deployment - I am well equipped to
          orchestrate your project from inception to success.
        </p>
        <p className="text-md sm:text-lg">
          I am insightful and autonomous, granting me the foresight and
          independence to proactively discern and dismantle barriers.
        </p>
        <p className="text-md sm:text-lg">
          I&apos;m also friendly! I enjoy collaborating with others and value
          being a part of a team.
        </p>
        <Buttons />
      </div>
      <Orbit />
    </div>
  );
};

export default Bio;
