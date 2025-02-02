import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const SalesCharts = () => {
  const isMobile = useIsMobile();
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
          }
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      }
    };

    initializeUser();
  }, [checkSession, toast]);

  const { data: monthlyData = [], isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['monthly-sales', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Récupérer les transactions réelles
      const { data: realTransactions, error: realError } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('user_id', userId)
        .eq('type', 'payment');

      if (realError) {
        console.error('Error fetching real transactions:', realError);
        return [];
      }

      // Récupérer les transactions d'essai
      const { data: trialTransactions, error: trialError } = await supabase
        .from('trial_transactions')
        .select('amount, created_at')
        .eq('user_id', userId)
        .eq('type', 'payment');

      if (trialError) {
        console.error('Error fetching trial transactions:', trialError);
        return [];
      }

      // Combiner les deux types de transactions
      const allTransactions = [...(realTransactions || []), ...(trialTransactions || [])];

      const monthlyStats = allTransactions.reduce((acc: any[], transaction) => {
        const date = new Date(transaction.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        const existingMonth = acc.find(item => item.month === month);
        
        if (existingMonth) {
          existingMonth.sales += transaction.amount;
        } else {
          acc.push({ month, sales: transaction.amount });
        }
        
        return acc;
      }, []);

      return monthlyStats;
    },
    enabled: !!userId
  });

  const { data: dailyData = [], isLoading: isLoadingDaily } = useQuery({
    queryKey: ['daily-sales', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      // Récupérer les transactions réelles du jour
      const { data: realSalesData, error: realError } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('user_id', userId)
        .eq('type', 'payment')
        .gte('created_at', startOfDay)
        .lt('created_at', endOfDay);

      if (realError) {
        console.error('Error fetching real daily sales:', realError);
        return [];
      }

      // Récupérer les transactions d'essai du jour
      const { data: trialSalesData, error: trialError } = await supabase
        .from('trial_transactions')
        .select('amount, created_at')
        .eq('user_id', userId)
        .eq('type', 'payment')
        .gte('created_at', startOfDay)
        .lt('created_at', endOfDay);

      if (trialError) {
        console.error('Error fetching trial daily sales:', trialError);
        return [];
      }

      // Combiner les transactions
      const allSalesData = [...(realSalesData || []), ...(trialSalesData || [])];

      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i.toString().padStart(2, '0'),
        sales: 0,
        visits: 0
      }));

      allSalesData.forEach(transaction => {
        const hour = new Date(transaction.created_at).getHours();
        hourlyData[hour].sales += transaction.amount;
        hourlyData[hour].visits += 1;
      });

      return hourlyData;
    },
    enabled: !!userId
  });

  const { data: topProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['top-products', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Récupérer les produits des transactions réelles
      const { data: realTransactions, error: realError } = await supabase
        .from('transactions')
        .select(`
          amount,
          product:products(name)
        `)
        .eq('user_id', userId)
        .eq('type', 'payment');

      if (realError) {
        console.error('Error fetching real transactions products:', realError);
        return [];
      }

      // Récupérer les produits des transactions d'essai
      const { data: trialTransactions, error: trialError } = await supabase
        .from('trial_transactions')
        .select(`
          amount,
          product:trial_products(name)
        `)
        .eq('user_id', userId)
        .eq('type', 'payment');

      if (trialError) {
        console.error('Error fetching trial transactions products:', trialError);
        return [];
      }

      // Combiner et calculer les statistiques
      const allTransactions = [...(realTransactions || []), ...(trialTransactions || [])];
      
      const productStats = allTransactions.reduce((acc: any, transaction) => {
        const productName = transaction.product?.name || 'Unknown Product';
        if (!acc[productName]) {
          acc[productName] = 0;
        }
        acc[productName] += transaction.amount;
        return acc;
      }, {});

      return Object.entries(productStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => (b.value as number) - (a.value as number))
        .slice(0, 5);
    },
    enabled: !!userId
  });

  if (isLoadingMonthly || isLoadingDaily || isLoadingProducts) {
    return (
      <div className="space-y-6 mt-8">
        <Card className="p-6">
          <div className="animate-pulse h-[300px] bg-gray-200 rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Évolution des ventes par mois</h3>
        <div className="w-full overflow-x-hidden">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Nombre de ventes et de visites par heure</h3>
        <div className="w-full overflow-x-hidden">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Ventes" />
              <Line type="monotone" dataKey="visits" stroke="#82ca9d" name="Visites" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Produits les plus vendus</h3>
        <div className="w-full overflow-x-hidden">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default SalesCharts;