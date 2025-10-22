"use client";

import Header from "@/app/(components)/Header";
import Sidebar from "@/app/(components)/Sidebar";
import Stars from "@/app/(components)/Stars";
import { useThemeStore } from "@/app/layout.stores";
import { cn } from "@/lib/tailwind.utils";
import Footer from "./Footer";

import { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { headerIsCollapsed } = useThemeStore();
  return (
    <div className="relative">
      <Header />
      <div
        className={cn(
          "flex w-full h-screen relative overflow-hidden",
          headerIsCollapsed ? "h-[calc(100vh-100px)]" : "h-screen"
        )}
      >
        <Sidebar />
        <div className="w-full flex flex-col h-full">
          <main className="w-full flex-1 bg-black min-h-0">{children}</main>
          <Footer />
        </div>
      </div>
      <Stars />
    </div>
  );
};

export default AppLayout;
