import { useState, useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Configuration = () => {
  const [percentage, setPercentage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const { data: settings, error } = await supabase
          .from('global_settings')
          .select('product_fee_percentage')
          .single();
        
        if (error) {
          console.error('Error fetching global settings:', error);
          return;
        }
        
        if (settings) {
          setPercentage(settings.product_fee_percentage.toString());
        }
      } catch (error) {
        console.error('Error in fetchGlobalSettings:', error);
      }
    };
    
    fetchGlobalSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: existingSettings, error: fetchError } = await supabase
        .from('global_settings')
        .select('id')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingSettings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('global_settings')
          .update({ product_fee_percentage: parseFloat(percentage) })
          .eq('id', existingSettings.id);

        if (updateError) throw updateError;
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('global_settings')
          .insert({
            product_fee_percentage: parseFloat(percentage)
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres globaux ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating global settings:", error);
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
        <h1 className="text-2xl font-bold">Configuration</h1>
      </div>
      
      <Card className="p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Frais sur les produits</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Pourcentage de frais à appliquer globalement
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
                Ce pourcentage sera automatiquement ajouté au prix de tous les produits
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

export default Configuration;