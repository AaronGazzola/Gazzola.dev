import { useEffect, useState } from "react";

const useIsTest = () => {
  const [isCypressTest, setIsCypressTest] = useState(false);
  useEffect(() => {
    setIsCypressTest(
      typeof window !== "undefined" &&
        typeof (window as any).Cypress !== "undefined"
    );
  }, []);
  return isCypressTest;
};

export default useIsTest;
