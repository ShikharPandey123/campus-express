"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-dashboard-bg">
          <AppSidebar />

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-2 sm:px-4 lg:px-6 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="md:hidden">
                  <SidebarTrigger className="h-8 w-8 p-1 hover:bg-gray-100 rounded-md transition-colors" />
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Image
                    src="/CE-3.jpg"
                    alt="Campus Express Logo"
                    width={48}
                    height={48}
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded-lg object-contain"
                    priority
                  />
                  {isDashboard && (
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground truncate">
                      Campus Express
                    </h1>
                  )}
                </div>
                <div className="sm:hidden">
                  <h1 className="text-sm font-semibold text-foreground truncate">Campus Express</h1>
                </div>
              </div>
              <Button
                className="bg-blue-900 hover:bg-blue-800 text-white shadow-sm text-xs sm:text-sm"
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Exit</span>
              </Button>
            </header>

            <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
              <div className="max-w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
