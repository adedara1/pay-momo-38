import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

export const HeaderImageUpload = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      setIsAdmin(!!adminUser);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Delete existing global header image if any
      const { error: deleteError } = await supabase
        .from('global_header_images')
        .delete();

      if (deleteError) {
        console.error('Error deleting existing header image:', deleteError);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `header-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('global_header_images')
        .insert({
          image_url: publicUrl
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Succès",
        description: "Image téléchargée avec succès",
      });

      // Reload the page to show the new image
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Échec du téléchargement de l'image",
        variant: "destructive",
      });
    }
  };

  // Only render the upload button if user is admin
  if (!isAdmin) {
    return null;
  }

  return (
    <label 
      htmlFor="header-image-upload" 
      className="absolute top-2 left-2 cursor-pointer hover:opacity-70 transition-opacity"
    >
      <ImagePlus className="w-5 h-5 text-blue-600" />
      <input
        id="header-image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </label>
  );
};