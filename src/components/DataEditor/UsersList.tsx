import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  company_email: string;
  is_approved: boolean;
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useState(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_approved: !currentStatus }
          : user
      ));

      toast({
        title: "Succès",
        description: `Utilisateur ${!currentStatus ? 'approuvé' : 'désapprouvé'} avec succès`,
      });
    } catch (error) {
      console.error('Error updating user approval:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h2>
      <div className="grid gap-4">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="p-4 border rounded-lg shadow-sm flex items-center justify-between bg-white"
          >
            <div className="flex-1">
              <h3 className="font-medium">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-600">{user.company_email}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                user.is_approved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.is_approved ? 'Approuvé' : 'Non approuvé'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {}}>
                Détails
              </Button>
              <Button 
                variant={user.is_approved ? "destructive" : "default"}
                onClick={() => toggleApproval(user.id, user.is_approved)}
              >
                {user.is_approved ? 'Désapprouver' : 'Approuver'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}