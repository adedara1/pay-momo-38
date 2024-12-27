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
  LayoutDashboard,
  Package,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { createElement } from "react";

export const menuItems = [
  { icon: () => createElement(Home), label: "Accueil", href: "/home" },
  { icon: () => createElement(LayoutDashboard), label: "Tableau de bord", href: "/dashboard" },
  { icon: () => createElement(Package), label: "Produit", href: "/blog" },
  { icon: () => createElement(ShoppingCart), label: "Commandes", href: "/orders" },
  { icon: () => createElement(CreditCard), label: "Transaction", href: "/transaction" },
  { icon: () => createElement(Users), label: "Clients", href: "/clients" },
  { icon: () => createElement(Wallet), label: "Retraits", href: "/withdrawals" },
  { icon: () => createElement(RefreshCw), label: "Remboursements", href: "/refunds" },
  { icon: () => createElement(Settings), label: "Réglages", href: "/settings" },
  { icon: () => createElement(MessageSquare), label: "Avis", href: "/reviews" },
  { icon: () => createElement(Headphones), label: "Support", href: "/support" },
  { icon: () => createElement(BarChart), label: "Facebook Pixel", href: "/facebook-pixel" },
];

export const logoutMenuItem = {
  icon: () => createElement(LogOut),
  label: "Déconnexion",
  href: "/logout",
};