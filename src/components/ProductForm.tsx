import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PriceInput } from "./PriceInput";
import { PriceCalculator } from "./PriceCalculator";
import { ProductImageInput } from "./product/ProductImageInput";
import { ProductBasicInfo } from "./product/ProductBasicInfo";
import { RedirectUrlInput } from "./product/RedirectUrlInput";

const ProductForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("XOF");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feePercentage, setFeePercentage] = useState(0);
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: settings, error } = await supabase
          .from('settings')
          .select('product_fee_percentage')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }
        
        if (settings) {
          setFeePercentage(settings.product_fee_percentage);
        } else {
          const { error: insertError } = await supabase
            .from('settings')
            .insert({
              user_id: user.id,
              product_fee_percentage: 0
            });
          
          if (insertError) {
            console.error('Error creating default settings:', insertError);
          }
        }
      } catch (error) {
        console.error('Error in fetchSettings:', error);
      }
    };
    
    fetchSettings();
  }, []);

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

      const finalAmount = amount ? parseFloat(amount) + (parseFloat(amount) * feePercentage / 100) : 0;

      const { data: paymentLinkData, error: paymentLinkError } = await supabase.functions.invoke(
        "create-payment-link",
        {
          body: {
            amount: Math.round(finalAmount),
            description: description || name,
            payment_type: "product",
            currency,
            redirect_url: redirectUrl || null
          }
        }
      );

      if (paymentLinkError) throw paymentLinkError;

      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert({
          name,
          description,
          amount: Math.round(finalAmount),
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
      
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["payment-links"] });
      
      setName("");
      setDescription("");
      setAmount("");
      setImage(null);
      setRedirectUrl("");
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

        {amount && (
          <PriceCalculator
            amount={amount}
            feePercentage={feePercentage}
            currency={currency}
          />
        )}

        <RedirectUrlInput
          redirectUrl={redirectUrl}
          setRedirectUrl={setRedirectUrl}
        />

        <ProductImageInput
          handleImageChange={handleImageChange}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer le produit"}
        </Button>
      </form>
    </Card>
  );
};

export default ProductForm;