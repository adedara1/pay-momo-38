import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSearch } from "./UserSearch";
import { UserDataDisplay } from "./UserDataDisplay";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  wallet: {
    available: number;
    pending: number;
    validated: number;
  };
  stats: {
    salesTotal: number;
    dailySales: number;
    monthlySales: number;
    totalTransactions: number;
    dailyTransactions: number;
    monthlyTransactions: number;
    previousMonthSales: number;
    previousMonthTransactions: number;
    salesGrowth: number;
    totalProducts: number;
    visibleProducts: number;
    balance: number;
  };
}

export function DataEditorContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      navigate("/auth");
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    if (!await checkSession()) return;
    
    setIsLoading(true);
    try {
      // Try to find by email first
      const { data: emailSearchData, error: emailSearchError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('company_email', `%${searchQuery}%`)
        .maybeSingle();

      if (emailSearchError) throw emailSearchError;

      // If no result by email, try name search
      let profileData = emailSearchData;
      if (!profileData) {
        const { data: nameSearchData, error: nameSearchError } = await supabase
          .from('profiles')
          .select('*')
          .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
          .maybeSingle();

        if (nameSearchError) throw nameSearchError;
        profileData = nameSearchData;
      }

      // If still no result and the query looks like a UUID, try searching by ID
      if (!profileData && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchQuery)) {
        const { data: idSearchData, error: idSearchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', searchQuery)
          .maybeSingle();

        if (idSearchError) throw idSearchError;
        profileData = idSearchData;
      }

      if (!profileData) {
        toast({
          title: "Utilisateur non trouvé",
          description: "Aucun utilisateur trouvé avec cet ID, email ou nom",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Get user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', profileData.id)
        .maybeSingle();

      if (statsError) throw statsError;

      // Get transactions for wallet calculation
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profileData.id);

      const completedTransactions = transactions?.filter(t => t.status === 'completed') || [];
      
      const wallet = {
        available: completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
        pending: transactions?.filter(t => t.status === 'pending').reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        validated: completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      };

      // If no stats exist, create default stats
      const stats = statsData || {
        sales_total: 0,
        daily_sales: 0,
        monthly_sales: 0,
        total_transactions: 0,
        daily_transactions: 0,
        monthly_transactions: 0,
        previous_month_sales: 0,
        previous_month_transactions: 0,
        sales_growth: 0,
        total_products: 0,
        visible_products: 0,
        balance: wallet.available,
      };

      setUserData({
        id: profileData.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        wallet,
        stats: {
          salesTotal: stats.sales_total,
          dailySales: stats.daily_sales,
          monthlySales: stats.monthly_sales,
          totalTransactions: stats.total_transactions,
          dailyTransactions: stats.daily_transactions,
          monthlyTransactions: stats.monthly_transactions,
          previousMonthSales: stats.previous_month_sales,
          previousMonthTransactions: stats.previous_month_transactions,
          salesGrowth: stats.sales_growth,
          totalProducts: stats.total_products,
          visibleProducts: stats.visible_products,
          balance: stats.balance,
        }
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche des données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserData = (field: string, value: string) => {
    if (!userData) return;
    setUserData({ ...userData, [field]: value });
  };

  const handleUpdateStats = (field: string, value: number) => {
    if (!userData) return;
    setUserData({
      ...userData,
      stats: {
        ...userData.stats,
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!userData || !await checkSession()) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
        })
        .eq('id', userData.id);

      if (profileError) throw profileError;

      // Update or insert stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: userData.id,
          sales_total: userData.stats.salesTotal,
          daily_sales: userData.stats.dailySales,
          monthly_sales: userData.stats.monthlySales,
          total_transactions: userData.stats.totalTransactions,
          daily_transactions: userData.stats.dailyTransactions,
          monthly_transactions: userData.stats.monthlyTransactions,
          previous_month_sales: userData.stats.previousMonthSales,
          previous_month_transactions: userData.stats.previousMonthTransactions,
          sales_growth: userData.stats.salesGrowth,
          total_products: userData.stats.totalProducts,
          visible_products: userData.stats.visibleProducts,
          balance: userData.stats.balance,
          updated_at: new Date().toISOString(),
        });

      if (statsError) throw statsError;

      toast({
        title: "Succès",
        description: "Les données ont été mises à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour des données",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <UserSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
      <UserDataDisplay
        userData={userData}
        onSave={handleSave}
        onUpdateUserData={handleUpdateUserData}
        onUpdateStats={handleUpdateStats}
      />
    </div>
  );
}