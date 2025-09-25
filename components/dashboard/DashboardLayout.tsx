"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-dashboard-bg">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-3 sm:px-6 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="md:hidden">
                <SidebarTrigger className="h-8 w-8" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                    CE
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-foreground hidden xs:block">
                  Campus Express
                </h1>
                <h1 className="text-lg sm:text-xl font-semibold text-foreground block xs:hidden">
                  CE
                </h1>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
              Login
            </Button>
          </header>
          <main className="flex-1 py-4 px-3 sm:py-6 sm:px-6 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
