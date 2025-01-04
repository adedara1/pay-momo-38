import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface WalletInfoProps {
  wallet: {
    available: number;
    pending: number;
    validated: number;
  };
  onUpdateWallet: (field: string, value: number) => void;
}

export const WalletInfo = ({ wallet, onUpdateWallet }: WalletInfoProps) => {
  const handleChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateWallet(field, numValue);
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
    </Card>
  );
};