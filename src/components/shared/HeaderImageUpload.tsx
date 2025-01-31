import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const HeaderImageUpload = () => {
  const { toast } = useToast();
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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

      // First delete any existing header image for this user
      await supabase
        .from('header_images')
        .delete()
        .eq('user_id', user.id);

      // Then insert the new one
      const { error: dbError } = await supabase
        .from('header_images')
        .insert({
          user_id: user.id,
          image_url: publicUrl
        });

      if (dbError) {
        throw dbError;
      }

      setHeaderImageUrl(publicUrl);
      console.log('Header image saved:', publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

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