import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Box, 
  ShoppingCart, 
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
  { icon: Box, label: "Produits", path: "/products" },
  { icon: ShoppingCart, label: "Commandes", path: "/orders" },
  { icon: CreditCard, label: "Paiements", path: "/payments" },
  { icon: Settings, label: "Réglages", path: "/settings" },
];

const ProductsSidebar = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="hidden md:block w-64 min-h-screen border-r bg-background">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b">
          <img
            src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="font-semibold text-blue-600">Digit-Sarl</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
  );
};

export default ProductsSidebar;