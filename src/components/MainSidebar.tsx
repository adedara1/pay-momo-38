import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Home,
  Package,
  FileText,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MainSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isCurrentRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      name: "Accueil",
      path: "/home",
      icon: Home,
    },
    {
      name: "Tableau de bord",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Produits",
      path: "/products",
      icon: Package,
    },
    {
      name: "Blog",
      path: "/blog",
      icon: FileText,
    },
  ];

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/lovable-uploads/d25517f4-6ffe-4b52-aa2f-d105b64c3170.png" />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">Digit-Sarl</h2>
              <p className="text-sm text-sidebar-foreground/60">Welcome Arnel Anael</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                isCurrentRoute(item.path)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MainSidebar;