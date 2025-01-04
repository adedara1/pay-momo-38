import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // First try to find by exact ID match
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', searchQuery)
        .maybeSingle();

      // If no result, try to find by name
      if (!profileData) {
        const { data: nameSearchData, error: nameSearchError } = await supabase
          .from('profiles')
          .select('*')
          .or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
          .maybeSingle();

        if (nameSearchError) throw nameSearchError;
        profileData = nameSearchData;
      }

      if (!profileData) {
        toast({
          title: "Utilisateur non trouvé",
          description: "Aucun utilisateur trouvé avec cet ID ou nom",
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
          salesTotal: 0, // Add real data calculation here
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
      <div className="flex justify-end">
        <div className="flex gap-2 w-full max-w-sm">
          <Input
            placeholder="Rechercher par ID ou nom complet"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {userData && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informations utilisateur</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <Input
                  value={userData.first_name}
                  onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <Input
                  value={userData.last_name}
                  onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Wallet</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Disponible</label>
                <Input value={userData.wallet.available} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">En attente</label>
                <Input value={userData.wallet.pending} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Validé</label>
                <Input value={userData.wallet.validated} readOnly />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(userData.stats).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <Input value={value} readOnly />
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Enregistrer les modifications</Button>
          </div>
        </div>
      )}
    </div>
  );
}