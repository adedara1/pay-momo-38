import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const TryPayment = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('trial_products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        return;
      }

      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  const handleTrialPayment = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Utilisateur non authentifié");
      }

      // Create trial transaction
      const { error: transactionError } = await supabase
        .from('trial_transactions')
        .insert({
          user_id: user.id,
          amount: product.amount,
          product_id: product.id
        });

      if (transactionError) throw transactionError;

      // Update wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') throw walletError;

      const newAvailable = (wallet?.available || 0) + product.amount;
      const newValidated = (wallet?.validated || 0) + product.amount;

      if (wallet) {
        await supabase
          .from('wallets')
          .update({
            available: newAvailable,
            validated: newValidated,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            available: product.amount,
            validated: product.amount,
            pending: 0
          });
      }

      // Update user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;

      const newStats = {
        sales_total: (stats?.sales_total || 0) + product.amount,
        monthly_sales: (stats?.monthly_sales || 0) + product.amount,
        total_transactions: (stats?.total_transactions || 0) + 1,
        monthly_transactions: (stats?.monthly_transactions || 0) + 1,
        balance: newAvailable,
        available_balance: newAvailable,
        validated_requests: (stats?.validated_requests || 0) + 1,
      };

      if (stats) {
        await supabase
          .from('user_stats')
          .update(newStats)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            ...newStats
          });
      }

      toast({
        title: "Paiement d'essai réussi",
        description: "Votre compte a été crédité avec succès",
      });

      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ["wallet-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });

    } catch (error) {
      console.error("Error processing trial payment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement du paiement d'essai",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
        </div>

        {product.image_url && (
          <div className="relative h-48 w-full">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <div className="text-center">
          <p className="text-3xl font-bold">{product.amount} FCFA</p>
        </div>

        <Button
          onClick={handleTrialPayment}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Traitement..." : "Payer Maintenant"}
        </Button>
      </Card>
    </div>
  );
};

export default TryPayment;