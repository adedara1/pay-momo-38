import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PaymentLinkForm = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const createPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulation de création de lien de paiement
      const paymentLink = `https://pay.example.com/${Math.random().toString(36).substring(2, 15)}`;
      
      toast({
        title: "Lien de paiement créé",
        description: `Votre lien: ${paymentLink}`,
      });
      
      setAmount("");
      setDescription("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du lien",
        variant: "destructive",
      });
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
            placeholder="5000"
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

        <Button type="submit" className="w-full">
          Créer le lien
        </Button>
      </form>
    </Card>
  );
};

export default PaymentLinkForm;