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
import { Card } from "@/components/ui/card";
import { Plus, FileText, CreditCard } from "lucide-react";
import ProductsSidebar from "@/components/ProductsSidebar";
import ProductsMobileSidebar from "@/components/ProductsMobileSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Products = () => {
  const { toast } = useToast();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSimplePageForm, setShowSimplePageForm] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen">
      {!isMobile && <ProductsSidebar />}
      {isMobile && <ProductsMobileSidebar />}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Button 
              onClick={() => {
                setShowProductForm(!showProductForm);
                if (showSimplePageForm) setShowSimplePageForm(false);
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              {showProductForm ? "Fermer" : "Créer une page produit"}
            </Button>
            
            <Button 
              onClick={() => {
                setShowSimplePageForm(!showSimplePageForm);
                if (showProductForm) setShowProductForm(false);
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              {showSimplePageForm ? "Fermer" : "Créer une page simple"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <ApiKeys />
          </Card>
          
          <div className="space-y-6">
            {showProductForm && (
              <Card className="p-6 bg-white shadow-lg">
                <ProductForm />
              </Card>
            )}
            {showSimplePageForm && (
              <Card className="p-6 bg-white shadow-lg">
                <SimplePageForm />
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Mes produits et pages
            </h2>
            <div className="grid gap-6">
              <ProductsList />
              <SimplePagesList />
              <PaymentLinksList />
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Historique des transactions
            </h2>
            <Card className="bg-white shadow-lg">
              <TransactionHistory />
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Products;
