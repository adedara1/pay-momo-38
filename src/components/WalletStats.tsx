import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const WalletStats = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    balance: 0,
    availableBalance: 0,
    pendingRequests: 0,
    validatedRequests: 0
  });

  useEffect(() => {
    fetchStats();
    setupRealtimeSubscription();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_stats')
        .select('balance, available_balance, pending_requests, validated_requests')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setStats({
          balance: data.balance || 0,
          availableBalance: data.available_balance || 0,
          pendingRequests: data.pending_requests || 0,
          validatedRequests: data.validated_requests || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('user_stats_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats'
      }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Solde"
        value={stats.balance.toLocaleString()}
        suffix="CFA"
        className="bg-gray-900 text-white"
      />
      <StatCard
        title="Solde Disponible"
        value={stats.availableBalance.toLocaleString()}
        suffix="CFA"
        className="bg-blue-600 text-white"
      />
      <StatCard
        title="Demandes en attente"
        value={stats.pendingRequests}
        className="bg-yellow-500 text-white"
      />
      <StatCard
        title="Demandes validées"
        value={stats.validatedRequests}
        className="bg-green-500 text-white"
      />
    </div>
  );
};

export default WalletStats;