import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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

interface ElementEditorProps {
  onElementSelect: (element: HTMLElement) => void;
}

const ElementEditor = ({ onElementSelect }: ElementEditorProps) => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isPageEditorOpen, setIsPageEditorOpen] = useState(false);

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
    setIsPageEditorOpen(true);
  };

  const handleElementClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.target instanceof HTMLElement) {
      console.log("Element clicked:", event.target);
      onElementSelect(event.target);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center">
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

      <Dialog open={isPageEditorOpen} onOpenChange={setIsPageEditorOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] p-0">
          <div 
            className="w-full h-full overflow-auto p-4" 
            onClick={handleElementClick}
          >
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

export default ElementEditor;