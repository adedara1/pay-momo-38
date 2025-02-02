import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  company_email: string;
  is_approved: boolean;
  created_at: string;
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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

  const deleteUser = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }

      // Update local state
      setUsers(users.filter(user => user.id !== userId));

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur. Assurez-vous d'avoir les droits d'administration.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement...</div>;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <CollapsibleTrigger className="flex items-center gap-2 text-2xl font-bold mb-4 hover:text-primary transition-colors">
        <div className="flex items-center gap-2">
          <h2>Liste des Utilisateurs</h2>
          <span className="text-sm font-normal px-2 py-1 bg-primary/10 rounded-full">
            {users.length} utilisateur{users.length > 1 ? 's' : ''}
          </span>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="grid gap-4">
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
              <p className="text-sm text-gray-500">
                Inscrit le {format(new Date(user.created_at), 'dd MMMM yyyy', { locale: fr })}
              </p>
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
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => deleteUser(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}