import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const ProductForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const createProduct = async (e: React.FormEvent) => {
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
      // Get current user
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

      // Create payment link
      const { data: paymentLinkData, error: paymentLinkError } = await supabase.functions.invoke(
        "create-payment-link",
        {
          body: {
            amount: parseInt(amount),
            description: description || name,
            payment_type: "product"
          }
        }
      );

      if (paymentLinkError) throw paymentLinkError;

      // Create product with user_id
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          description,
          amount: parseInt(amount),
          image_url: imageUrl,
          user_id: user.id,
          payment_link_id: paymentLinkData.payment_link_id
        })
        .select()
        .single();

      if (productError) throw productError;
      
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès",
      });
      
      // Refresh lists
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["payment-links"] });
      
      setName("");
      setDescription("");
      setAmount("");
      setImage(null);
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={createProduct} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom du produit</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du produit"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du produit"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Minimum 200 FCFA"
            min="200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer le produit"}
        </Button>
      </form>
    </Card>
  );
};

export default ProductForm;