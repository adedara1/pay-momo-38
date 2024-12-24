import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import WalletStats from "@/components/WalletStats";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const Home = () => {
  const [stats, setStats] = useState({
    totalSales: 75990,
    dailySales: 0,
    monthlySales: 55545,
    totalTransactions: 13,
    dailyTransactions: 0,
    monthlyTransactions: 9,
    previousMonthSales: 9545,
    previousMonthTransactions: 2,
    salesGrowth: 481.93,
    totalProducts: 17,
    visibleProducts: 2,
    soldAmount: 35990
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*');

        const { data: products } = await supabase
          .from('products')
          .select('*');

        if (transactions && products) {
          console.log("Fetched data:", { transactions, products });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Salut Arnel Angel!</h1>
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Home;