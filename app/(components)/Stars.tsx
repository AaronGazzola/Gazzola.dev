//-| File path: app/(components)/Stars.tsx
"use client";

import { ScrollParallax } from "react-just-parallax";
import { useMemo } from "react";
import useIsMounted from "../(hooks)/useIsMounted";
import { useBreakpoints } from "../(hooks)/use-media-query";

const generateStars = (count: number) => {
  return [...new Array(count)].map(() => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: `${Math.random() * 8}px`,
    opacity: Math.random() * 0.6 + 0.1,
    color: ["#3B4CCA", "#7B6BFF", "#A3B3FF", "#D7E1FF", "#A600FF", "#2ae5fa"][
      Math.floor(Math.random() * 6)
    ],
  }));
};

const Stars = () => {
  const isMounted = useIsMounted();
  const { isMd, isLg } = useBreakpoints();
  
  const stars = useMemo(() => {
    if (!isMd) return generateStars(200);
    if (isMd && !isLg) return generateStars(300);
    return generateStars(500);
  }, [isMd, isLg]);

  if (!isMounted) return <></>;
  
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
