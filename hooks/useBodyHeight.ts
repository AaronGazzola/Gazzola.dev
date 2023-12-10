"useClient";
import { useEffect } from "react";
import useIsMounted from "./useIsMounted";

const useBodyHeight = () => {
  const isMounted = useIsMounted();
  useEffect(() => {
    if (!isMounted) return;
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    document.addEventListener("resize", setViewportHeight);
    return () => document.removeEventListener("resize", setViewportHeight);
  }, [isMounted]);
  return null;
};

export default useBodyHeight;
