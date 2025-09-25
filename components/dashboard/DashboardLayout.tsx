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
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {/* Sidebar trigger only on mobile */}
              <div className="lg:hidden">
                <SidebarTrigger />
              </div>

              {/* Logo + Title */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    CE
                  </span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  Campus Express
                </h1>
              </div>
            </div>

            {/* Right Side */}
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </header>

          {/* Page Content */}
          {/* ✅ Removed ALL left padding to sit flush with sidebar */}
          <main className="flex-1 py-6 pr-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
