"use client";
import clsx from "clsx";
import Image from "next/image";

const BioPortrait = ({
  hasScrolled,
  showAltImage,
}: {
  hasScrolled: boolean;
  showAltImage: boolean;
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-44 sm:w-56 h-44 sm:h-56 flex items-center justify-center rounded-full overflow-hidden shadow shadow-purple-400 relative">
        <div
          className={clsx(
            "absolute bottom-0 top-0 left-0 overflow-hidden",
            !hasScrolled ? "z-10" : showAltImage ? "phase-out" : "phase-in"
          )}
        >
          <div className="absolute inset-0 z-10 bg-black opacity-10"></div>
          <div className="w-44 sm:w-56 ">
            <Image
              className="object-cover scale-[1.2] mt-3"
              src="/Aaron portrait.jpg"
              alt="Portrait of Aaron Gazzola"
              width={427}
              height={427}
              quality={100}
            />
          </div>
        </div>
        <div
          className={clsx(
            "absolute bottom-0 top-0 right-0 w-full overflow-hidden",
            !hasScrolled ? "-z-10" : showAltImage ? "phase-in" : "phase-out"
          )}
        >
          <div className="absolute right-0 w-44 sm:w-56">
            <Image
              className="object-cover"
              src="/Aaron portrait in helmet.png"
              alt="Portrait of Aaron Gazzola"
              width={1024}
              height={1024}
              quality={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioPortrait;
