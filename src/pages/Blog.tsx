import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { menuItems } from "@/lib/menuItems";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="hidden md:flex justify-center mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#9b87f5] text-white hover:bg-[#8a74f4] transition-colors">
            <Home className="w-5 h-5" />
            <span>Accueil</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px] p-2">
            <div className="flex items-center gap-2 px-3 py-2 mb-2 border-b">
              <img
                src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
                alt="Logo"
                className="w-8 h-8"
              />
              <span className="font-semibold text-blue-600">Digit-Sarl</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                >
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
            </div>
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