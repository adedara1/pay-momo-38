import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, LayoutDashboard, Box, ShoppingCart, CreditCard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
  { icon: Box, label: "Produits", path: "/products" },
  { icon: ShoppingCart, label: "Commandes", path: "/orders" },
  { icon: CreditCard, label: "Paiements", path: "/payments" },
  { icon: Settings, label: "Réglages", path: "/settings" },
];

const ProductsMobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-background shadow-md hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background md:hidden transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
                alt="Logo"
                className="w-8 h-8"
              />
              <span className="font-semibold text-blue-600">Digit-Sarl</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsMobileSidebar;