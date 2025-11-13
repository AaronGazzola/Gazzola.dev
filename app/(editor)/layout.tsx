"use client";

import Header from "@/app/(components)/Header";
import { useHeaderStore } from "@/app/(components)/Header.store";
import Sidebar from "@/app/(components)/Sidebar";
import Stars from "@/app/(components)/Stars";
import { conditionalLog } from "@/lib/log.util";
import { cn } from "@/lib/tailwind.utils";
import { useEditorStore } from "./layout.stores";

import { ReactNode, Suspense, useEffect } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { isExpanded } = useHeaderStore();
  const { generateCodeFiles } = useEditorStore();

  useEffect(() => {
    conditionalLog(
      { message: "Layout mounted, generating code files" },
      { label: "code-files" }
    );
    generateCodeFiles();
  }, [generateCodeFiles]);

  return (
    <div className="relative">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <div
        className={cn(
          "flex w-full relative overflow-hidden",
          "h-[calc(100vh-100px)]"
        )}
      >
        <Sidebar />
        <div className="w-full max-w-full flex flex-col h-full overflow-hidden">
          <main className="w-full max-w-full flex-1 bg-black min-h-0 overflow-hidden">{children}</main>
        </div>
      </div>
      <Stars />
    </div>
  );
};

export default AppLayout;
