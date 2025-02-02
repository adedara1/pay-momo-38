import {
  Home,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  MessageSquare,
  Headphones,
  BarChart,
  LogOut,
  Package,
  Wallet,
  RefreshCw,
  Menu,
  Cog,
  Beaker
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const checkIfAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: adminData } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return !!adminData;
};

export const menuItems = [
  { icon: Home, label: "Accueil", path: "/home" },
  {
    icon: Menu,
    label: "Menu Admin",
    path: "#",
    isAdminOnly: true,
    submenu: [
      { icon: Settings, label: "Réglages", path: "/settings" },
      { icon: Cog, label: "Configuration", path: "/configuration" },
    ]
  },
  { icon: Package, label: "Produit", path: "/blog" },
  { icon: ShoppingCart, label: "Commandes", path: "/orders" },
  { icon: CreditCard, label: "Transaction", path: "/transaction" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: Wallet, label: "Retraits", path: "/withdrawals" },
  { icon: RefreshCw, label: "Remboursements", path: "/refunds" },
  { icon: Headphones, label: "Support", path: "/support" },
  { icon: Beaker, label: "Créer Produit d'essai", path: "/try-productform" },
  { icon: Beaker, label: "Page de paiement d'essai", path: "/try" },
];

export const logoutMenuItem = {
  icon: LogOut,
  label: "Déconnexion",
  path: "/logout",
};