import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import PaymentLinkForm from "@/components/PaymentLinkForm";
import TransactionHistory from "@/components/TransactionHistory";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/login");
      }
    });

    // Listen for changes on auth state (sign-in, sign-out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!user) {
    return null; // Will redirect to login
  }

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Déconnexion
        </Button>
      </div>
      
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