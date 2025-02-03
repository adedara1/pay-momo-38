import { useState, useEffect } from "react";
import StyleControls from "@/components/StyleControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Upload, Save, ImagePlus, Eye, EyeOff } from "lucide-react";
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

const EditeurPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [appName, setAppName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [supportEmbedUrl, setSupportEmbedUrl] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userId) {
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', userId)
          .maybeSingle();
        
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [userId]);

  const handleSaveEmbedUrl = async () => {
    if (!embedUrl || !userId) return;

    try {
      await supabase
        .from('embedded_urls')
        .update({ is_active: false })
        .eq('is_active', true);

      const { error } = await supabase
        .from('embedded_urls')
        .insert([
          {
            url: embedUrl,
            created_by: userId,
            is_active: true
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'URL a été enregistrée avec succès !",
        variant: "default",
      });
      
      queryClient.invalidateQueries({ queryKey: ['active-embedded-url'] });
      setEmbedUrl('');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'URL:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'URL",
        variant: "destructive",
      });
    }
  };

  const handleSaveSupportEmbedUrl = async () => {
    if (!supportEmbedUrl || !userId) return;

    try {
      await supabase
        .from('support_embedded_urls')
        .update({ is_active: false })
        .eq('is_active', true);

      const { error } = await supabase
        .from('support_embedded_urls')
        .insert([
          {
            url: supportEmbedUrl,
            created_by: userId,
            is_active: true
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'URL de support a été enregistrée avec succès !",
        variant: "default",
      });
      
      queryClient.invalidateQueries({ queryKey: ['active-support-embedded-url'] });
      setSupportEmbedUrl('');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'URL de support:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'URL de support",
        variant: "destructive",
      });
    }
  };

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

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      
      if (img.width !== 1584 || img.height !== 140) {
        toast({
          title: "Error",
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
          title: "Success",
          description: "Image de bannière mise à jour",
          variant: "default",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
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
        
        <ImagePlus className="w-5 h-5 text-blue-600" />
      </div>

      {isAdmin && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Visibilité des menus</h2>
          <div className="grid gap-4">
            {menuItems.map((item) => (
              <div key={item.route_path} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{item.menu_label}</span>
                <div className="flex gap-2">
                  <Button
                    variant={item.is_visible ? "outline" : "default"}
                    size="sm"
                    onClick={() => updateMenuVisibility(item.route_path, true)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Afficher
                  </Button>
                  <Button
                    variant={!item.is_visible ? "outline" : "default"}
                    size="sm"
                    onClick={() => updateMenuVisibility(item.route_path, false)}
                    className="flex items-center gap-2"
                  >
                    <EyeOff className="h-4 w-4" />
                    Masquer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
