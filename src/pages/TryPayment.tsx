import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TryPayment = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Customer form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let query = supabase.from('trial_products').select('*');
        
        if (id) {
          query = query.eq('id', id);
        } else {
          query = query.limit(1);
        }
        
        const { data, error } = await query.single();
        
        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le produit",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Non authentifié");

      // Create customer record
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          full_name: `${firstName} ${lastName}`,
          email: email,
          phone: phone
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Create trial transaction
      const { error: transactionError } = await supabase
        .from('trial_transactions')
        .insert({
          user_id: user.id,
          product_id: product.id,
          amount: product.amount
        });

      if (transactionError) throw transactionError;

      // Update wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError && walletError.code !== 'PGRST116') throw walletError;

      const newAmount = (wallet?.available || 0) + product.amount;

      const { error: updateError } = await supabase
        .from('wallets')
        .upsert({
          user_id: user.id,
          available: newAmount,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (updateError) throw updateError;

      // Update user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;

      const { error: updateStatsError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          sales_total: (stats?.sales_total || 0) + product.amount,
          daily_sales: (stats?.daily_sales || 0) + product.amount,
          monthly_sales: (stats?.monthly_sales || 0) + product.amount,
          total_transactions: (stats?.total_transactions || 0) + 1,
          daily_transactions: (stats?.daily_transactions || 0) + 1,
          monthly_transactions: (stats?.monthly_transactions || 0) + 1,
          balance: newAmount,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (updateStatsError) throw updateStatsError;

      toast({
        title: "Succès",
        description: "Paiement d'essai effectué avec succès",
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Produit non trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 min-h-screen max-w-7xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-2xl font-semibold">{product.amount} FCFA</p>
        
        <Card className="p-6">
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prénom"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Votre nom"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 XX XXX XX XX"
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              disabled={isProcessing}
            >
              {isProcessing ? "Traitement..." : "Payer maintenant"}
            </Button>
          </form>
        </Card>
      </div>
      
      <div>
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default TryPayment;