import { useState } from "react";
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
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: "Palanquin",
    letterSpacing: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  });

  const pages = [
    { name: "Dashboard", path: "/dashboard", content: (
      <div className="p-4">
        <h1>Dashboard</h1>
        <p>Ceci est un exemple de contenu éditable pour le dashboard.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2>Statistiques</h2>
            <p>Vos statistiques apparaîtront ici</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h2>Activité récente</h2>
            <p>Votre activité récente apparaîtra ici</p>
          </div>
        </div>
      </div>
    )},
    { name: "Blog", path: "/blog", content: (
      <div className="p-4">
        <h1>Blog</h1>
        <div className="space-y-4">
          <article className="p-4 bg-white rounded-lg shadow">
            <h2>Premier article</h2>
            <p>Contenu de l'article éditable ici.</p>
          </article>
          <article className="p-4 bg-white rounded-lg shadow">
            <h2>Deuxième article</h2>
            <p>Un autre contenu éditable pour le blog.</p>
          </article>
        </div>
      </div>
    )},
    { name: "Orders", path: "/orders", content: (
      <div className="p-4">
        <h1>Commandes</h1>
        <div className="mt-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2>Liste des commandes</h2>
            <div className="space-y-2">
              <div className="p-2 border rounded">Commande #1</div>
              <div className="p-2 border rounded">Commande #2</div>
              <div className="p-2 border rounded">Commande #3</div>
            </div>
          </div>
        </div>
      </div>
    )}
  ];

  const handleElementClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.target instanceof HTMLElement) {
      console.log("Élément sélectionné:", event.target);
      setSelectedElement(event.target);
      
      // Récupérer les styles actuels de l'élément
      const computedStyle = window.getComputedStyle(event.target);
      setStyles({
        fontSize: parseInt(computedStyle.fontSize) || 16,
        lineHeight: parseFloat(computedStyle.lineHeight) || 1.5,
        fontFamily: computedStyle.fontFamily || "Palanquin",
        letterSpacing: parseFloat(computedStyle.letterSpacing) || 0,
        marginTop: parseInt(computedStyle.marginTop) || 0,
        marginRight: parseInt(computedStyle.marginRight) || 0,
        marginBottom: parseInt(computedStyle.marginBottom) || 0,
        marginLeft: parseInt(computedStyle.marginLeft) || 0
      });
    }
  };

  const handleStyleChange = (newStyles: typeof styles) => {
    console.log("Application des nouveaux styles:", newStyles);
    setStyles(newStyles);
    
    if (selectedElement) {
      Object.assign(selectedElement.style, {
        fontSize: `${newStyles.fontSize}px`,
        lineHeight: `${newStyles.lineHeight}`,
        fontFamily: newStyles.fontFamily,
        letterSpacing: `${newStyles.letterSpacing}px`,
        marginTop: `${newStyles.marginTop}px`,
        marginRight: `${newStyles.marginRight}px`,
        marginBottom: `${newStyles.marginBottom}px`,
        marginLeft: `${newStyles.marginLeft}px`,
      });
    }
  };

  const selectedPageContent = pages.find(page => page.path === selectedPage)?.content;

  return (
    <div className="flex gap-4">
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
                  onClick={() => setSelectedPage(page.path)}
                >
                  {page.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedPage && (
          <div 
            className="w-full min-h-[600px] border rounded-lg overflow-auto bg-white"
            onClick={handleElementClick}
          >
            {selectedPageContent}
          </div>
        )}
      
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
