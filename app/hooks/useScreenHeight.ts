import { useEffect } from "react";
import useIsMounted from "./useIsMounted";

const useScreenHeight = () => {
  const isMounted = useIsMounted();
  useEffect(() => {
    if (!isMounted) return;
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    return () => window.removeEventListener("resize", setViewportHeight);
  }, [isMounted]);
  return null;
};

export default useScreenHeight;
