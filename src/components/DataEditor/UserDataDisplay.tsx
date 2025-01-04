import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";

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
    totalTransactions: number;
    dailyTransactions: number;
    monthlyTransactions: number;
    previousMonthSales: number;
    previousMonthTransactions: number;
    salesGrowth: number;
    totalProducts: number;
    visibleProducts: number;
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
        <h3 className="text-lg font-semibold mb-4">Portefeuille</h3>
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
          <StatCard
            title="Ventes Cumulées"
            value={userData.stats.salesTotal}
            suffix="FCFA"
            className="bg-blue-500 text-white"
          />
          <StatCard
            title="Ventes du jours"
            value={userData.stats.dailySales}
            suffix="FCFA"
            className="bg-green-500 text-white"
          />
          <StatCard
            title="Ventes Du Mois"
            value={userData.stats.monthlySales}
            suffix="FCFA"
            className="bg-indigo-500 text-white"
          />
          <StatCard
            title="Total des Transactions"
            value={userData.stats.totalTransactions}
            className="bg-gray-100"
          />
          <StatCard
            title="Transactions du Jour"
            value={userData.stats.dailyTransactions}
            className="bg-gray-100"
          />
          <StatCard
            title="Transactions du Mois"
            value={userData.stats.monthlyTransactions}
            className="bg-gray-100"
          />
          <StatCard
            title="Ventes du Mois Précédent"
            value={userData.stats.previousMonthSales}
            suffix="FCFA"
            className="bg-purple-500 text-white"
          />
          <StatCard
            title="Transactions du Mois Précédent"
            value={userData.stats.previousMonthTransactions}
            className="bg-gray-100"
          />
          <StatCard
            title="Croissance Des Ventes"
            value={userData.stats.salesGrowth.toFixed(2)}
            suffix="%"
            className="bg-yellow-500 text-white"
          />
          <StatCard
            title="Total Produits"
            value={userData.stats.totalProducts}
            className="bg-gray-100"
          />
          <StatCard
            title="Produits Visibles"
            value={userData.stats.visibleProducts}
            className="bg-gray-100"
          />
          <StatCard
            title="Solde(s)"
            value={userData.stats.balance}
            suffix="FCFA"
            className="bg-green-500 text-white"
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave}>Enregistrer les modifications</Button>
      </div>
    </div>
  );
};