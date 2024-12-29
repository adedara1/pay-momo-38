import { useEffect, useState } from "react";
import { Wallet, Timer, PiggyBank } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";

const WalletStats = () => {
  const [userId, setUserId] = useState<string>();
  const [stats, setStats] = useState({
    available: 0,
    pending: 0,
    validated: 0,
    pendingCount: 0,
    validatedCount: 0
  });
  const { toast } = useToast();

  // Enable realtime updates
  useRealtimeUpdates(userId);

  useEffect(() => {
    const fetchWalletStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUserId(user.id);

        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const pendingTransactions = transactions?.filter(t => t.status === 'pending') || [];
        const validatedTransactions = transactions?.filter(t => t.status === 'completed') || [];

        setStats({
          available: validatedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
          pending: pendingTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
          validated: validatedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
          pendingCount: pendingTransactions.length,
          validatedCount: validatedTransactions.length
        });
      } catch (error) {
        console.error('Error fetching wallet stats:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques du portefeuille",
          variant: "destructive",
        });
      }
    };

    fetchWalletStats();
  }, [toast]);

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-[2vw]">
      <Card className="p-2 md:p-[2vw] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1 md:gap-[1vw] py-4">
            <Wallet className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-blue-500" />
            <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-blue-500 py-2">
              {stats.available} CFA
            </span>
          </div>
          <p className="text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-600 mt-1 md:mt-[0.5vw] py-2">
            Disponible(s)
          </p>
        </div>
      </Card>

      <Card className="p-2 md:p-[2vw] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1 md:gap-[1vw] py-4">
            <Timer className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-amber-500" />
            <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-amber-500 py-2">
              {stats.pending} CFA
            </span>
          </div>
          <p className="text-xs md:text-[1.8vw] max-text-sm min-text-xs text-gray-600 mt-1 md:mt-[0.5vw] py-2">
            {stats.pendingCount} Demande(s) en attente
          </p>
        </div>
      </Card>

      <Card className="p-2 md:p-[2vw] flex items-center justify-between">
        <div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 md:gap-[1vw] py-4">
              <PiggyBank className="w-4 h-4 md:w-[4vw] md:h-[4vw] max-w-8 max-h-8 min-w-4 min-h-4 text-green-500" />
              <span className="text-sm md:text-[2.5vw] max-text-xl min-text-sm font-bold text-green-500 py-2">
                {stats.validated} CFA
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
