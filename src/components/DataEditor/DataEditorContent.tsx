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
    previousMonthSales: number;
    previousMonthTransactions: number;
    salesGrowth: number;
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

      // Get wallet data
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profileData.id);

      const wallet = {
        available: transactions?.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        pending: transactions?.filter(t => t.status === 'pending').reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        validated: transactions?.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
      };

      setUserData({
        id: profileData.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        wallet,
        stats: {
          salesTotal: 0,
          dailySales: 0,
          monthlySales: 0,
          previousMonthSales: 0,
          previousMonthTransactions: 0,
          salesGrowth: 0,
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