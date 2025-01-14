import StatCard from "@/components/StatCard";
import { UserStats } from "@/types/stats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStatsProps {
  stats: UserStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const { data: userStats, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('user_stats')
        .select('available_balance, pending_requests, validated_requests')
        .eq('user_id', user.id)
        .maybeSingle();

      return {
        available: data?.available_balance || 0,
        pending: data?.pending_requests || 0,
        validated: data?.validated_requests || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Ventes Cumulées"
          value={stats.totalSales || 0}
          suffix="Fcfa"
          className="bg-blue-500 text-white"
        />
        <StatCard
          title="Ventes du jours"
          value={stats.dailySales || 0}
          suffix="Fcfa"
          className="bg-purple-500 text-white"
        />
        <StatCard
          title="Ventes Du Mois"
          value={stats.monthlySales || 0}
          suffix="Fcfa"
          className="bg-pink-500 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Ventes du Mois Précédent"
          value={stats.previousMonthSales || 0}
          suffix="Fcfa"
          className="bg-blue-800 text-white"
        />
        <StatCard
          title="Transactions du Mois Précédent"
          value={String(stats.previousMonthTransactions || 0).padStart(2, '0')}
          className="bg-purple-800 text-white"
        />
        <StatCard
          title="Croissance Des Ventes"
          value={(stats.salesGrowth || 0).toFixed(1)}
          suffix="%"
          className="bg-purple-900 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Totals Produits"
          value={String(stats.totalProducts || 0).padStart(3, '0')}
        />
        <StatCard
          title="Totals Produits Visible"
          value={String(stats.visibleProducts || 0).padStart(2, '0')}
        />
        <StatCard
          title="Solde(s)"
          value={stats.soldAmount || 0}
          suffix="Fcfa"
          className="bg-gray-900 text-white"
        />
      </div>
    </>
  );
};