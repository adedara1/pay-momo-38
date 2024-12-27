import {
  Home,
  Image,
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
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";

export const menuItems = [
  { icon: Home, label: "Accueil", path: "/home" },
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
  { icon: Package, label: "Produit", path: "/product" },
  { icon: Image, label: "Média", path: "/media" },
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
];

export const logoutMenuItem = {
  icon: LogOut,
  label: "Déconnexion",
  path: "/logout",
};