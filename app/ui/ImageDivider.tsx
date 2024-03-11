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
          "tracking-[1rem] text-white text-[1.5rem] sm:text-[2.5rem] absolute bottom-5 left-1 sm:left-5 right-0 text-shadow lg:text-center"
        )}
      >
        VANGUARD ARCHITECT
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
