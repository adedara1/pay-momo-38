import ProductsList from "@/components/ProductsList";
import SimplePagesList from "@/components/SimplePagesList";
import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const Products = () => {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Liste des produits
            </h2>
            <div className="grid gap-6">
              <ProductsList />
              <SimplePagesList />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Products;