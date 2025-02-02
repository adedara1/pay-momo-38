import StatCard from "@/components/StatCard";
import { UserStats } from "@/types/stats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/components/ui/use-toast";

interface DashboardStatsProps {
  stats: UserStats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const { checkSession } = useSession();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const isValid = await checkSession();
        if (isValid) {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          if (user) {
            setUserId(user.id);
            console.log("User ID set:", user.id);
          }
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    };

    initializeUser();
  }, [checkSession, toast]);

  // Query pour obtenir le nombre total de produits (réels + essai)
  const { data: productsCount = { total: 0, visible: 0 } } = useQuery({
    queryKey: ['products-count', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("No user ID available");
        return { total: 0, visible: 0 };
      }

      try {
        console.log("Fetching products count for user:", userId);
        
        // Compter les produits réels
        const { data: realProducts, error: realError } = await supabase
          .from('products')
          .select('id')
          .eq('user_id', userId);

        if (realError) {
          console.error("Error fetching real products:", realError);
          throw realError;
        }

        // Compter les produits d'essai
        const { data: trialProducts, error: trialError } = await supabase
          .from('trial_products')
          .select('id')
          .eq('user_id', userId);

        if (trialError) {
          console.error("Error fetching trial products:", trialError);
          throw trialError;
        }

        const realCount = realProducts?.length || 0;
        const trialCount = trialProducts?.length || 0;
        const total = realCount + trialCount;

        console.log("Products count:", {
          realProducts: realCount,
          trialProducts: trialCount,
          total
        });
        
        // Mettre à jour les statistiques de l'utilisateur
        const { error: updateError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: userId,
            total_products: total,
            visible_products: total,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (updateError) {
          console.error("Error updating user stats:", updateError);
          throw updateError;
        }

        console.log("Updated user stats with new totals:", total);

        return { 
          total, 
          visible: total
        };
      } catch (error) {
        console.error('Error in products count query:', error);
        return { total: 0, visible: 0 };
      }
    },
    enabled: !!userId,
    refetchInterval: 5000,
  });

  const { data: userStats, isLoading } = useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('available_balance, pending_requests, validated_requests')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          toast({
            title: "Error loading stats",
            description: error.message,
            variant: "destructive",
          });
          return null;
        }

        return {
          available: data?.available_balance || 0,
          pending: data?.pending_requests || 0,
          validated: data?.validated_requests || 0
        };
      } catch (error) {
        console.error('Error fetching user stats:', error);
        toast({
          title: "Error",
          description: "Failed to load statistics. Please try again later.",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 30000, // Cache data for 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!userId || !stats) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-500">No stats available</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Ventes Cumulées"
          value={stats.totalSales || 0}
          className="bg-blue-500 text-white"
        />
        <StatCard
          title="Ventes du jours"
          value={stats.dailySales || 0}
          className="bg-purple-500 text-white"
        />
        <StatCard
          title="Ventes Du Mois"
          value={stats.monthlySales || 0}
          className="bg-pink-500 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Ventes du Mois Précédent"
          value={stats.previousMonthSales || 0}
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
          value={String(productsCount.total).padStart(3, '0')}
        />
        <StatCard
          title="Totals Produits Visible"
          value={String(productsCount.visible).padStart(2, '0')}
        />
        <StatCard
          title="Solde(s)"
          value={stats.soldAmount || 0}
          className="bg-gray-900 text-white"
        />
      </div>
    </>
  );
};
