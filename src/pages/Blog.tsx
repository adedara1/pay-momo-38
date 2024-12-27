import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import ProductsList from "@/components/ProductsList";
import ProductForm from "@/components/ProductForm";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [session, setSession] = useState(null);

  // Check if user is authenticated to show/hide the create product button
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Produit</h1>
        {session && (
          <Button 
            onClick={() => setShowProductForm(!showProductForm)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showProductForm ? "Fermer" : "Créer une page produit"}
          </Button>
        )}
      </div>
      
      {session && showProductForm && (
        <Card className="p-6 mb-8 bg-white shadow-lg">
          <ProductForm />
        </Card>
      )}
      
      <ProductsList />
    </div>
  );
};

export default Blog;