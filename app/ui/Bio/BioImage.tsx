"use client";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BioImage = () => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const { top, bottom } = ref.current.getBoundingClientRect();
      const center = (top + bottom) / 2;
      const oneThirdWindowHeight = window.innerHeight / 3;
      setAnimationTrigger(
        center > oneThirdWindowHeight &&
          center < window.innerHeight - oneThirdWindowHeight
      );
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex items-center justify-center" ref={ref}>
      <div className="w-56 h-56 flex items-center justify-center rounded-full overflow-hidden shadow shadow-purple-400 relative">
        <div
          className={clsx(
            "absolute bottom-0 top-0 left-0 overflow-hidden",
            animationTrigger ? "phase-out" : "phase-in"
          )}
        >
          <div className="absolute inset-0 z-10 bg-black opacity-10"></div>
          <div className="w-56 ">
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
            animationTrigger ? "phase-in" : "phase-out"
          )}
        >
          <div className="absolute right-0 w-56">
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

export default BioImage;
