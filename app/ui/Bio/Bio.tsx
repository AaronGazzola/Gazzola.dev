import Orbit from "./Orbit";
import clsx from "clsx";
import { sourceCodePro } from "@/app/styles/fonts";

const Bio = () => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center">
      <div className="flex flex-col p-10 m-2 relative text-gray-200 max-w-md">
        <div className="border border-gray-400 border-t-transparent border-r-transparent rounded-bl-[40px] absolute left-2 bottom-2 w-24 h-24"></div>
        <div className="border border-gray-400 border-b-transparent border-l-transparent rounded-tr-[40px] absolute right-2 top-5 w-24 h-24"></div>
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
      </div>

      <Orbit />
    </div>
  );
};

export default Bio;
