import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PaymentLinkForm = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation du montant minimum
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
      console.log("Creating simple payment link...");

      const { data, error } = await supabase.functions.invoke("create-payment-link", {
        body: {
          amount: parseInt(amount),
          description,
          payment_type: "simple"
        }
      });

      if (error) throw error;
      
      console.log("Payment link created:", data);
      
      toast({
        title: "Lien de paiement créé",
        description: "Le lien a été copié dans votre presse-papiers",
      });
      
      // Copy payment URL to clipboard
      await navigator.clipboard.writeText(data.payment_url);
      
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du lien",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={createPaymentLink} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description du paiement"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer le lien"}
        </Button>
      </form>
    </Card>
  );
};

export default PaymentLinkForm;