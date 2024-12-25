import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, Search, User } from "lucide-react";

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:ml-64">
      <div className="hidden md:flex justify-center mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#9b87f5] text-white hover:bg-[#8a74f4] transition-colors">
            <Home className="w-5 h-5" />
            <span>Accueil</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-[200px]">
            <DropdownMenuItem className="flex items-center gap-2 py-3 px-4 cursor-pointer bg-[#0EA5E9] text-white hover:bg-[#0284c7]">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 py-3 px-4 cursor-pointer bg-[#F97316] text-white hover:bg-[#ea580c]">
              <User className="w-5 h-5" />
              <span>Profile</span>
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