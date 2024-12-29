import React, { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const TextEditor = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const { toast } = useToast();

  const pages = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Settings", path: "/settings" },
    { name: "Blog", path: "/blog" },
    { name: "Payments", path: "/payments" },
    { name: "Orders", path: "/orders" },
    { name: "Clients", path: "/clients" },
    { name: "Withdrawals", path: "/withdrawals" },
    { name: "Refunds", path: "/refunds" },
  ];

  const handlePreviewClick = () => {
    window.open('https://preview--paydunya-bridge-46.lovable.app/pages-previews', '_blank');
  };

  const handlePageSelect = async (path: string) => {
    try {
      setSelectedPage(path);
      // Reset selected element when changing page
      setSelectedElement(null);
      
      toast({
        title: "Page chargée",
        description: `La page ${path} a été chargée avec succès`,
      });
    } catch (error) {
      console.error('Error loading page:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la page",
        variant: "destructive",
      });
    }
  };

  const handleElementClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.target instanceof HTMLElement) {
      setSelectedElement(event.target);
      console.log('Selected element:', event.target);
      
      toast({
        title: "Élément sélectionné",
        description: `Type: ${event.target.tagName.toLowerCase()}`,
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="ghost" 
          className="flex-1 bg-accent"
          onClick={handlePreviewClick}
        >
          Pages Previews
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex-1 flex items-center justify-between bg-accent"
            >
              Liste des pages
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            {pages.map((page) => (
              <DropdownMenuItem 
                key={page.path}
                onClick={() => handlePageSelect(page.path)}
              >
                {page.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1 bg-blue-500 p-1 rounded-t-md">
        <button className="p-1 hover:bg-blue-600 rounded">
          <Bold className="w-4 h-4 text-white" />
        </button>
        <button className="p-1 hover:bg-blue-600 rounded">
          <Italic className="w-4 h-4 text-white" />
        </button>
        <button className="p-1 hover:bg-blue-600 rounded">
          <Underline className="w-4 h-4 text-white" />
        </button>
        <button className="p-1 hover:bg-blue-600 rounded">
          <Strikethrough className="w-4 h-4 text-white" />
        </button>
      </div>

      {selectedPage ? (
        <div 
          className="w-full min-h-[500px] border rounded-b p-4 bg-white"
          onClick={handleElementClick}
        >
          <iframe
            src={selectedPage}
            className="w-full h-full border-0"
            title="Page Editor"
          />
        </div>
      ) : (
        <div className="w-full h-64 border rounded-b p-4 flex items-center justify-center text-gray-500">
          Sélectionnez une page à éditer
        </div>
      )}
    </div>
  );
};

export default TextEditor;