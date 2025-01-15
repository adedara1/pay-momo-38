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
import OrdersManagement from "@/components/OrdersManagement";

const HomeContent = () => {
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);
  const [userId, setUserId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <div className="w-full max-w-[100vw] px-2 md:px-4 py-4">
        <h1 className="text-xl md:text-2xl font-bold">
          Salut {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}!
        </h1>
      </div>

      <div className="w-full bg-gray-50 min-h-screen">
        <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8">
          <div className="mb-4 md:mb-8">
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-xl md:text-2xl font-bold">
                Salut {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}!
              </h1>
              <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                Salut {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}!
              </h1>
            </div>
            <WalletStats />
          </div>

          <div className="mb-6">
            <OrdersManagement />
          </div>

          <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
            <div className="flex flex-col items-center justify-center mb-4">
              <h2 className="text-lg font-semibold mb-2">Afficher plus</h2>
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
        </div>
      </div>
    </>
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
