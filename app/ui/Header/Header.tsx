import { sourceCodePro } from "@/app/styles/fonts";
import clsx from "clsx";
import Image from "next/image";

const Header = () => {
  return (
    <div
      className={clsx(
        sourceCodePro.className,
        "flex flex-col justify-end w-full px-5 sm:px-10 items-center relative overflow-hidden text-center"
      )}
    >
      <h1 className="text-[40px] tracking-[1.1rem] text-center my-4 leading-[3rem]">
        AARON GAZZOLA
      </h1>
      <h2 className="text-lg font-medium">Full Stack TypeScript Engineer:</h2>
      <h3 className="text-lg font-medium">Next.js Specialist</h3>
      <Image
        className="object-cover w-full max-w-[1000px] mt-12"
        src="/Space suit bust portrait.png"
        alt="Space suit with programming code reflected in visor"
        width={2912}
        height={1664}
        quality={10}
      />
      <div className="absolute bottom-0 right-0 left-0 h-24 z-10 bottom-vignette" />
    </div>
  );
};

export default Header;
