//-| File path: providers/Providers.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { useGetAuth } from "@/hooks/auth.hooks";

const queryClient = new QueryClient();

const AuthProvider = ({ children }: { children: ReactNode }) => {
  useGetAuth();
  return <>{children}</>;
};

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
