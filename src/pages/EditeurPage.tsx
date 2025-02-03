import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types for menu items
interface MenuItem {
  route_path: string;
  menu_label: string;
  is_visible?: boolean;
}

interface Page {
  path: string;
  name: string;
}

// Définition des pages de l'application
const pages: Page[] = [
  { path: '/home', name: 'Accueil' },
  { path: '/blog', name: 'Produit' },
  { path: '/orders', name: 'Commandes' },
  { path: '/transaction', name: 'Transaction' },
  { path: '/clients', name: 'Clients' },
  { path: '/withdrawals', name: 'Retraits' },
  { path: '/refunds', name: 'Remboursements' },
  { path: '/support', name: 'Support' }
];

// Définition des éléments du menu
const menuItems: MenuItem[] = [
  { route_path: '/home', menu_label: 'Accueil' },
  { route_path: '/blog', menu_label: 'Produit' },
  { route_path: '/orders', menu_label: 'Commandes' },
  { route_path: '/transaction', menu_label: 'Transaction' },
  { route_path: '/clients', menu_label: 'Clients' },
  { route_path: '/withdrawals', menu_label: 'Retraits' },
  { route_path: '/refunds', menu_label: 'Remboursements' },
  { route_path: '/support', menu_label: 'Support' }
];

const EditeurPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [styles, setStyles] = useState({
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: "Palanquin",
    letterSpacing: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  });

  // Fetch menu visibility settings
  const { data: menuVisibility } = useQuery({
    queryKey: ['menu-visibility'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_visibility')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  // Fonction pour mettre à jour la visibilité du menu
  const updateMenuVisibility = async (routePath: string, isVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_visibility')
        .update({ is_visible: isVisible })
        .eq('route_path', routePath);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Menu ${isVisible ? 'affiché' : 'masqué'} avec succès`,
      });

      // Invalider le cache pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ['menu-visibility'] });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la visibilité du menu",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userId) {
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', userId)
          .maybeSingle();
        
        setIsAdmin(!!data);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [userId]);

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Visibilité des menus</h2>
          <div className="grid gap-4">
            {menuItems.map((item) => {
              const visibility = menuVisibility?.find(v => v.route_path === item.route_path);
              const isVisible = visibility?.is_visible ?? true;

              return (
                <div key={item.route_path} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{item.menu_label}</span>
                  <div className="flex gap-2">
                    <Button
                      variant={isVisible ? "outline" : "default"}
                      size="sm"
                      onClick={() => updateMenuVisibility(item.route_path, true)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Afficher
                    </Button>
                    <Button
                      variant={!isVisible ? "outline" : "default"}
                      size="sm"
                      onClick={() => updateMenuVisibility(item.route_path, false)}
                      className="flex items-center gap-2"
                    >
                      <EyeOff className="h-4 w-4" />
                      Masquer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditeurPage;
