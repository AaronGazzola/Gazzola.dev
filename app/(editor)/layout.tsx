"use client";

import Header from "@/app/(components)/Header";
import Sidebar from "@/app/(components)/Sidebar";
import Stars from "@/app/(components)/Stars";
import { useThemeStore } from "@/app/layout.stores";
import { cn } from "@/lib/tailwind.utils";

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
        <main className="w-full h-full bg-black">{children}</main>
      </div>
      <Stars />
    </div>
  );
};

export default AppLayout;
