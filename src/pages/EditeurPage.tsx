import { useState, useEffect } from "react";
import StyleControls from "@/components/StyleControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Upload, Save } from "lucide-react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Page {
  path: string;
  name: string;
  content: React.ReactNode;
}

const pages: Page[] = [
  {
    path: "/home",
    name: "Page d'accueil",
    content: <div>Contenu de la page d'accueil</div>
  },
  {
    path: "/products",
    name: "Page des produits",
    content: <div>Contenu de la page des produits</div>
  },
  {
    path: "/contact",
    name: "Page de contact",
    content: <div>Contenu de la page de contact</div>
  }
];

const EditeurPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [appName, setAppName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
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

  // Fetch app settings
  const { data: appSettings } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Update app name mutation
  const updateAppName = useMutation({
    mutationFn: async (newName: string) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ app_name: newName })
        .eq('id', appSettings?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
      toast({
        title: "Nom mis à jour",
        description: "Le nom de l'application a été mis à jour avec succès",
      });
      setIsEditingName(false);
    },
    onError: (error) => {
      console.error('Error updating app name:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du nom",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (appSettings) {
      setAppName(appSettings.app_name);
    }
  }, [appSettings]);

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

  const handleAppNameSave = () => {
    if (appName.trim()) {
      updateAppName.mutate(appName);
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="max-w-xs"
              placeholder="Nom de l'application"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAppNameSave}
              disabled={updateAppName.isPending}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{appName}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingName(true)}
            >
              Modifier
            </Button>
          </div>
        )}
      </div>

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