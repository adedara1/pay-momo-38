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
  const [productUrl, setProductUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Not authenticated");
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

      // Create payment link first
      const { data: paymentLinkData, error: paymentLinkError } = await supabase
        .from('payment_links')
        .insert({
          amount: parseInt(amount),
          description: description,
          payment_type: "product",
          user_id: session.user.id,
        })
        .select()
        .single();

      if (paymentLinkError) throw paymentLinkError;

      // Create product with payment link reference
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          description,
          amount: parseInt(amount),
          image_url: imageUrl,
          user_id: session.user.id,
          payment_link_id: paymentLinkData.id,
        })
        .select()
        .single();

      if (productError) throw productError;

      const productPageUrl = `${window.location.origin}/products/${productData.id}`;
      setProductUrl(productPageUrl);
      
      toast({
        title: "Produit créé",
        description: "La page de paiement a été créée avec succès",
      });
      
      // Copy product URL to clipboard
      await navigator.clipboard.writeText(productPageUrl);
      
      // Refresh both products and payment links lists
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
          <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image du produit</label>
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

        {productUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">URL de la page de paiement :</p>
            <p className="text-xs break-all text-blue-600">{productUrl}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => navigator.clipboard.writeText(productUrl)}
            >
              Copier l'URL
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default ProductForm;