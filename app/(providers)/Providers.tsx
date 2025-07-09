//-| File path: app/(providers)/Providers.tsx
"use client";
import OnboardingDialog from "@/app/(components)/OnboardingDialog";
import { useGetAppData } from "@/app/(hooks)/app.hooks";
import { useGetContracts } from "@/app/(components)/ContractDialog.hooks";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const QueryHookProvider = ({ children }: { children: ReactNode }) => {
  useGetAppData();
  useGetContracts();
  return <>{children}</>;
};

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryHookProvider>
        <Toaster />
        <OnboardingDialog />
        <SidebarProvider>{children}</SidebarProvider>
      </QueryHookProvider>
    </QueryClientProvider>
  );
};

export default Providers;
