import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/ProductForm";
import PaymentLinkForm from "@/components/PaymentLinkForm";
import TransactionHistory from "@/components/TransactionHistory";
import ApiKeys from "@/components/ApiKeys";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ProductsList from "@/components/ProductsList";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPaymentLinkForm, setShowPaymentLinkForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/login");
      }
    });

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
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => {
                setShowProductForm(!showProductForm);
                setShowPaymentLinkForm(false);
              }}
              className="flex-1"
            >
              {showProductForm ? "Fermer" : "Créer une page produit"}
            </Button>
            
            <Button 
              onClick={() => {
                setShowPaymentLinkForm(!showPaymentLinkForm);
                setShowProductForm(false);
              }}
              className="flex-1"
            >
              {showPaymentLinkForm ? "Fermer" : "Créer un lien de paiement"}
            </Button>
          </div>
          
          {showProductForm && <ProductForm />}
          {showPaymentLinkForm && <PaymentLinkForm />}
        </div>
      </div>

      <div className="space-y-8">
        <ProductsList />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Dashboard;