import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import WalletStats from "@/components/WalletStats";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const Home = () => {
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);
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

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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

    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id);

        const { data: products } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id);

        if (transactions && products) {
          console.log("Fetched data:", { transactions, products });
          // Calculate user-specific stats here
          // This is just an example, you should implement the actual calculations
          setStats({
            totalSales: transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
            dailySales: 0, // Calculate based on today's transactions
            monthlySales: 0, // Calculate based on this month's transactions
            totalTransactions: transactions?.length || 0,
            dailyTransactions: 0,
            monthlyTransactions: 0,
            previousMonthSales: 0,
            previousMonthTransactions: 0,
            salesGrowth: 0,
            totalProducts: products?.length || 0,
            visibleProducts: products?.filter(p => p.payment_link_id).length || 0,
            soldAmount: 0
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchUserProfile();
    fetchStats();
  }, []);

  return (
    <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8">
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Salut {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}!
        </h1>
        <WalletStats />
      </div>

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
    </div>
  );
};

export default Home;