import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Bell, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Order {
  id: string;
  amount: number;
  customer_name: string | null;
  customer_contact: string | null;
  processed: boolean;
  product: {
    name: string;
    image_url: string | null;
  } | null;
}

const Orders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['unprocessed-orders'],
    queryFn: async () => {
      console.log('Fetching unprocessed orders...');
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          customer_name,
          customer_contact,
          processed,
          product:product_id (
            name,
            image_url
          )
        `)
        .eq('processed', false)
        .eq('type', 'payment');

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Fetched orders:', data);
      return data as Order[];
    }
  });

  const handleMarkAsProcessed = async (orderId: string) => {
    try {
      console.log('Marking order as processed:', orderId);
      const { error } = await supabase
        .from('transactions')
        .update({ processed: true })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La commande a été marquée comme traitée",
      });

      queryClient.invalidateQueries({ queryKey: ['unprocessed-orders'] });
    } catch (error) {
      console.error('Error marking order as processed:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de la commande",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <Card className="p-6 flex items-center space-x-4 bg-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="p-3 bg-[#00BFB3] rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              {orders && orders.length > 0 && (
                <div className="absolute -top-2 -right-2">
                  <div className="relative">
                    <Bell className="h-5 w-5 text-orange-500" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {orders.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#00BFB3]">
                {orders?.length || 0} commande{orders?.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-gray-600 text-sm">non traitée{orders?.length !== 1 ? 's' : ''}</p>
            </div>
          </Card>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="space-y-4 mt-6">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative">
                      {order.product?.image_url ? (
                        <img
                          src={order.product.image_url}
                          alt={order.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{order.product?.name || 'Produit inconnu'}</h3>
                      <p className="text-gray-600">Montant: {order.amount.toLocaleString()} FCFA</p>
                      <p className="text-sm text-gray-500">
                        Client: {order.customer_name || 'Non spécifié'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Contact: {order.customer_contact || 'Non spécifié'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleMarkAsProcessed(order.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mentionner comme traité
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center text-gray-500">
                Aucune commande non traitée
              </Card>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Orders;