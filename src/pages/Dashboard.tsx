import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import WalletStats from "@/components/WalletStats";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { useStatsSync } from "@/hooks/use-stats-sync";
import { useQuery } from "@tanstack/react-query";
import { UserStats } from "@/types/stats";
import { DashboardStats } from "@/components/DashboardStats";
import StatCard from "@/components/StatCard";

const Dashboard = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>();
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);

  // Enable realtime updates
  useRealtimeUpdates(userId);
  useStatsSync(userId);

  // Utiliser useQuery pour les stats
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
    queryKey: ['dashboard-stats', userId],
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour accéder à cette page",
            variant: "destructive",
          });
          return;
        }

        setUserId(user.id);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">
          Salut {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}!
        </h1>
        <WalletStats />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <DashboardStats stats={stats} />
    </div>
  );
};

export default Dashboard;