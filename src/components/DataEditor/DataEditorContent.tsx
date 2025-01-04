import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSearch } from "./UserSearch";
import { UserDataDisplay } from "./UserDataDisplay";

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

  const handleSearch = async () => {
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

      // Get transactions for statistics
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profileData.id);

      // Get products count
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', profileData.id);

      // Calculate statistics
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      const completedTransactions = transactions?.filter(t => t.status === 'completed') || [];
      const currentMonthSales = completedTransactions.filter(t => t.created_at >= startOfMonth).reduce((sum, t) => sum + (t.amount || 0), 0);
      const previousMonthSales = completedTransactions.filter(t => t.created_at >= startOfPrevMonth && t.created_at <= endOfPrevMonth).reduce((sum, t) => sum + (t.amount || 0), 0);

      const wallet = {
        available: completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
        pending: transactions?.filter(t => t.status === 'pending').reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        validated: completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      };

      setUserData({
        id: profileData.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        wallet,
        stats: {
          salesTotal: completedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
          dailySales: completedTransactions.filter(t => t.created_at >= startOfDay).reduce((sum, t) => sum + (t.amount || 0), 0),
          monthlySales: currentMonthSales,
          totalTransactions: transactions?.length || 0,
          dailyTransactions: transactions?.filter(t => t.created_at >= startOfDay).length || 0,
          monthlyTransactions: transactions?.filter(t => t.created_at >= startOfMonth).length || 0,
          previousMonthSales,
          previousMonthTransactions: transactions?.filter(t => t.created_at >= startOfPrevMonth && t.created_at <= endOfPrevMonth).length || 0,
          salesGrowth: previousMonthSales ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : 0,
          totalProducts: products?.length || 0,
          visibleProducts: products?.filter(p => p.status !== 'hidden').length || 0,
          balance: wallet.available,
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

  const handleSave = async () => {
    if (!userData) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
        })
        .eq('id', userData.id);

      if (error) throw error;

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
      />
    </div>
  );
}