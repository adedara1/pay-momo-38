import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PaymentLinkForm from "@/components/PaymentLinkForm";
import TransactionHistory from "@/components/TransactionHistory";
import PaymentLinksList from "@/components/PaymentLinksList";
import ApiKeys from "@/components/ApiKeys";
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
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Button variant="outline" onClick={handleSignOut}>
          Déconnexion
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ApiKeys />
        
        <div className="space-y-6">
          <Button 
            onClick={() => setShowPaymentForm(!showPaymentForm)}
            className="w-full"
          >
            {showPaymentForm ? "Fermer" : "Créer un lien de paiement"}
          </Button>
          
          {showPaymentForm && <PaymentLinkForm />}
        </div>
      </div>

      <div className="space-y-8">
        <PaymentLinksList />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Dashboard;