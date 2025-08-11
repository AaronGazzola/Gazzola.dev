//-| File path: app/(components)/Header.tsx
"use client";
import { useAuthStore } from "@/app/(stores)/auth.store";
import { Button } from "@/components/ui/button";
import configuration from "@/configuration";
import { sourceCodePro } from "@/styles/fonts";
import clsx from "clsx";
import { Clock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiYoutube } from "react-icons/si";
import { ScrollParallax } from "react-just-parallax";
import { useYouTubeSubscriberCount } from "./Header.hooks";
import { JobSuccessIcon, TopRatedIcon } from "./SVG";

const Header = () => {
  const { user } = useAuthStore();
  const { data: subscriberData, isLoading } = useYouTubeSubscriberCount();

  if (!!user) return null;
  return (
    <div
      className={clsx(
        sourceCodePro.className,
        "flex flex-col justify-between w-full items-center relative overflow-hidden text-center h-screen "
      )}
    >
      <Button
        variant="outline"
        className="absolute top-6 left-6 z-30 border-gray-400 text-gray-300 bg-transparent hover:bg-gray-800 rounded flex flex-col items-center p-3 min-w-[100px] h-auto font-bold group"
        onClick={() =>
          window.open("https://www.youtube.com/@AzAnything/streams", "_blank")
        }
      >
        <SiYoutube
          style={{ width: 30, height: 30 }}
          className="w-36 h-36 stroke-1 stroke-white fill-none group-hover:fill-orange-600 group-hover:stroke-none"
        />
        <div className="flex items-center gap-1 mb-1">
          <span className="">@AzAnything</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="">Subs:</span>
          <span className="">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              subscriberData?.subscriberCount?.toLocaleString() || "..."
            )}
          </span>
        </div>
      </Button>
      <Link
        href={configuration.paths.about}
        className="absolute top-6 right-6 z-30"
      >
        <Button
          variant="outline"
          className="border-gray-400 bg-transparent text-gray-300 hover:bg-gray-800 rounded font-bold"
        >
          About
        </Button>
      </Link>
      <div className="px-5 sm:px-10">
        <h1 className="text-[40px] tracking-[1.1rem] text-center my-4 leading-[3rem]">
          AARON GAZZOLA
        </h1>
        <h2 className="text-lg font-medium">Full Stack Vibe Lead</h2>
        <h3 className="text-lg font-medium">
          Typescript + Next.js + PostgresSQL
        </h3>
      </div>
      <ScrollParallax isAbsolutelyPositioned>
        <div className="absolute top-[60%] sm:top-[40%] left-2/3 z-20 bg-black -translate-x-1/2 p-2 rounded-lg shadow shadow-gray-500 whitespace-nowrap flex items-center">
          <TopRatedIcon
            className="w-7 h-7 mr-1.5"
            path1ClassName="fill-gray-900 stroke-white"
            path2ClassName="stroke-white"
          />
          Top Rated Plus
        </div>
      </ScrollParallax>
      <ScrollParallax isAbsolutelyPositioned>
        <div className="absolute top-[45%] sm:top-[30%] left-1/3 z-20 bg-black p-2 rounded-lg shadow shadow-gray-500 -translate-x-1/2 whitespace-nowrap space-x-10 flex items-center">
          <div className="border rounded-full p-0.5 mr-1.5 bg-gray-900">
            <JobSuccessIcon className="w-5 h-5" path1ClassName="stroke-white" />
          </div>
          100% Job Success
        </div>
      </ScrollParallax>
      <ScrollParallax isAbsolutelyPositioned>
        <div className="absolute top-[80%] sm:top-[70%] left-[40%] z-20 bg-black -translate-x-1/2 p-2 rounded-lg shadow shadow-gray-500 whitespace-nowrap flex items-center">
          <Clock className="w-7 h-7 mr-1.5 stroke-[1px]" />6 years of experience
        </div>
      </ScrollParallax>

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
    </div>
  );
};

const headerImagePreloader =
  " data:image/png;base64,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";

export default Header;
