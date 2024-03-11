import Image from "next/image";
import { sourceCodePro } from "../styles/fonts";
import clsx from "clsx";

const ImageDivider = () => {
  return (
    <div className="relative overflow-hidden max-h-[500px] flex items-start justify-center ">
      {/* <div className="absolute inset-0 bg-black z-10 opacity-20" /> */}
      <div className="absolute top-0 right-0 left-0 h-12 z-10 top-vignette" />
      <div className="absolute bottom-0 right-0 left-0  h-12 z-10 bottom-vignette" />
      <h1
        className={clsx(
          sourceCodePro.className,
          "tracking-[1.2rem] md:tracking-[2rem] text-white md:text-gray-300 text-[1.5rem] md:text-[2.5rem] absolute bottom-6 md:bottom-4 left-1 sm:left-5 right-0 text-shadow lg:text-center"
        )}
      >
        BEEP BOOP
      </h1>
      <Image
        className="object-cover h-full w-full"
        src="/Astronaut code wall.png"
        alt="Astronaut floating cyberspace divider image"
        width={1456}
        height={832}
      />
    </div>
  );
};

export default ImageDivider;
