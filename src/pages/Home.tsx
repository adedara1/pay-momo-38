import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import WalletStats from "@/components/WalletStats";
import { useStatsSync } from "@/hooks/use-stats-sync";
import { useQuery } from "@tanstack/react-query";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import SalesCharts from "@/components/SalesCharts";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { UserStats } from "@/types/stats";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const HomeContent = () => {
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);
  const [userId, setUserId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Enable stats sync
  useStatsSync(userId);

  // Fetch user profile and set userId
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
        }
      }
    };

    fetchUserProfile();
  }, []);

  // Use React Query for stats
  const { data: stats = {
    totalSales: 0,
    dailySales: 0,
    monthlySales: 0,
    totalTransactions: 0,
    dailyTransactions: 0,
    monthlyTransactions: 0,
    previousMonthSales: 0,
    previousMonthTransactions: 0,
    salesGrowth: 0,
    totalProducts: 0,
    visibleProducts: 0,
    soldAmount: 0
  } as UserStats } = useQuery({
    queryKey: ['home-stats', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        totalSales: data?.sales_total || 0,
        dailySales: data?.daily_sales || 0,
        monthlySales: data?.monthly_sales || 0,
        totalTransactions: data?.total_transactions || 0,
        dailyTransactions: data?.daily_transactions || 0,
        monthlyTransactions: data?.monthly_transactions || 0,
        previousMonthSales: data?.previous_month_sales || 0,
        previousMonthTransactions: data?.previous_month_transactions || 0,
        salesGrowth: data?.sales_growth || 0,
        totalProducts: data?.total_products || 0,
        visibleProducts: data?.visible_products || 0,
        soldAmount: data?.balance || 0
      } as UserStats;
    },
    enabled: !!userId
  });

  // Fetch and handle orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['unprocessed-orders'],
    queryFn: async () => {
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

      if (error) throw error;
      return data;
    }
  });

  const handleMarkAsProcessed = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ processed: true })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La commande a été marquée comme traitée",
      });
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
    <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8">
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Salut {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}!
        </h1>
        <WalletStats />
      </div>

      <div className="flex items-center justify-center mb-4">
        <Card className="p-6 w-full flex items-center space-x-4 bg-white hover:shadow-lg transition-shadow cursor-pointer">
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
            <p className="text-gray-600 text-sm">Cliquer pour voir les nouvelles commandes</p>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4 mt-6">
          {orders.map((order) => (
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
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-gray-500">
          Aucune commande non traitée
        </Card>
      )}

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <CollapsibleTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            {isOpen ? (
              <ChevronUp className="h-6 w-6 text-gray-500" />
            ) : (
              <ChevronDown className="h-6 w-6 text-gray-500" />
            )}
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
            <StatCard
              title="Ventes Cumulées"
              value={stats.totalSales}
              suffix="Fcfa"
              className="bg-blue-500 text-white"
            />
            <StatCard
              title="Ventes du jours"
              value={stats.dailySales}
              className="bg-purple-500 text-white"
            />
            <StatCard
              title="Ventes Du Mois"
              value={stats.monthlySales}
              className="bg-pink-500 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
            <StatCard
              title="Total Des Transactions"
              value={String(stats.totalTransactions).padStart(3, '0')}
            />
            <StatCard
              title="Transactions Du Jour"
              value={String(stats.dailyTransactions).padStart(2, '0')}
            />
            <StatCard
              title="Transactions Du Mois"
              value={String(stats.monthlyTransactions).padStart(2, '0')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
            <StatCard
              title="Ventes du Mois Précédent"
              value={stats.previousMonthSales}
              suffix="Fcfa"
              className="bg-blue-800 text-white"
            />
            <StatCard
              title="Transactions du Mois Précédent"
              value={String(stats.previousMonthTransactions).padStart(2, '0')}
              className="bg-purple-800 text-white"
            />
            <StatCard
              title="Croissance Des Ventes"
              value={stats.salesGrowth}
              suffix="%"
              className="bg-purple-900 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <StatCard
              title="Totals Produits"
              value={String(stats.totalProducts).padStart(3, '0')}
            />
            <StatCard
              title="Totals Produits Visible"
              value={String(stats.visibleProducts).padStart(2, '0')}
            />
            <StatCard
              title="Solde(s)"
              value={stats.soldAmount}
              className="bg-gray-900 text-white"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <SalesCharts />
    </div>
  );
};

const Home = () => {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
};

export default Home;