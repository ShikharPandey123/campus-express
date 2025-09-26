"use client";

import { Home, Package, Archive, Users,Warehouse } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, roles: ["Admin", "Manager", "WarehouseStaff"] },
  { title: "Shipments", url: "/shipments", icon: Package, roles: ["Admin", "Manager", "WarehouseStaff"] },
  { title: "Inventory", url: "/inventory", icon: Archive, roles: ["Admin", "Manager", "WarehouseStaff"] },
  { title: "Warehouses", url: "/warehouses", icon: Warehouse, roles: ["Admin", "Manager", "WarehouseStaff"] },
  { title: "Users", url: "/users", icon: Users, roles: ["Admin", "Manager"] },
];

export function AppSidebar() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { user } = await res.json();
          setRole(user.role);
        }
      } catch {
        setRole(null);
      }
    };

    fetchUser();
  }, []);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    active
      ? "bg-blue-900 text-white hover:bg-blue-800 shadow-md"
      : "hover:bg-blue-50 text-gray-700 hover:text-blue-900 hover:shadow-sm";

  return (
    <Sidebar className="md:bg-white bg-white shadow-lg md:shadow-none">
      <SidebarContent className="bg-white border-r border-gray-200 md:bg-sidebar">
        <div className="p-4 border-b border-gray-200 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CE</span>
            </div>
            <h2 className="text-lg font-semibold text-blue-900">Campus Express</h2>
          </div>
        </div>
        <SidebarGroup className="px-2 py-4">
          <SidebarMenu className="space-y-2">
            {menuItems
              .filter((item) => role && item.roles.includes(role))
              .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url} 
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${getNavCls(isActive(item.url))}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
