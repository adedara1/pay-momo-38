import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import PaymentLinkForm from "@/components/PaymentLinkForm";
import TransactionHistory from "@/components/TransactionHistory";

const Dashboard = () => {
  const { toast } = useToast();
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const generateApiKey = () => {
    // Simulation de génération de clé API
    const apiKey = "pk_test_" + Math.random().toString(36).substring(2, 15);
    toast({
      title: "Clé API générée",
      description: `Votre nouvelle clé API: ${apiKey}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total transactions</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant total</p>
              <p className="text-2xl font-bold">0 FCFA</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Clés API</h2>
          <Button onClick={generateApiKey} className="w-full">
            Générer une nouvelle clé API
          </Button>
        </Card>
      </div>

      <div className="mb-8">
        <Button 
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="mb-4"
        >
          {showPaymentForm ? "Fermer" : "Créer un lien de paiement"}
        </Button>
        
        {showPaymentForm && <PaymentLinkForm />}
      </div>

      <TransactionHistory />
    </div>
  );
};

export default Dashboard;