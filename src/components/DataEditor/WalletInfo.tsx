import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useWalletSync } from "@/hooks/use-wallet-sync";

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
  const [userId, setUserId] = useState<string>();

  // Enable wallet sync
  useWalletSync(userId);

  const handleChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateWallet(field, numValue);
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

      const { error: statsError } = await supabase
        .from('user_stats')
        .update({ 
          balance: wallet.available,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (statsError) throw statsError;

      toast({
        title: "Succès",
        description: "Le portefeuille a été mis à jour avec succès",
      });

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
      <h3 className="text-lg font-semibold mb-4">Portefeuille</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Disponible</label>
          <Input
            type="number"
            value={wallet.available}
            onChange={(e) => handleChange('available', e.target.value)}
            min="0"
            step="1"
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
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={handleSaveWallet}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer le portefeuille"}
        </Button>
      </div>
    </Card>
  );
};