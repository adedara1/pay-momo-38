import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface WalletInfoProps {
  wallet: {
    available: number;
    pending: number;
    validated: number;
  };
}

export const WalletInfo = ({ wallet }: WalletInfoProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Portefeuille</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Disponible</label>
          <Input value={wallet.available} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">En attente</label>
          <Input value={wallet.pending} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Validé</label>
          <Input value={wallet.validated} readOnly />
        </div>
      </div>
    </Card>
  );
};