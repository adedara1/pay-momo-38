import { useState } from "react";
import StyleControls from "@/components/StyleControls";
import { Button } from "@/components/ui/button";
import { ChevronDown, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EditeurPage = () => {
  const { toast } = useToast();
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a new image object to check dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      
      if (img.width !== 1584 || img.height !== 140) {
        toast({
          title: "Erreur",
          description: "L'image doit être exactement de 1584x140 pixels",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('banner_images')
          .insert({
            image_url: publicUrl,
          });

        if (dbError) throw dbError;

        toast({
          title: "Succès",
          description: "Image de bannière mise à jour",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Erreur",
          description: "Échec du téléchargement de l'image",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    img.src = objectUrl;
  };

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
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour l'image de bannière</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">L'image doit être exactement de 1584x140 pixels</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {isUploading && <p className="text-sm text-gray-500">Téléchargement en cours...</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default EditeurPage;