import clsx from "clsx";
import Image from "next/image";

const Moon = ({
  imageName,
  total,
  index,
}: {
  imageName: string;
  total: number;
  index: number;
}) => {
  return (
    <div
      className="absolute origin-bottom-left h-1/2 left-1/2 top-0 rotate"
      style={{
        animationDelay: `-${index * (30 / total)}s`,
      }}
    >
      <div
        className={clsx(
          "relative",
          imageName.includes("prisma") && "bg-gray-200 rounded-full"
        )}
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
