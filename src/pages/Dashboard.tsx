import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/ProductForm";
import SimplePageForm from "@/components/SimplePageForm";
import TransactionHistory from "@/components/TransactionHistory";
import ApiKeys from "@/components/ApiKeys";
import ProductsList from "@/components/ProductsList";
import SimplePagesList from "@/components/SimplePagesList";
import PaymentLinksList from "@/components/PaymentLinksList";

const Dashboard = () => {
  const { toast } = useToast();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSimplePageForm, setShowSimplePageForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ApiKeys />
        
        <div className="space-y-6">
          <Button 
            onClick={() => {
              setShowProductForm(!showProductForm);
              if (showSimplePageForm) setShowSimplePageForm(false);
            }}
            className="w-full"
          >
            {showProductForm ? "Fermer" : "Créer une page produit"}
          </Button>
          
          <Button 
            onClick={() => {
              setShowSimplePageForm(!showSimplePageForm);
              if (showProductForm) setShowProductForm(false);
            }}
            className="w-full"
          >
            {showSimplePageForm ? "Fermer" : "Créer une page simple"}
          </Button>
          
          {showProductForm && <ProductForm />}
          {showSimplePageForm && <SimplePageForm />}
        </div>
      </div>

      <div className="space-y-8">
        <ProductsList />
        <SimplePagesList />
        <PaymentLinksList />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Dashboard;