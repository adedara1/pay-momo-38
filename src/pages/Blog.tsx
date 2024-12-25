import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  LayoutDashboard, 
  Package, 
  Image, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  RefreshCw,
  Settings,
  DollarSign,
  MessageSquare,
  Headphones,
  Signal,
  Globe,
  Palette,
  Power
} from "lucide-react";

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="hidden md:flex justify-center mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#9b87f5] text-white hover:bg-[#8a74f4] transition-colors">
            <Home className="w-5 h-5" />
            <span>Accueil</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px] p-2 space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 mb-2 border-b">
              <img
                src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
                alt="Logo"
                className="w-8 h-8"
              />
              <span className="font-semibold text-blue-600">Digit-Sarl</span>
            </div>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Home className="w-5 h-5" />
              <span>Accueil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <LayoutDashboard className="w-5 h-5" />
              <span>Tableau de bord</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Package className="w-5 h-5" />
              <span>Produit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Image className="w-5 h-5" />
              <span>Média</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <ShoppingCart className="w-5 h-5" />
              <span>Commandes</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <CreditCard className="w-5 h-5" />
              <span>Paiements</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Users className="w-5 h-5" />
              <span>Clients</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <RefreshCw className="w-5 h-5" />
              <span>Rembourser</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Settings className="w-5 h-5" />
              <span>Réglages</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <DollarSign className="w-5 h-5" />
              <span>Mon Argent</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <MessageSquare className="w-5 h-5" />
              <span>Avis</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Headphones className="w-5 h-5" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Signal className="w-5 h-5" />
              <span>Facebook Pixel</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Globe className="w-5 h-5" />
              <span>Mon Domaine</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <DollarSign className="w-5 h-5" />
              <span>Devise</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Palette className="w-5 h-5" />
              <span>Configuration thème</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100 text-red-600">
              <Power className="w-5 h-5" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Notre Blog</h1>
            <p className="text-gray-600">
              Découvrez nos derniers articles sur les paiements en ligne et l'e-commerce au Sénégal.
            </p>
          </div>
          
          <div className="order-first md:order-last">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="Blog Header"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Blog;