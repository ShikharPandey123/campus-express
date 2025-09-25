"use client";

import { Home, Package, Archive, Users, Building2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Shipments", url: "/shipments", icon: Package },
  { title: "Inventory", url: "/inventory", icon: Archive },
  { title: "Warehouses", url: "/warehouses", icon: Building2 },
  { title: "Users", url: "/users", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/dashboard" ? pathname === path : pathname.startsWith(path);

  const getNavCls = (active: boolean) =>
    active
      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
      : "hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]";

  return (
    <Sidebar 
      className="border-r" 
      collapsible="offcanvas"
      variant="sidebar"
    >
      <SidebarContent className="bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]">
        <SidebarGroup className="pt-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="default">
                    <Link
                      href={item.url}
                      className={`${getNavCls(isActive(item.url))} h-8 text-sm`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
