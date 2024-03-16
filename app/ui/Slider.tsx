"use client";
import Image from "next/image";
import { sourceCodePro } from "../styles/fonts";
import clsx from "clsx";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import { useState } from "react";
import useIsMounted from "../hooks/useIsMounted";
import { Chevron } from "./SVG";

enum Direction {
  Left,
  Right,
}

const Slider = () => {
  const isMounted = useIsMounted();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  const onClickNext = (direction: Direction) => {
    if (!swiper) return;
    if (direction === Direction.Left) swiper.slidePrev();
    if (direction === Direction.Right) swiper.slideNext();
  };

  return (
    <div className="relative overflow-hidden max-h-[500px] flex items-start justify-center ">
      {/* <div className="absolute inset-0 bg-black z-10 opacity-20" /> */}
      <div className="absolute top-0 right-0 left-0 h-12 z-10 top-vignette" />
      <div className="absolute bottom-0 right-0 left-0  h-12 z-10 bottom-vignette" />
      <div className="absolute inset-0"></div>
      <div className="absolute inset-0 flex items-center justify-center select-none">
        <SliderButton onClick={onClickNext} direction={Direction.Left} />
        <SliderButton onClick={onClickNext} direction={Direction.Right} />

        <Swiper
          className={clsx(!isMounted && "opacity-0", "h-full")}
          modules={[A11y]}
          spaceBetween={0}
          slidesPerView={3}
          onSwiper={setSwiper}
          centerInsufficientSlides
          loop
        >
          <SwiperSlide className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center border">test1</div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="border relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center border">test2</div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="border relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center border">test3</div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="border relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center border">test4</div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="border relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center border">test5</div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <h1
        className={clsx(
          sourceCodePro.className,
          "tracking-[1.2rem] md:tracking-[2rem] text-white md:text-gray-300 text-[1.5rem] md:text-[2.5rem] absolute bottom-6 md:bottom-4 left-1 sm:left-5 right-0 text-shadow lg:text-center"
        )}
      >
        Portfolio
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
        className="h-[15%] w-auto absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-x-1/2 -translate-y-1/2 stroke-gray-800 group-hover:stroke-black"
      />
    </div>
  );
};

export default Slider;
