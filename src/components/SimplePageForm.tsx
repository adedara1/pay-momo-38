import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const SimplePageForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageUrl, setPageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const createSimplePage = async (e: React.FormEvent) => {
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
            payment_type: "simple"
          }
        }
      );

      if (paymentLinkError) throw paymentLinkError;

      // Create simple page
      const { data: pageData, error: pageError } = await supabase
        .from('simple_pages')
        .insert({
          name,
          description,
          amount: parseInt(amount),
          image_url: imageUrl,
          payment_link_id: paymentLinkData.payment_link_id
        })
        .select()
        .single();

      if (pageError) throw pageError;

      const simplePageUrl = `${window.location.origin}/simple-pages/${pageData.id}`;
      setPageUrl(simplePageUrl);
      
      toast({
        title: "Page créée",
        description: "La page de paiement a été créée avec succès",
      });
      
      // Copy page URL to clipboard
      await navigator.clipboard.writeText(simplePageUrl);
      
      // Refresh lists
      queryClient.invalidateQueries({ queryKey: ["simple-pages"] });
      queryClient.invalidateQueries({ queryKey: ["payment-links"] });
      
      setName("");
      setDescription("");
      setAmount("");
      setImage(null);
    } catch (error) {
      console.error("Error creating simple page:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la page",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={createSimplePage} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom de la page</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la page"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la page"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
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
          {isLoading ? "Création..." : "Créer la page"}
        </Button>

        {pageUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">URL de la page de paiement :</p>
            <p className="text-xs break-all text-blue-600">{pageUrl}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => navigator.clipboard.writeText(pageUrl)}
            >
              Copier l'URL
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default SimplePageForm;