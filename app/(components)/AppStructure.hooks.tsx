"use client";

import { useEffect, useState } from "react";
import { getBrowserAPI } from "@/lib/env.utils";
import { ScreenSize } from "./AppStructure.types";

export const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("lg");

  useEffect(() => {
    const window = getBrowserAPI(() => globalThis.window);
    if (!window) return;

    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("xs");
      else if (width < 768) setScreenSize("sm");
      else if (width < 1024) setScreenSize("md");
      else setScreenSize("lg");
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
};
