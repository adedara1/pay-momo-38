import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { menuItems } from "@/lib/menuItems";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const DesktopSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="relative">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
        
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0" : "w-64 opacity-100"
          )}
        >
          <Sidebar className="border-r border-gray-200 dark:border-gray-800">
            <SidebarHeader className="p-4">
              <div className={cn(
                "flex flex-col items-center gap-2 transition-opacity duration-300",
                isCollapsed ? "invisible" : "visible"
              )}>
                <div className="flex items-center gap-2">
                  <img
                    src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
                    alt="Logo"
                    className="h-8 w-8"
                  />
                  <span className="font-semibold text-blue-600">Digit-Sarl</span>
                </div>
                <span className="text-sm">Welcome Arnel Anael</span>
              </div>
            </SidebarHeader>
            <SidebarContent className="overflow-y-auto">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors",
                          location.pathname === item.path && "bg-gray-100 dark:bg-gray-800"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DesktopSidebar;