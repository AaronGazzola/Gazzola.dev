//-| File path: providers/Providers.tsx
"use client";
import { useGetAppData } from "@/app/page.hooks";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const AuthProvider = ({ children }: { children: ReactNode }) => {
  useGetAppData();
  return <>{children}</>;
};

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <SidebarProvider>{children}</SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
