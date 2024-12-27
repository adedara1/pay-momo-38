import { useState, useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [percentage, setPercentage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: settings } = await supabase
          .from('settings')
          .select('product_fee_percentage')
          .single();
        
        if (settings) {
          setPercentage(settings.product_fee_percentage.toString());
        }
      }
    };
    
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: existingSettings } = await supabase
        .from('settings')
        .select('id')
        .single();

      if (existingSettings) {
        // Update existing settings
        await supabase
          .from('settings')
          .update({ product_fee_percentage: parseFloat(percentage) })
          .eq('user_id', user.id);
      } else {
        // Create new settings
        await supabase
          .from('settings')
          .insert({
            user_id: user.id,
            product_fee_percentage: parseFloat(percentage)
          });
      }

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Réglages</h1>
      </div>
      
      <Card className="p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Frais sur les produits</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Pourcentage de frais à appliquer
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="Ex: 5"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  className="max-w-[200px]"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500">
                Ce pourcentage sera automatiquement ajouté au prix de vos produits
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;