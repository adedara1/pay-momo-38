import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { menuItems } from "@/lib/menuItems";

interface MenuVisibilityItem {
  route_path: string;
  menu_label: string;
  is_visible: boolean;
}

const MenuSettings = () => {
  const [menuVisibility, setMenuVisibility] = useState<MenuVisibilityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMenuVisibility();
  }, []);

  const loadMenuVisibility = async () => {
    try {
      const { data: visibilityData, error } = await supabase
        .from('menu_visibility')
        .select('*');

      if (error) {
        console.error('Error fetching menu visibility:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de visibilité",
          variant: "destructive",
        });
        return;
      }

      // Create a map of existing settings
      const existingSettings = new Map(
        visibilityData.map(item => [item.route_path, item])
      );

      // Combine existing settings with all menu items
      const allMenuItems = menuItems.map(item => ({
        route_path: item.path,
        menu_label: item.label,
        is_visible: existingSettings.has(item.path) 
          ? existingSettings.get(item.path)!.is_visible 
          : true
      }));

      console.log('Menu visibility loaded:', allMenuItems);
      setMenuVisibility(allMenuItems);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const toggleVisibility = async (path: string, newVisibility: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('menu_visibility')
        .upsert({
          route_path: path,
          menu_label: menuVisibility.find(item => item.route_path === path)?.menu_label || '',
          is_visible: newVisibility
        });

      if (error) throw error;

      setMenuVisibility(prev =>
        prev.map(item =>
          item.route_path === path
            ? { ...item, is_visible: newVisibility }
            : item
        )
      );

      toast({
        title: "Succès",
        description: `Menu ${newVisibility ? 'affiché' : 'masqué'} avec succès`,
      });
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la visibilité",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Configuration des menus</h1>
      <div className="grid gap-4">
        {menuVisibility.map((item) => (
          <Card key={item.route_path} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.menu_label}</h3>
                <p className="text-sm text-muted-foreground">{item.route_path}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={item.is_visible ? "default" : "outline"}
                  onClick={() => toggleVisibility(item.route_path, true)}
                  disabled={isLoading || item.is_visible}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Afficher
                </Button>
                <Button
                  variant={!item.is_visible ? "default" : "outline"}
                  onClick={() => toggleVisibility(item.route_path, false)}
                  disabled={isLoading || !item.is_visible}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Masquer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuSettings;