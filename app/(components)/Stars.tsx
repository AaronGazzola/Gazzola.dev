//-| File path: app/(components)/Stars.tsx
"use client";

import { useMemo } from "react";
import { ScrollParallax } from "react-just-parallax";
import { useBreakpoints } from "../(hooks)/use-media-query";
import useIsMounted from "../(hooks)/useIsMounted";
import { useThemeStore } from "../layout.stores";

const generateStars = (count: number, colors: string[], sizeMultiplier: number) => {
  return [...new Array(count)].map(() => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: `${Math.random() * sizeMultiplier}px`,
    opacity: Math.random() * 0.6 + 0.1,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

const Stars = ({
  smStars = 200,
  mdStars = 300,
  lgStars = 500,
}: {
  smStars?: number;
  mdStars?: number;
  lgStars?: number;
}) => {
  const isMounted = useIsMounted();
  const { isMd, isLg } = useBreakpoints();
  const { starNumber, starSize, starColors, starsEnabled } = useThemeStore();

  const calculateStarCount = (baseCount: number, percentage: number): number => {
    const low = baseCount * 0.25;
    const high = baseCount * 0.75;
    return Math.round(low + (percentage / 100) * (high - low));
  };

  const calculateSizeMultiplier = (percentage: number): number => {
    return 4 + (percentage / 100) * 156;
  };

  const stars = useMemo(() => {
    const sizeMultiplier = calculateSizeMultiplier(starSize);
    
    if (!isMd) {
      const count = calculateStarCount(smStars, starNumber);
      return generateStars(count, starColors, sizeMultiplier);
    }
    if (isMd && !isLg) {
      const count = calculateStarCount(mdStars, starNumber);
      return generateStars(count, starColors, sizeMultiplier);
    }
    const count = calculateStarCount(lgStars, starNumber);
    return generateStars(count, starColors, sizeMultiplier);
  }, [isMd, isLg, starNumber, starSize, starColors, smStars, mdStars, lgStars]);

  if (!isMounted || !starsEnabled) return <></>;

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {stars.map((star, i) => {
        const strength = (i / stars.length) * 0.2;
        return (
          <ScrollParallax isAbsolutelyPositioned strength={strength} key={i}>
            <div
              className=""
              style={{
                position: "absolute",
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                borderRadius: "50%",
                opacity: star.opacity,
              }}
            />
          </ScrollParallax>
        );
      })}
    </div>
  );
};

export default Stars;
