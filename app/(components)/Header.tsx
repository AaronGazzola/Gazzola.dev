//-| File path: app/(components)/Header.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import configuration from "@/configuration";
import { getBrowserAPI } from "@/lib/env.utils";
import { cn } from "@/lib/tailwind.utils";
import { sourceCodePro } from "@/styles/fonts";
import clsx from "clsx";
import {
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Palette,
  Pause,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiYoutube } from "react-icons/si";
import { ScrollParallax } from "react-just-parallax";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CodeReviewDialog } from "../(editor)/CodeReviewDialog";
import { CollapseIcon } from "./CollapseIcon";
import {
  useAutoScroll,
  useHeaderCollapseOnScroll,
  useYouTubeSubscriberCount,
} from "./Header.hooks";
import { useHeaderStore } from "./Header.store";
import { testimonials } from "./Header.types";
import { TestimonialCard } from "./TestimonialCard";
import ThemeControlPanel from "./ThemeControlPanel";

const Header = () => {
  const { data: subscriberData, isLoading } = useYouTubeSubscriberCount();
  const { isExpanded, setIsExpanded } = useHeaderStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollContainerRef, 1, isExpanded);
  const [dialogOpen, setDialogOpen] = useQueryState("codeReview");
  const [swiperAutoplayEnabled, setSwiperAutoplayEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isGrowing, setIsGrowing] = useState(true);
  const swiperRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    useHeaderStore.persist.rehydrate();
  }, []);

  useHeaderCollapseOnScroll();

  const handleDialogOpenChange = (open: boolean | null) => {
    setDialogOpen(open ? "yesPlease" : null);
  };

  const startProgressBar = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setProgressWidth(isGrowing ? 0 : 100);
    const duration = 3000;
    const interval = 30;
    const increment = (interval / duration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgressWidth((prev) => {
        if (isGrowing) {
          const next = prev + increment;
          if (next >= 100) {
            return 100;
          }
          return next;
        } else {
          const next = prev - increment;
          if (next <= 0) {
            return 0;
          }
          return next;
        }
      });
    }, interval);
  }, [isGrowing]);

  const stopProgressBar = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgressWidth(0);
  };

  const handleSwiperInteraction = () => {
    setSwiperAutoplayEnabled(false);
    stopProgressBar();
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop();
    }
    setTimeout(() => {
      setSwiperAutoplayEnabled(true);
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.start();
        startProgressBar();
      }
    }, 10000);
  };

  const handleSlideChange = () => {
    setIsGrowing((prev) => !prev);
    if (swiperAutoplayEnabled && !isPaused) {
      startProgressBar();
    }
  };

  const handleChevronClick = (direction: "prev" | "next") => {
    if (direction === "prev") {
      swiperRef.current?.slidePrev();
    } else {
      swiperRef.current?.slideNext();
    }

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }

    setIsPaused(true);
    if (swiperRef.current?.autoplay) {
      swiperRef.current.autoplay.stop();
      stopProgressBar();
    }

    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.start();
        startProgressBar();
      }
    }, 3000);
  };

  const togglePause = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    if (isPaused) {
      setIsPaused(false);
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.start();
        startProgressBar();
      }
    } else {
      setIsPaused(true);
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.stop();
        stopProgressBar();
      }
    }
  };

  useEffect(() => {
    if (swiperRef.current && swiperAutoplayEnabled && !isPaused) {
      swiperRef.current.autoplay?.start();
      startProgressBar();
    } else {
      stopProgressBar();
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [swiperAutoplayEnabled, isPaused, startProgressBar]);

  return (
    <>
      <div
        className={clsx(
          sourceCodePro.className,
          "flex flex-col justify-between w-full items-center relative text-center overflow-y-hidden h-screen transition-[max-height]",
          !isExpanded
            ? "max-h-[100px] overflow-hidden"
            : "max-h-screen overflow-x-hidden"
        )}
      >
        <div className="absolute top-2.5 left-2.5 z-30">
          <Button
            variant="outline"
            className={cn(
              "text-gray-300 flex flex-col items-center  min-w-[100px] h-auto font-bold group"
            )}
            onClick={() =>
              getBrowserAPI(() => window)?.open(
                "https://www.youtube.com/@AzAnything/streams",
                "_blank"
              )
            }
          >
            <div className="relative h-3 w-8 mt-2 ">
              <SiYoutube className=" stroke-1 stroke-white fill-none group-hover:fill-orange-600 group-hover:stroke-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8" />
            </div>

            <div className={cn("items-center gap-1 pb-1 -mt-2 hidden xs:flex")}>
              <span className="">@AzAnything</span>
            </div>

            <div className={cn("items-center gap-1 -mt-6 hidden xs:flex")}>
              <span className="">Anyones:</span>
              <span className="">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  subscriberData?.subscriberCount?.toLocaleString() || "..."
                )}
              </span>
            </div>
            <div className={cn("text-base xs:hidden -mt-1 flex")}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                subscriberData?.subscriberCount?.toLocaleString() || "..."
              )}
            </div>
          </Button>
        </div>
        <div className="absolute top-3 right-3 md:top-6 md:right-6 z-30 flex gap-2">
          {!isExpanded && (
            <div className="md:flex hidden gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      <CollapseIcon className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Expand header</p>
                  </TooltipContent>
                </Tooltip>
                <Popover>
                  <Tooltip>
                    <PopoverTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-300"
                        >
                          <Palette className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="p-0">
                      <ThemeControlPanel />
                    </PopoverContent>
                    <TooltipContent>
                      <p>Theme options</p>
                    </TooltipContent>
                  </Tooltip>
                </Popover>
              </TooltipProvider>
            </div>
          )}
          <Link href={configuration.paths.about}>
            <Button variant="outline" className=" text-gray-300  font-bold">
              About
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {!isExpanded && (
          <div className="absolute bottom-2 right-3 z-30 flex md:hidden gap-2 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-gray-300"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <span>
                      <CollapseIcon className="w-5 h-5" />
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Expand header</p>
                </TooltipContent>
              </Tooltip>
              <Popover>
                <Tooltip>
                  <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="text-gray-300"
                      >
                        <span>
                          <Palette className="w-5 h-5" />
                        </span>
                      </Button>
                    </TooltipTrigger>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="p-0">
                    <ThemeControlPanel />
                  </PopoverContent>
                  <TooltipContent>
                    <p>Theme options</p>
                  </TooltipContent>
                </Tooltip>
              </Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-transparent bg-transparent text-gray-300 bg-black font-semibold flex items-center gap-2 text-sm px-3 !py-0 "
                      onClick={() => setDialogOpen("yesPlease")}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Apply for a free code review!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <div className="px-5 sm:px-10 ">
          <h1
            className={cn(
              "text-[40px] tracking-[1.1rem] text-center leading-[3rem]",
              isExpanded ? "mt-2" : "mt-0 sm:mt-2"
            )}
          >
            AI <br className="sm:hidden" /> TDD
          </h1>

          {isExpanded && (
            <h2 className="text-lg font-medium">
              Artificial Intelligence <br />
              Test Driven Development
            </h2>
          )}
          {!isExpanded && (
            <span className="hidden md:inline">
              <Button
                variant="outline"
                size="sm"
                className="border border-transparent bg-transparent text-gray-300 bg-black font-semibold flex items-center gap-2 text-sm px-3 !py-0 mt-1.5"
                onClick={() => setDialogOpen("yesPlease")}
              >
                <span className="hidden sm:inline">
                  Apply for a free code review
                </span>

                <CheckCircle className="w-4 h-4" />
              </Button>
            </span>
          )}
        </div>
        {isExpanded && (
          <>
            <div
              ref={scrollContainerRef}
              className="absolute inset-0 w-full overflow-x-auto overflow-y-hidden hide-scrollbar z-20 hidden md:block"
              style={{
                scrollBehavior: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div
                className="flex px-2 h-full relative"
                style={{ height: "100%" }}
              >
                {[...testimonials, ...testimonials].map(
                  (testimonial, index) => {
                    const yPositions = [
                      "30%",
                      "70%",
                      "42%",
                      "65%",
                      "35%",
                      "58%",
                      "48%",
                      "75%",
                      "38%",
                      "62%",
                      "52%",
                      "45%",
                    ];
                    const xGaps = [
                      "32px",
                      "56px",
                      "40px",
                      "64px",
                      "48px",
                      "44px",
                      "52px",
                      "36px",
                    ];
                    const parallaxStrengths = [
                      0.08, 0.12, 0.06, 0.15, 0.09, 0.11,
                    ];
                    const actualIndex = index % testimonials.length;
                    return (
                      <div
                        key={index}
                        className="flex-shrink-0"
                        style={{
                          marginRight: xGaps[index % xGaps.length],
                        }}
                      >
                        <ScrollParallax
                          strength={parallaxStrengths[actualIndex]}
                        >
                          <div
                            style={{
                              position: "relative",
                              top: yPositions[index % yPositions.length],
                              transform: "translateY(-50%)",
                            }}
                          >
                            <TestimonialCard testimonial={testimonial} />
                          </div>
                        </ScrollParallax>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="absolute inset-0 w-full z-20 md:hidden px-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 text-gray-300 hover:text-white"
                onClick={() => handleChevronClick("prev")}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  startProgressBar();
                }}
                onTouchStart={handleSwiperInteraction}
                onSlideChange={handleSlideChange}
                className="w-full h-full"
                style={{
                  overflow: "visible",
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide
                    key={index}
                    className="!flex !items-center !justify-center"
                    style={{ overflow: "visible", height: "100%" }}
                  >
                    <div className="max-w-sm mx-auto">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 text-gray-300 hover:text-white"
                onClick={() => handleChevronClick("next")}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            <div className="absolute bottom-32 left-0 right-0 z-40 md:hidden px-12 flex items-center gap-2">
              <div className="flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden shadow-lg">
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{
                    width: `${progressWidth}%`,
                    marginLeft: isGrowing ? "0" : "auto",
                  }}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300 hover:text-white flex-shrink-0"
                onClick={togglePause}
              >
                {isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="absolute bottom-7 left-0 right-0 z-20 flex justify-center">
              <Button
                variant="outline"
                className="border border-transparent bg-transparent text-gray-300 bg-black font-semibold flex items-center gap-4 text-xl px-8 py-6"
                onClick={() => setDialogOpen("yesPlease")}
              >
                <span className="hidden sm:inline">
                  Apply for a free code review
                </span>
                <span className="sm:hidden">Free code review</span>
                <CheckCircle className="w-6 h-6" />
              </Button>
            </div>

            <Image
              className="object-cover w-[150%] max-w-[1000px] mt-12"
              src="/Space suit bust portrait.png"
              alt="Space suit with programming code reflected in visor"
              width={2912}
              height={1664}
              quality={100}
              placeholder="blur"
              blurDataURL={headerImagePreloader}
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 z-10 bottom-vignette w-full max-w-[1000px]" />
          </>
        )}
      </div>
      <CodeReviewDialog
        open={!!dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </>
  );
};

const headerImagePreloader =
  " data:image/png;base64,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";

export default Header;
