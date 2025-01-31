import { useEffect, useState } from "react";
import { Wallet, Timer, PiggyBank } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const WalletStats = () => {
  const [userId, setUserId] = useState<string>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enable realtime updates
  useRealtimeUpdates(userId);

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUserId();
  }, []);

  // Use React Query to fetch and cache wallet stats
  const { data: stats = {
    available: 0,
    pending: 0,
    validated: 0,
    pendingCount: 0,
    validatedCount: 0
  }} = useQuery({
    queryKey: ['wallet-stats', userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        // First check if wallet exists, if not create it
        const { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('available, pending, validated')
          .eq('user_id', userId)
          .maybeSingle();

        if (walletError && walletError.code !== 'PGRST116') {
          console.error('Error fetching wallet:', walletError);
          throw walletError;
        }

        if (!wallet) {
          // Create default wallet
          const { data: newWallet, error: createError } = await supabase
            .from('wallets')
            .insert({
              user_id: userId,
              available: 0,
              pending: 0,
              validated: 0
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating wallet:', createError);
            throw createError;
          }
          console.log('Created new wallet:', newWallet);
        }

        // Check if stats exist, if not create them
        const { data: userStats, error: statsError } = await supabase
          .from('user_stats')
          .select('pending_requests, validated_requests, available_balance')
          .eq('user_id', userId)
          .maybeSingle();

        if (statsError && statsError.code !== 'PGRST116') {
          console.error('Error fetching stats:', statsError);
          throw statsError;
        }

        if (!userStats) {
          // Create default stats
          const { data: newStats, error: createStatsError } = await supabase
            .from('user_stats')
            .insert({
              user_id: userId,
              available_balance: 0,
              pending_requests: 0,
              validated_requests: 0
            })
            .select()
            .single();

          if (createStatsError) {
            console.error('Error creating stats:', createStatsError);
            throw createStatsError;
          }
          console.log('Created new user stats:', newStats);
        }

        // Return the wallet data (either existing or newly created)
        const currentWallet = wallet || { available: 0, pending: 0, validated: 0 };
        const currentStats = userStats || { pending_requests: 0, validated_requests: 0 };

        return {
          available: currentWallet.available,
          pending: currentWallet.pending,
          validated: currentWallet.validated,
          pendingCount: currentStats.pending_requests,
          validatedCount: currentStats.validated_requests
        };
      } catch (error) {
        console.error('Error in wallet stats query:', error);
        toast({
          title: "Error",
          description: "Failed to load wallet stats. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!userId
  });

  // Set up realtime subscription for wallet and transaction updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('wallet-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['wallet-stats'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['wallet-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-[2vw]">
      <Card className="p-2 md:p-[2vw] flex items-center justify-between">
        <div className="space-y-12">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm md:text-lg font-semibold text-gray-700">Solde</h2>
            <div className="flex items-center gap-1 md:gap-[1vw] py-4">
              <Wallet className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-blue-500" />
              <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-blue-500 py-2">
                {stats.available.toLocaleString()} CFA
              </span>
            </div>
          </div>
          <p className="text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-600 mt-1 md:mt-[0.5vw] py-2">
            Disponible(s)
          </p>
        </div>
      </Card>

      <Card className="p-2 md:p-[2vw] flex items-center justify-between">
        <div className="space-y-12">
          <div className="flex items-center gap-1 md:gap-[1vw] py-4">
            <Timer className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-amber-500" />
            <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-amber-500 py-2">
              {stats.pending.toLocaleString()} CFA
            </span>
          </div>
          <p className="text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-600 mt-1 md:mt-[0.5vw] py-2">
            {stats.pendingCount} Demande(s) en attente
          </p>
        </div>
      </Card>

      <Card className="p-2 md:p-[2vw] flex items-center justify-between">
        <div className="space-y-12">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 md:gap-[1vw] py-4">
              <PiggyBank className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-green-500" />
              <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-green-500 py-2">
                {stats.validated.toLocaleString()} CFA
              </span>
            </div>
            <p className="text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-600 mt-1 md:mt-[0.5vw] py-2">
              {stats.validatedCount} Demande(s) validée(s)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletStats;