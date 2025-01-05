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

      // Fetch wallet data
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('available, pending, validated')
        .eq('user_id', userId)
        .single();

      if (walletError) throw walletError;

      // Fetch transactions to count pending and validated requests
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('status')
        .eq('user_id', userId);

      if (transError) throw transError;

      const pendingTransactions = transactions?.filter(t => t.status === 'pending') || [];
      const validatedTransactions = transactions?.filter(t => t.status === 'completed') || [];

      return {
        available: wallet?.available || 0,
        pending: wallet?.pending || 0,
        validated: wallet?.validated || 0,
        pendingCount: pendingTransactions.length,
        validatedCount: validatedTransactions.length
      };
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
          table: 'transactions',
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
          <div className="flex items-center gap-1 md:gap-[1vw] py-4">
            <Wallet className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-blue-500" />
            <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-blue-500 py-2">
              {stats.available.toLocaleString()} CFA
            </span>
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