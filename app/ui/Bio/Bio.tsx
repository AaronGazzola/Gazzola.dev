import Orbit from "./Orbit";
import clsx from "clsx";
import { sourceCodePro } from "@/app/styles/fonts";
import Buttons from "./Buttons";

const Bio = () => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center my-16 mb-10">
      <div className="flex flex-col p-6 sm:p-10 m-2 relative text-gray-200 max-w-md ">
        <div className="border border-gray-400 border-t-transparent border-r-transparent rounded-bl-[15px] absolute left-1 sm:left-3 bottom-1 sm:bottom-3 w-16 h-16"></div>
        <div className="border border-gray-400 border-b-transparent border-l-transparent rounded-tr-[20px] absolute right-1 sm:right-3 top-4 sm:top-6 w-16 h-16"></div>
        <div className="absolute right-1 sm:right-3 top-4 sm:top-6 left-1 sm:left-3 bottom-1 sm:bottom-3 rounded-[20px] blur-xl -z-10 bg-black"></div>
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
          the full spectrum of development. From design to deployment, I am well
          equipped to build, test and maintain web applications.
        </p>
        <p className="text-md sm:text-lg">
          I am insightful and autonomous, providing foresight and independence
          to proactively discern and dismantle barriers.
        </p>
        <p className="text-md sm:text-lg">
          I&apos;m also friendly! I enjoy collaborating with others and value
          being part of a team.
        </p>
        <Buttons />
      </div>
      <Orbit />
    </div>
  );
};

export default Bio;
