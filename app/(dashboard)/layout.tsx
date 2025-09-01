import Header from "@/app/(components)/Header";
import Sidebar from "@/app/(components)/Sidebar";
import Stars from "@/app/(components)/Stars";

import { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <Header />
      <div className="flex w-full h-screen relative overflow-hidden">
        <Sidebar />
        <main className="w-full h-full bg-black">{children}</main>
      </div>
      <Stars />
    </div>
  );
};

export default AppLayout;
