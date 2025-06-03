"use client";
import Image from "next/image";
import { sourceCodePro } from "../styles/fonts";
import clsx from "clsx";
import {
  Swiper,
  SwiperClass,
  SwiperSlide,
  useSwiper,
  useSwiperSlide,
} from "swiper/react";
import { A11y } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import useIsMounted from "../hooks/useIsMounted";
import { Chevron, GithubLogo, OpenLinkIcon } from "./SVG";

enum Direction {
  Left,
  Right,
}

const slides = [
  {
    gif: "/rainbowofemotions.app.gif",
    title: "Rainbow of Emotions",
    liveLink: "https://rainbowofemotions.app/about",
    image: "/rainbow-screenshot.jpg",
    height: 300,
    width: 600,
  },
  {
    gif: "/email-editor.gif",
    title: "Loops Email Editor",
    liveLink: "https://loops.so",
    image: "/email-editor-screenshot.png",
    height: 338,
    width: 600,
  },
  {
    gif: "/questionnaire.gif",
    title: "Questionnaire",
    liveLink: "https://questionnaire-demo-six.vercel.app",
    image: "/questionnaire-screenshot.png",
    githubLink: "https://github.com/AaronGazzola/questionnaire-demo",
    height: 930,
    width: 1262,
  },
  {
    gif: "/apexapps.com.au.gif",
    title: "Apex Apps",
    githubLink: "https://github.com/AaronGazzola/ApexApps.com.au",
    liveLink: "https://apexapps.com.au",
    image: "/apex-screenshot.jpg",
    height: 375,
    width: 600,
  },
  {
    gif: "/generations-kampen.gif",
    title: "Generations Kampen",
    githubLink: "https://github.com/AaronGazzola/Generations-kampen",
    liveLink: "https://genapp.nangarra.games/",
    image: "/generations-kampen-screenshot.jpg",
    height: 300,
    width: 480,
  },
  {
    gif: "/origami.cool.gif",
    title: "Origami.Cool",
    githubLink: "https://github.com/AaronGazzola/Origami.cool",
    image: "/origami-screenshot.jpg",
    height: 375,
    width: 600,
  },
];

const Slider = () => {
  const isMounted = useIsMounted();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const onClickNext = (direction: Direction) => {
    if (!swiper) return;
    if (direction === Direction.Left) swiper.slidePrev();
    if (direction === Direction.Right) swiper.slideNext();
  };

  return (
    <div className="relative overflow-hidden h-[400px] sm:h-[550px] md:h-[600px] flex items-start justify-center ">
      <div className="absolute top-0 right-0 left-0 h-12 z-10 top-vignette" />
      <div className="absolute bottom-0 right-0 left-0  h-12 z-10 bottom-vignette" />
      <div className="absolute inset-0"></div>
      <div className="absolute inset-0 flex items-center justify-center select-none">
        <Swiper
          className={clsx(
            !isMounted && "opacity-0",
            "h-full max-w-[1200px] relative"
          )}
          modules={[A11y]}
          spaceBetween={0}
          slidesPerView={3}
          onSwiper={setSwiper}
          centerInsufficientSlides
          loop
        >
          <SliderButton onClick={onClickNext} direction={Direction.Left} />
          <SliderButton onClick={onClickNext} direction={Direction.Right} />
          {slides.map((slide, index) => {
            return (
              <SwiperSlide
                key={index}
                className={clsx("relative border border-transparent")}
              >
                <Slide
                  gif={slide.gif}
                  title={slide.title}
                  githubLink={slide.githubLink}
                  liveLink={slide.liveLink}
                  image={slide.image}
                  height={slide.height}
                  width={slide.width}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <Image
        className="object-cover h-full w-full blur-[2px]"
        src="/Astronaut code wall.png"
        alt="Astronaut floating cyberspace divider image"
        width={1456}
        height={832}
      />
    </div>
  );
};

const Slide = ({
  gif,
  image,
  title,
  githubLink,
  liveLink,
  height,
  width,
}: {
  gif: string;
  image: string;
  title: string;
  githubLink?: string;
  liveLink?: string;
  height: number;
  width: number;
}) => {
  const swiper = useSwiper();
  const slideRef = useRef<HTMLDivElement | null>(null);
  const slide = useSwiperSlide();
  const isActive = slide.isNext;
  const isPrev = slide.isActive;
  const isNext = !slide.isNext && !slide.isActive;
  const [pauseGif, setPauseGif] = useState(true);

  const onClickSlide = () => {
    if (isPrev) swiper.slidePrev();
    if (isNext) swiper.slideNext();
    if (isActive) setPauseGif((prev) => !prev);
  };

  useEffect(() => {
    setPauseGif(false);
    const slideElement = slideRef.current;
    if (!slideElement) return;
    const parentElement = slideElement.parentElement;
    if (!parentElement) return;
    parentElement.style.zIndex = isActive ? "10" : "0";
  }, [isActive]);

  return (
    <div
      onClick={onClickSlide}
      ref={slideRef}
      className={clsx(
        "absolute inset-0 flex items-center justify-center transition-all overflow-visible cursor-pointer",
        isActive
          ? "opacity-100 scale-[250%] md:scale-[225%] lg:scale-[175%]"
          : "opacity-70"
      )}
    >
      <div className="relative">
        {githubLink && (
          <a
            className={clsx(
              "absolute bottom-0.5 left-0.5 group",
              isActive ? "opacity-100" : "opacity-0"
            )}
            href={githubLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="relative w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6">
              <GithubLogo className="fill-gray-700 group-hover:fill-black absolute inset-0 w-full h-full z-10" />
              <div className="absolute rounded-full inset-px bg-white opacity-50 group-hover:opacity-100 -z10"></div>
            </div>
          </a>
        )}

        {liveLink && (
          <a
            className={clsx(
              "absolute bottom-0.5 right-0.5 group",
              isActive ? "opacity-100" : "opacity-0"
            )}
            href={liveLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="relative w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6">
              <OpenLinkIcon className="stroke-gray-700 group-hover:stroke-black absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 z-10" />
              <div className="absolute rounded-full inset-px bg-white opacity-50 group-hover:opacity-80 -z10"></div>
            </div>
          </a>
        )}

        <Image
          className="rounded"
          src={isActive && !pauseGif ? gif : image}
          width={width}
          height={height}
          alt={title}
          priority
        />
        <h1
          className={clsx(
            sourceCodePro.className,
            isActive ? "opacity-100" : "opacity-0",
            "text-shadow font-bold md:font-medium tracking-[0.7rem] text-[1.3rem] text-gray-50 absolute text-center whitespace-nowrap left-1/2 -translate-x-1/2 top-full scale-[25%] sm:scale-[40%] md:scale-[70%] lg:scale-100"
          )}
        >
          {title.toUpperCase()}
        </h1>
      </div>
    </div>
  );
};

const SliderButton = ({
  direction,
  onClick,
}: {
  direction: Direction;
  onClick: (direction: Direction) => void;
}) => {
  return (
    <div
      onClick={() => onClick(direction)}
      className={clsx(
        "absolute top-0 bottom-0 w-12 sm:w-24 z-50 group cursor-pointer overflow-visible",
        direction === Direction.Right ? "rotate-180 right-0" : "left-0"
      )}
    >
      <div className="absolute top-1/2 -translate-y-1/2 h-24 sm:h-48 w-12 sm:w-24 slider-left-vignette opacity-90 group-hover:opacity-100 "></div>
      <Chevron
        direction="left"
        className="h-[25px] w-auto absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-x-1/2 -translate-y-1/2 stroke-gray-800 group-hover:stroke-black"
      />
    </div>
  );
};

export default Slider;
