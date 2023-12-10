"use client";
import useBodyHeight from "@/hooks/useBodyHeight";
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundImage from "./BackgroundImage";
import { LayoutContextProvider } from "@/context/LayoutContext";

const Layout = ({ children }: { children: ReactNode }) => {
  useBodyHeight();
  return (
    <LayoutContextProvider>
      <Header />
      {children}
      <Footer />
      <BackgroundImage />
    </LayoutContextProvider>
  );
};

export default Layout;
