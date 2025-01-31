import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  ShoppingBag,
  Users,
  Wallet,
  ArrowLeftRight,
  Link,
  FileCode,
  Menu
} from "lucide-react";

export const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Tableau de bord",
    path: "/home"
  },
  {
    icon: ShoppingBag,
    label: "Produits",
    path: "/products"
  },
  {
    icon: Link,
    label: "Liens de paiement",
    path: "/payment-links"
  },
  {
    icon: FileText,
    label: "Pages simples",
    path: "/simple-pages"
  },
  {
    icon: ArrowLeftRight,
    label: "Transactions",
    path: "/transactions"
  },
  {
    icon: Wallet,
    label: "Retraits",
    path: "/withdrawals"
  },
  {
    icon: Users,
    label: "Menu Admin",
    path: "/admin",
    submenu: [
      {
        icon: Users,
        label: "Utilisateurs",
        path: "/admin/users"
      },
      {
        icon: FileCode,
        label: "Données",
        path: "/admin/data"
      }
    ]
  },
  {
    icon: Settings,
    label: "Configuration",
    path: "/configuration"
  }
];

export const logoutMenuItem = {
  icon: LogOut,
  label: "Déconnexion",
  path: "/logout"
};