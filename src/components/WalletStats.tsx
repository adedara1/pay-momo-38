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

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (walletError) throw walletError;

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

  // Set up realtime subscription for wallet updates
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
          // Invalidate and refetch queries when wallet is updated
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
      <Card className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold text-blue-500">
            {stats.available.toLocaleString()} CFA
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Disponible(s)
        </p>
      </Card>

      <Card className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="w-6 h-6 text-amber-500" />
          <span className="text-xl font-bold text-amber-500">
            {stats.pending.toLocaleString()} CFA
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {stats.pendingCount} Demande(s) en attente
        </p>
      </Card>

      <Card className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className="w-6 h-6 text-green-500" />
          <span className="text-xl font-bold text-green-500">
            {stats.validated.toLocaleString()} CFA
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {stats.validatedCount} Demande(s) validée(s)
        </p>
      </Card>
    </div>
  );
};

export default WalletStats;