//-| File path: app/page.tsx
import Sidebar from "@/app/(components)/Sidebar";
import { Button } from "@/components/ui/button";
import configuration from "@/configuration";
import { cn } from "@/lib/tailwind.utils";
import { sourceCodePro } from "@/styles/fonts";
import { Rocket } from "lucide-react";
import Link from "next/link";
import Header from "./(components)/Header";
import Stars from "./(components)/Stars";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <div className="flex w-full h-screen relative overflow-hidden">
        <Sidebar />
        <div
          style={{
            borderRadius: ".5rem",
          }}
          className={cn(
            "overflow-y-auto overflow-x-hidden absolute left-1/2 top-1/2 max-w-xl w-full max-h-[calc(100vh-32px)] -translate-x-1/2 -translate-y-1/2 z-50 grid gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            "bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-[1px]"
          )}
        >
          <div
            className="bg-black border-transparent p-5 px-6 flex flex-col gap-4"
            style={{
              borderRadius: ".5rem",
            }}
          >
            <h1 className="text-2xl font-medium">Coming Soon</h1>
            <div className="space-y-5 my-2">
              <p className="text-center text-muted-foreground">
                This feature is currently in development. Stay tuned for
                updates!
              </p>
            </div>
            <div className="pt-2">
              <Link href={configuration.paths.about}>
                <div className="rounded group bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-green-500/50 p-[1px] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  <Button
                    type="submit"
                    className={cn(
                      "w-full rounded font-normal relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed text-lg border border-transparent transition-all text-white bg-black/70 hover:bg-black/50",
                      sourceCodePro.className
                    )}
                  >
                    <span className="flex items-center justify-center gap-2 transition-all duration-300 uppercase">
                      Learn More
                      <Rocket className="w-5 h-5 opacity-100 translate-x-0 group-hover:scale-110 transition-all duration-300" />
                    </span>
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Stars />
    </main>
  );
}
