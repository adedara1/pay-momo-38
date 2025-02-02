import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserSearch } from "./UserSearch";
import { UserDataDisplay } from "./UserDataDisplay";
import { UsersList } from "./UsersList";
import { useSession } from "@/hooks/use-session";
import { userDataService, type UserData } from "@/services/user-data.service";
import { supabase } from "@/integrations/supabase/client";

export function DataEditorContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { checkSession } = useSession();

  // Check if user is admin
  useState(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    setIsAdmin(!!adminData);
  };

  const handleSearch = async () => {
    if (!await checkSession()) {
      toast({
        title: "Session expirée",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await userDataService.searchUser(searchQuery);
      
      if (!data) {
        toast({
          title: "Utilisateur non trouvé",
          description: "Aucun utilisateur trouvé avec cet ID, email ou nom",
          variant: "destructive",
        });
        return;
      }

      const updatedData = {
        ...data,
        stats: {
          ...data.stats,
          availableBalance: data.stats.availableBalance || 0,
          pendingRequests: data.stats.pendingRequests || 0,
          validatedRequests: data.stats.validatedRequests || 0
        }
      };

      setUserData(updatedData);
      console.log('Updated user data:', updatedData);
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
      await userDataService.saveUserData(userData);
      
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
      {isAdmin && <UsersList />}
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