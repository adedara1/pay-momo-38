import StatCard from "@/components/StatCard";
import { UserStats } from "@/types/stats";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStatsProps {
  stats: UserStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const [walletStats, setWalletStats] = useState({
    available: 0,
    pending: 0,
    validated: 0
  });

  useEffect(() => {
    const fetchWalletStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (wallet) {
        setWalletStats({
          available: wallet.available || 0,
          pending: wallet.pending || 0,
          validated: wallet.validated || 0
        });
      }
    };

    fetchWalletStats();

    // Set up realtime subscription
    const channel = supabase
      .channel('wallet-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets'
        },
        () => {
          fetchWalletStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Solde Disponible"
          value={walletStats.available}
          suffix="Fcfa"
          className="bg-blue-500 text-white"
        />
        <StatCard
          title="Demandes en attente"
          value={String(walletStats.pending).padStart(2, '0')}
          className="bg-amber-500 text-white"
        />
        <StatCard
          title="Demandes validées"
          value={String(walletStats.validated).padStart(2, '0')}
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