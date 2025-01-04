import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useWalletSync } from "@/hooks/use-wallet-sync";
import { useQueryClient } from "@tanstack/react-query";

interface WalletInfoProps {
  wallet: {
    available: number;
    pending: number;
    validated: number;
  };
  onUpdateWallet: (field: string, value: number) => void;
}

export const WalletInfo = ({ wallet, onUpdateWallet }: WalletInfoProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingWallet, setIsEditingWallet] = useState(false);
  const [userId, setUserId] = useState<string>();
  const queryClient = useQueryClient();

  // Enable wallet sync
  useWalletSync(userId);

  const handleChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateWallet(field, numValue);
  };

  const toggleEditWallet = () => {
    if (isEditingWallet) {
      handleSaveWallet();
    }
    setIsEditingWallet(!isEditingWallet);
  };

  const handleSaveWallet = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour effectuer cette action",
          variant: "destructive",
        });
        return;
      }

      setUserId(user.id);

      // Mise à jour du portefeuille
      const { error: walletError } = await supabase
        .from('wallets')
        .upsert({
          user_id: user.id,
          available: wallet.available,
          pending: wallet.pending,
          validated: wallet.validated,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (walletError) throw walletError;

      // Mise à jour des statistiques
      const { error: statsError } = await supabase
        .from('user_stats')
        .update({ 
          balance: wallet.available,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (statsError) throw statsError;

      // Invalider les requêtes pour forcer le rafraîchissement
      queryClient.invalidateQueries({ queryKey: ['wallet-stats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['home-stats'] });

      toast({
        title: "Succès",
        description: "Le portefeuille a été mis à jour avec succès",
      });

      setIsEditingWallet(false);

    } catch (error) {
      console.error('Error saving wallet:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du portefeuille",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Portefeuille</h3>
        <Button 
          onClick={toggleEditWallet}
          disabled={isSaving}
        >
          {isEditingWallet ? "Enregistrer" : "Modifier"}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isEditingWallet ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Disponible</label>
              <Input
                type="number"
                value={wallet.available}
                onChange={(e) => handleChange('available', e.target.value)}
                min="0"
                step="1"
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">En attente</label>
              <Input
                type="number"
                value={wallet.pending}
                onChange={(e) => handleChange('pending', e.target.value)}
                min="0"
                step="1"
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Validé</label>
              <Input
                type="number"
                value={wallet.validated}
                onChange={(e) => handleChange('validated', e.target.value)}
                min="0"
                step="1"
                className="mb-4"
              />
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">Disponible</h4>
              <p className="text-2xl font-semibold">{wallet.available} FCFA</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">En attente</h4>
              <p className="text-2xl font-semibold">{wallet.pending} FCFA</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h4 className="text-sm font-medium text-gray-500">Validé</h4>
              <p className="text-2xl font-semibold">{wallet.validated} FCFA</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};