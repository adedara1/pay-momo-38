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
import MarginControls from './MarginControls';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

const TextEditor = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const { toast } = useToast();

  // États pour les propriétés d'édition
  const [marginTop, setMarginTop] = useState(0);
  const [marginRight, setMarginRight] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [elementText, setElementText] = useState("");

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
    setSelectedElement(null);
    toast({
      title: "Page sélectionnée",
      description: `La page ${path} a été chargée pour édition.`,
    });
  };

  const handleElementSelect = (event: React.MouseEvent) => {
    if (event.target instanceof HTMLElement) {
      setSelectedElement(event.target);
      // Récupérer les styles actuels de l'élément
      const computedStyle = window.getComputedStyle(event.target);
      setMarginTop(parseInt(computedStyle.marginTop));
      setMarginRight(parseInt(computedStyle.marginRight));
      setMarginBottom(parseInt(computedStyle.marginBottom));
      setMarginLeft(parseInt(computedStyle.marginLeft));
      setFontSize(parseInt(computedStyle.fontSize));
      setLetterSpacing(parseInt(computedStyle.letterSpacing) || 0);
      setElementText(event.target.textContent || "");
      
      toast({
        title: "Élément sélectionné",
        description: `L'élément ${event.target.tagName.toLowerCase()} a été sélectionné pour édition.`,
      });
    }
  };

  const applyChangesToElement = () => {
    if (selectedElement) {
      selectedElement.style.marginTop = `${marginTop}px`;
      selectedElement.style.marginRight = `${marginRight}px`;
      selectedElement.style.marginBottom = `${marginBottom}px`;
      selectedElement.style.marginLeft = `${marginLeft}px`;
      selectedElement.style.fontSize = `${fontSize}px`;
      selectedElement.style.letterSpacing = `${letterSpacing}px`;
      selectedElement.textContent = elementText;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3">
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

      <div className="w-full md:w-1/3 space-y-6 bg-gray-50 p-4 rounded-lg">
        <div className="space-y-4">
          <h3 className="font-medium">Propriétés de l'élément</h3>
          
          <div className="space-y-2">
            <Label>Texte</Label>
            <Input
              value={elementText}
              onChange={(e) => setElementText(e.target.value)}
              placeholder="Entrez le texte..."
            />
          </div>

          <div className="space-y-2">
            <Label>Taille de police</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                min={8}
                max={72}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-right">{fontSize}px</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Espacement des lettres</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[letterSpacing]}
                onValueChange={(value) => setLetterSpacing(value[0])}
                min={-2}
                max={10}
                step={0.1}
                className="flex-1"
              />
              <span className="w-12 text-right">{letterSpacing}px</span>
            </div>
          </div>

          <MarginControls
            marginTop={marginTop}
            marginRight={marginRight}
            marginBottom={marginBottom}
            marginLeft={marginLeft}
            setMarginTop={setMarginTop}
            setMarginRight={setMarginRight}
            setMarginBottom={setMarginBottom}
            setMarginLeft={setMarginLeft}
          />
        </div>

        <Button 
          className="w-full"
          onClick={applyChangesToElement}
          disabled={!selectedElement}
        >
          Appliquer les modifications
        </Button>
      </div>
    </div>
  );
};

export default TextEditor;