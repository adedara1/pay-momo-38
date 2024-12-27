import { Card } from "@/components/ui/card";
import { ShoppingCart, Bell } from "lucide-react";

const Orders = () => {
  // Exemple de nombre de commandes, à remplacer par les données réelles
  const orderCount = 1;
  const notificationCount = 1;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="p-6 flex items-center space-x-4 bg-white hover:shadow-lg transition-shadow">
          <div className="relative">
            <div className="p-3 bg-[#00BFB3] rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="relative">
                <Bell className="h-5 w-5 text-orange-500" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#00BFB3]">{orderCount} commande</h2>
            <p className="text-gray-600 text-sm">reçus ce mois-ci</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Orders;