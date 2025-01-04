import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import WalletStats from "@/components/WalletStats";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { useStatsSync } from "@/hooks/use-stats-sync";
import { useQuery } from "@tanstack/react-query";

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
  }, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data || {};
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
          title="Ventes Cumulées"
          value={stats.totalSales}
          suffix="Fcfa"
          className="bg-blue-500 text-white"
        />
        <StatCard
          title="Ventes du jours"
          value={stats.dailySales}
          suffix="Fcfa"
          className="bg-purple-500 text-white"
        />
        <StatCard
          title="Ventes Du Mois"
          value={stats.monthlySales}
          suffix="Fcfa"
          className="bg-pink-500 text-white"
        />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          value={stats.salesGrowth.toFixed(1)}
          suffix="%"
          className="bg-purple-900 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          suffix="Fcfa"
          className="bg-gray-900 text-white"
        />
      </div>
    </div>
  );
};

export default Dashboard;
