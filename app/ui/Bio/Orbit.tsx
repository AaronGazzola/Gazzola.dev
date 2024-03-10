"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Moon from "./Moon";
import Portrait from "./Portrait";

const moonImageNames = [
  "css-lgo.svg",
  "html-lgo.svg",
  "javascript-logo.svg",
  "next-js-logo.svg",
  "nodejs-logo.svg",
  "postgresql-logo.svg",
  "prisma-logo.svg",
  "react-logo.svg",
  "tailwind-logo.svg",
  "Typescript-logo.svg",
];

const Orbit = () => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [showAltImage, setShowAltImage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const onScroll = useCallback(() => {
    if (!ref.current) return;
    const { top, bottom } = ref.current.getBoundingClientRect();
    const center = (top + bottom) / 2;
    const oneQuarterWindowHeight = window.innerHeight / 4;
    const willShowAltImage =
      center > oneQuarterWindowHeight &&
      center < window.innerHeight - oneQuarterWindowHeight;
    if (isAnimating || showAltImage === willShowAltImage) return;
    setHasScrolled(true);
    setShowAltImage(willShowAltImage);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  }, [isAnimating, showAltImage]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    if (!isAnimating) onScroll();
  }, [isAnimating, onScroll]);

  return (
    <div
      className="flex items-center justify-center p-16 relative my-10"
      ref={ref}
    >
      {moonImageNames.map((imageName, index) => (
        <Moon
          index={index}
          key={imageName}
          imageName={imageName}
          total={moonImageNames.length}
          hasScrolled={hasScrolled}
          showAltImage={showAltImage}
        />
      ))}
      <Portrait hasScrolled={hasScrolled} showAltImage={showAltImage} />
    </div>
  );
};

export default Orbit;
