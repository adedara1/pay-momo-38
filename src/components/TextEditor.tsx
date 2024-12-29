import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

  const handlePageSelect = (path: string) => {
    setSelectedPage(path);
    setIsPageEditorOpen(true);
  };

  const handleElementSelect = (event: React.MouseEvent) => {
    if (event.target instanceof HTMLElement) {
      setSelectedElement(event.target);
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
      
      <textarea className="w-full h-64 p-2 border rounded" placeholder="Écrivez votre texte ici..."></textarea>

      <Dialog open={isPageEditorOpen} onOpenChange={setIsPageEditorOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] p-0">
          <div className="w-full h-full overflow-auto p-4" onClick={handleElementSelect}>
            <iframe 
              src={selectedPage ? selectedPage : ''} 
              className="w-full h-full border-0"
              title="Page Editor"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TextEditor;