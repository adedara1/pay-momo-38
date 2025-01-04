import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  wallet: {
    available: number;
    pending: number;
    validated: number;
  };
  stats: {
    salesTotal: number;
    dailySales: number;
    monthlySales: number;
    previousMonthSales: number;
    previousMonthTransactions: number;
    salesGrowth: number;
    balance: number;
  };
}

interface UserDataDisplayProps {
  userData: UserData | null;
  onSave: () => void;
  onUpdateUserData: (field: string, value: string) => void;
}

export const UserDataDisplay = ({ userData, onSave, onUpdateUserData }: UserDataDisplayProps) => {
  if (!userData) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informations utilisateur</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <Input
              value={userData.first_name}
              onChange={(e) => onUpdateUserData('first_name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <Input
              value={userData.last_name}
              onChange={(e) => onUpdateUserData('last_name', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Wallet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Disponible</label>
            <Input value={userData.wallet.available} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">En attente</label>
            <Input value={userData.wallet.pending} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Validé</label>
            <Input value={userData.wallet.validated} readOnly />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(userData.stats).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <Input value={value} readOnly />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave}>Enregistrer les modifications</Button>
      </div>
    </div>
  );
};