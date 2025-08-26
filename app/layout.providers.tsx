//-| File path: app/(providers)/Providers.tsx
"use client";
import useScreenHeight from "@/app/(hooks)/useScreenHeight";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  useScreenHeight();
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <SidebarProvider>{children}</SidebarProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
};

export default Providers;
