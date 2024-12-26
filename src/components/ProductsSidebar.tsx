import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Box, 
  ShoppingCart, 
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
  { icon: Box, label: "Produits", path: "/products" },
  { icon: ShoppingCart, label: "Commandes", path: "/orders" },
  { icon: CreditCard, label: "Paiements", path: "/payments" },
  { icon: Settings, label: "Réglages", path: "/settings" },
  { icon: LogOut, label: "Déconnexion", path: "/logout" },
];

const ProductsSidebar = () => {
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
      </div>
    </div>
  );
};

export default ProductsSidebar;