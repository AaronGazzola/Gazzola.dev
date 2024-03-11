"use client";

import { useEffect, useState } from "react";
import useIsMounted from "../hooks/useIsMounted";

// TOODO: Fix server conflict
const stars = [...new Array(400)].map(() => {
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
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    if (!isMounted) return;

    const onScroll = (e: Event) => {
      setScrollPercentage((window.scrollY / document.body.scrollHeight) * 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isMounted]);
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      {stars.map((star, i) => {
        const range = Math.floor(i / 50) + 1;
        return (
          <div
            className=""
            key={i}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              borderRadius: "50%",
              opacity: star.opacity,
              transform: `translateY(${scrollPercentage * 20 * range}%)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Stars;
