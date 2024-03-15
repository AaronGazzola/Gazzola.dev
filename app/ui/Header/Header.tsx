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
        quality={100}
        placeholder="blur"
        blurDataURL={headerImagePreloader}
      />
      <div className="absolute bottom-0 right-0 left-0 h-24 z-10 bottom-vignette" />
    </div>
  );
};

const headerImagePreloader =
  " data:image/png;base64,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";

export default Header;
