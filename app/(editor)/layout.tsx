"use client";

import Header from "@/app/(components)/Header";
import Sidebar from "@/app/(components)/Sidebar";
import Stars from "@/app/(components)/Stars";
import { useHeaderStore } from "@/app/(components)/Header.store";
import { cn } from "@/lib/tailwind.utils";
import Footer from "./Footer";

import { ReactNode, Suspense } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { isExpanded } = useHeaderStore();
  return (
    <div className="relative">
      <Header />
      <div
        className={cn(
          "flex w-full relative overflow-hidden",
          isExpanded ? "h-screen" : "h-[calc(100vh-100px)]"
        )}
      >
        <Sidebar />
        <div className="w-full flex flex-col h-full">
          <main className="w-full flex-1 bg-black min-h-0">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </div>
      </div>
      <Stars />
    </div>
  );
};

export default AppLayout;
