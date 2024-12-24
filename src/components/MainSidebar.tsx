import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Image,
  Box,
  ShoppingCart,
  CreditCard,
  Users,
  RefreshCw,
  Settings,
  DollarSign,
  MessageSquare,
  Headphones,
  BarChart,
  Globe,
  Palette,
  Power,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: Image, label: "Média", path: "/media" },
  { icon: Box, label: "Produits", path: "/products" },
  { icon: ShoppingCart, label: "Commandes", path: "/orders" },
  { icon: CreditCard, label: "Paiements", path: "/payments" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: RefreshCw, label: "Rembourser", path: "/refunds" },
  { icon: Settings, label: "Réglages", path: "/settings" },
  { icon: DollarSign, label: "Mon Argent", path: "/money" },
  { icon: MessageSquare, label: "Avis", path: "/reviews" },
  { icon: Headphones, label: "Support", path: "/support" },
  { icon: BarChart, label: "Facebook Pixel", path: "/facebook-pixel" },
  { icon: Globe, label: "Mon Domaine", path: "/domain" },
  { icon: DollarSign, label: "Devise", path: "/currency" },
  { icon: Palette, label: "Configuration theme", path: "/theme" },
  { icon: Power, label: "Deconnexion", path: "/logout" },
];

const MainSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <Sidebar className="border-r border-gray-200 dark:border-gray-800">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
            <img
              src="/lovable-uploads/ece44648-5b4e-4397-bb44-63141b520b67.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="font-semibold">Ma Boutique</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  tooltip={isCollapsed ? item.label : undefined}
                >
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className={cn("flex-1", isCollapsed && "hidden")}>
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default MainSidebar;