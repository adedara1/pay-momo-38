import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "./MobileSidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { menuItems } from "@/lib/menuItems";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

const MainSidebar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isPaymentPage = location.pathname.includes("/payment") || location.pathname === "/";

  if (isMobile) {
    return <MobileSidebar />;
  }

  if (isPaymentPage) {
    return null;
  }

  return (
    <div className="hidden md:flex justify-center mt-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#9b87f5] text-white hover:bg-[#8a74f4] transition-colors">
          <Home className="w-5 h-5" />
          <span>Accueil</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="center" 
          className="w-auto min-w-[200px] p-2"
        >
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                location.pathname === item.path 
                  ? "bg-[#0EA5E9] text-white" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MainSidebar;