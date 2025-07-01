//-| File path: app/(components)/Stars.tsx
"use client";

import { ScrollParallax } from "react-just-parallax";
import useIsMounted from "../(hooks)/useIsMounted";

// TOODO: Fix server conflict
const stars = [...new Array(500)].map(() => {
  return {
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: `${Math.random() * 8}px`,
    opacity: Math.random() * 0.6 + 0.1,
    color: ["#3B4CCA", "#7B6BFF", "#A3B3FF", "#D7E1FF", "#A600FF", "#2ae5fa"][
      Math.floor(Math.random() * 4)
    ],
  };
});

const Stars = () => {
  const isMounted = useIsMounted();
  if (!isMounted) return <></>;
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
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
