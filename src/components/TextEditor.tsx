import React, { useState } from 'react';
import { Bold, Italic, Underline, Strikethrough, ChevronDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
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

const TextEditor = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isPageEditorOpen, setIsPageEditorOpen] = useState(false);
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

  const handlePageSelect = (path: string) => {
    setSelectedPage(path);
    toast({
      title: "Page sélectionnée",
      description: `La page ${path} a été chargée pour édition.`,
    });
  };

  const handleElementSelect = (event: React.MouseEvent) => {
    if (event.target instanceof HTMLElement) {
      setSelectedElement(event.target);
      toast({
        title: "Élément sélectionné",
        description: `L'élément ${event.target.tagName.toLowerCase()} a été sélectionné pour édition.`,
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
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
      
      <div className="w-full min-h-[500px] border rounded-b-md p-4 bg-white">
        {selectedPage ? (
          <div 
            className="w-full h-full" 
            onClick={handleElementSelect}
          >
            <iframe 
              src={selectedPage}
              className="w-full h-full border-0"
              title="Page Editor"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Sélectionnez une page à éditer
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;