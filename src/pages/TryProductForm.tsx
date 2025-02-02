import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PriceInput } from "@/components/PriceInput";
import { ProductImageInput } from "@/components/product/ProductImageInput";
import { ProductBasicInfo } from "@/components/product/ProductBasicInfo";

const TryProductForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("XOF");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const createTrialProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseInt(amount) < 200) {
      toast({
        title: "Montant invalide",
        description: "Le montant minimum est de 200 FCFA",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Utilisateur non authentifié");
      }

      let imageUrl = null;
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const { data: productData, error: productError } = await supabase
        .from('trial_products')
        .insert({
          name,
          description,
          amount: parseInt(amount),
          image_url: imageUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (productError) throw productError;
      
      toast({
        title: "Produit d'essai créé",
        description: "Le produit d'essai a été créé avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ["trial-products"] });
      
      // Reset form
      setName("");
      setDescription("");
      setAmount("");
      setImage(null);
    } catch (error) {
      console.error("Error creating trial product:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit d'essai",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={createTrialProduct} className="space-y-4">
        <ProductBasicInfo
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
        />

        <PriceInput
          currency={currency}
          setCurrency={setCurrency}
          amount={amount}
          setAmount={setAmount}
        />

        <ProductImageInput
          handleImageChange={handleImageChange}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer le produit d'essai"}
        </Button>
      </form>
    </Card>
  );
};

export default TryProductForm;