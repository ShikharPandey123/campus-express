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

          <div className="flex-1 flex flex-col">
            <header className="h-16 bg-card border-b border-border flex items-center justify-between px-3 md:px-6">
              <div className="flex items-center gap-2">
                <div className="md:hidden">
                  <SidebarTrigger className="h-8 w-8 p-1 hover:bg-gray-100 rounded-md transition-colors" />
                </div>
                <Image
                  src="/CE-3.jpg"
                  alt="Campus Express Logo"
                  width={64}
                  height={64}
                  className="w-24 h-24 rounded-lg object-contain"
                  priority
                />
                {isDashboard && (
                  <h1 className="text-xl font-semibold text-foreground">Campus Express</h1>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Logout
              </Button>
            </header>

            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
