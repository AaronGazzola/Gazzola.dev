import { Suspense } from "react";
import PageRedirectWrapper from "./page.redirect-wrapper";

const Page = () => {
  return (
    <Suspense fallback={null}>
      <PageRedirectWrapper />
    </Suspense>
  );
};

export default Page;
