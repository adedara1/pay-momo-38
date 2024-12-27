import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Withdrawals() {
  const [isOpen, setIsOpen] = useState(false);
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

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'withdrawal');

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Retraits</h1>
        <Button className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Demander un Retrait
        </Button>
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
}