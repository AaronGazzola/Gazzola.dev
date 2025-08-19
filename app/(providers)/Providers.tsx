//-| File path: app/(providers)/Providers.tsx
"use client";
import { useGetContracts } from "@/app/(components)/EditContractDialog.hooks";
import OnboardingDialog from "@/app/(components)/OnboardingDialog";
import { useGetAppData } from "@/app/(hooks)/app.hooks";
import { useGetConversations } from "@/app/chat/(components)/ChatWindow.hooks";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const QueryHookProvider = ({ children }: { children: ReactNode }) => {
  useGetAppData();
  useGetConversations();
  useGetContracts();
  return <>{children}</>;
};

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <QueryHookProvider>
          <Toaster />
          <OnboardingDialog />
          <SidebarProvider>{children}</SidebarProvider>
        </QueryHookProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
};

export default Providers;
