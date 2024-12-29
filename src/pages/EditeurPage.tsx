import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StyleControls from "@/components/StyleControls";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EditeurPage = () => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [styles, setStyles] = useState({
    fontSize: 20,
    lineHeight: 45,
    fontFamily: "Palanquin",
    letterSpacing: 1,
    marginTop: 44,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  });

  const pages = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Blog", path: "/blog" },
    { name: "Orders", path: "/orders" },
    { name: "Clients", path: "/clients" },
    { name: "Withdrawals", path: "/withdrawals" },
    { name: "Refunds", path: "/refunds" },
  ];

  const handleElementClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.target instanceof HTMLElement) {
      console.log("Element clicked:", event.target);
      setSelectedElement(event.target);
      
      // Récupérer les styles actuels de l'élément
      const computedStyle = window.getComputedStyle(event.target);
      setStyles({
        fontSize: parseInt(computedStyle.fontSize) || 20,
        lineHeight: parseInt(computedStyle.lineHeight) || 45,
        fontFamily: computedStyle.fontFamily || "Palanquin",
        letterSpacing: parseFloat(computedStyle.letterSpacing) || 1,
        marginTop: parseInt(computedStyle.marginTop) || 44,
        marginRight: parseInt(computedStyle.marginRight) || 0,
        marginBottom: parseInt(computedStyle.marginBottom) || 0,
        marginLeft: parseInt(computedStyle.marginLeft) || 0
      });
    }
  };

  const handleStyleChange = (newStyles: typeof styles) => {
    console.log("Applying new styles:", newStyles);
    setStyles(newStyles);
    
    if (selectedElement) {
      Object.assign(selectedElement.style, {
        fontSize: `${newStyles.fontSize}px`,
        lineHeight: `${newStyles.lineHeight}px`,
        fontFamily: newStyles.fontFamily,
        letterSpacing: `${newStyles.letterSpacing}px`,
        marginTop: `${newStyles.marginTop}px`,
        marginRight: `${newStyles.marginRight}px`,
        marginBottom: `${newStyles.marginBottom}px`,
        marginLeft: `${newStyles.marginLeft}px`,
      });
    }
  };

  const loadPageContent = (path: string) => {
    // Charger le contenu de la page sélectionnée dans l'éditeur
    fetch(path)
      .then(response => response.text())
      .then(html => {
        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
          editorContainer.innerHTML = html;
          // Ajouter les écouteurs d'événements pour la sélection
          const elements = editorContainer.getElementsByTagName('*');
          Array.from(elements).forEach(element => {
            element.addEventListener('click', handleElementClick as any);
          });
        }
      })
      .catch(error => console.error('Error loading page:', error));
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center">
                {selectedPage ? pages.find(p => p.path === selectedPage)?.name : "Liste des pages"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {pages.map((page) => (
                <DropdownMenuItem 
                  key={page.path}
                  onClick={() => {
                    setSelectedPage(page.path);
                    loadPageContent(page.path);
                  }}
                >
                  {page.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedPage && (
          <div 
            id="editor-container"
            className="w-full min-h-[600px] border rounded-lg overflow-auto bg-white p-4" 
          />
        )}
      </div>
      
      <div className="w-80">
        <StyleControls 
          styles={styles}
          onStyleChange={handleStyleChange}
          disabled={!selectedElement}
        />
      </div>
    </div>
  );
};

export default EditeurPage;