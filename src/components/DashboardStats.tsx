import StatCard from "@/components/StatCard";
import { UserStats } from "@/types/stats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/components/ui/use-toast";
import { startOfDay, endOfDay, isToday, parseISO, setHours, setMinutes, setSeconds } from "date-fns";

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

  const { data: productsCount = { total: 0, visible: 0 } } = useQuery({
    queryKey: ['products-count', userId],
    queryFn: async () => {
      if (!userId) {
        console.log("No user ID available");
        return { total: 0, visible: 0 };
      }

      try {
        console.log("Fetching products count for user:", userId);
        
        // Get user stats to check last update
        const { data: userStats, error: statsError } = await supabase
          .from('user_stats')
          .select('last_daily_update')
          .eq('user_id', userId)
          .maybeSingle();

        if (statsError) {
          console.error("Error fetching user stats:", statsError);
          throw statsError;
        }

        // Définir l'heure de réinitialisation à 00:00:00
        const now = new Date();
        const resetTime = setHours(setMinutes(setSeconds(now, 0), 0), 0);
        console.log("Reset time:", resetTime);
        console.log("Last update:", userStats?.last_daily_update);

        // Vérifier si la réinitialisation est nécessaire
        const lastUpdate = userStats?.last_daily_update ? new Date(userStats.last_daily_update) : null;
        const shouldReset = !lastUpdate || lastUpdate < resetTime;

        console.log("Should reset?", shouldReset);
        
        if (shouldReset) {
          console.log("Resetting daily stats");
          const { error: resetError } = await supabase
            .from('user_stats')
            .update({
              daily_sales: 0,
              daily_transactions: 0,
              last_daily_update: now.toISOString()
            })
            .eq('user_id', userId);

          if (resetError) {
            console.error("Error resetting daily stats:", resetError);
            throw resetError;
          }
          console.log("Daily stats reset successfully");
        }
        
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

        // Get today's transactions starting from reset time
        const { data: realTransactions, error: realTransError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', userId)
          .gte('created_at', resetTime.toISOString())
          .lte('created_at', new Date().toISOString());

        if (realTransError) {
          console.error("Error fetching real transactions:", realTransError);
          throw realTransError;
        }

        // Fetch trial transactions for today
        const { data: trialTransactions, error: trialTransError } = await supabase
          .from('trial_transactions')
          .select('amount')
          .eq('user_id', userId)
          .gte('created_at', resetTime.toISOString())
          .lte('created_at', new Date().toISOString());

        if (trialTransError) {
          console.error("Error fetching trial transactions:", trialTransError);
          throw trialTransError;
        }

        const dailySales = [...(realTransactions || []), ...(trialTransactions || [])]
          .reduce((sum, trans) => sum + (trans.amount || 0), 0);

        console.log("Daily sales calculated:", dailySales);
        
        // Mettre à jour les statistiques de l'utilisateur
        const { error: updateError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: userId,
            total_products: total,
            visible_products: total,
            daily_sales: dailySales,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (updateError) {
          console.error("Error updating user stats:", updateError);
          throw updateError;
        }

        console.log("Updated user stats with new totals:", {
          total,
          dailySales
        });

        return { 
          total, 
          visible: total,
          dailySales
        };
      } catch (error) {
        console.error('Error in products count query:', error);
        return { total: 0, visible: 0, dailySales: 0 };
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
          value={productsCount.dailySales || 0}
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
