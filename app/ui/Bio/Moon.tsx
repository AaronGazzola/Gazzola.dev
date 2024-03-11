import clsx from "clsx";
import Image from "next/image";

const Moon = ({
  imageName,
  total,
  index,
  hasScrolled,
  showAltImage,
}: {
  imageName: string;
  total: number;
  index: number;
  hasScrolled: boolean;
  showAltImage: boolean;
}) => {
  return (
    <div
      className={clsx(
        "absolute origin-bottom-left h-1/2 left-1/2 top-0 rotate transition-opacity ease"
      )}
      style={{
        animationDelay: `-${index * (30 / total)}s`,
      }}
    >
      <div
        className={clsx(
          "transition-opacity ease relative",
          hasScrolled && showAltImage ? "opacity-100" : "opacity-0",
          imageName.includes("prisma") && "bg-gray-200 rounded-full"
        )}
        style={{
          transitionDuration: "0.5s",
          transitionDelay: `${
            (hasScrolled && showAltImage ? 1.5 : 0) + index * 0.1
          }s`,
        }}
      >
        <div
          className={clsx(
            imageName.includes("next")
              ? "bg-gray-200 rounded-full absolute inset-1"
              : ""
          )}
        />
        <Image
          className="w-8 h-8 rotate-reverse"
          style={{
            animationDelay: `-${index * (30 / total)}s`,
          }}
          src={`/${imageName}`}
          alt={imageName.replace("-logo.svg", "")}
          width={32}
          height={32}
        />
      </div>
    </div>
  );
};

export default Moon;
