import StatCard from "@/components/StatCard";
import { UserStats } from "@/types/stats";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStatsProps {
  stats: UserStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const { data: userStats = {
    available: 0,
    pending: 0,
    validated: 0
  }} = useQuery({
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Solde Disponible"
          value={userStats.available}
          suffix="Fcfa"
          className="bg-blue-500 text-white"
        />
        <StatCard
          title="Demandes en attente"
          value={String(userStats.pending).padStart(2, '0')}
          className="bg-amber-500 text-white"
        />
        <StatCard
          title="Demandes validées"
          value={String(userStats.validated).padStart(2, '0')}
          className="bg-green-500 text-white"
        />
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
    </>
  );
};
