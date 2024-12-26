import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import WalletStats from "@/components/WalletStats";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
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
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', profile?.id);

        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', profile?.id);

        if (transactions && products) {
          const totalSales = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
          const totalProducts = products.length;
          
          // Calculate monthly sales
          const now = new Date();
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthlySales = transactions
            .filter(t => new Date(t.created_at) >= firstDayOfMonth)
            .reduce((sum, t) => sum + (t.amount || 0), 0);

          // Calculate daily sales
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          const dailySales = transactions
            .filter(t => new Date(t.created_at) >= startOfDay)
            .reduce((sum, t) => sum + (t.amount || 0), 0);

          setStats(prev => ({
            ...prev,
            totalSales,
            dailySales,
            monthlySales,
            totalProducts,
            totalTransactions: transactions.length,
            monthlyTransactions: transactions.filter(t => new Date(t.created_at) >= firstDayOfMonth).length,
            dailyTransactions: transactions.filter(t => new Date(t.created_at) >= startOfDay).length,
          }));
          
          console.log("Fetched data:", { transactions, products });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (profile?.id) {
      fetchStats();
    }
  }, [profile?.id]);

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Salut {profile.first_name} {profile.last_name}!</h1>
        <p className="text-gray-600 mb-6">ID: {profile.custom_id}</p>
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
          className="bg-purple-500 text-white"
        />
        <StatCard
          title="Ventes Du Mois"
          value={stats.monthlySales}
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
          value={stats.salesGrowth}
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
          className="bg-gray-900 text-white"
        />
      </div>
    </div>
  );
};

export default Dashboard;