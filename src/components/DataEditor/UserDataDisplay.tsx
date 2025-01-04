import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import { useState } from "react";

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
  onUpdateStats: (field: string, value: number) => void;
}

export const UserDataDisplay = ({ userData, onSave, onUpdateUserData, onUpdateStats }: UserDataDisplayProps) => {
  const [isEditingStats, setIsEditingStats] = useState(false);

  if (!userData) return null;

  const handleStatChange = (field: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onUpdateStats(field, numericValue);
  };

  const toggleEditStats = () => {
    setIsEditingStats(!isEditingStats);
    if (!isEditingStats) {
      onSave();
    }
  };

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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Statistiques</h3>
          <Button onClick={toggleEditStats}>
            {isEditingStats ? "Enregistrer" : "Modifier"}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditingStats ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Ventes Cumulées</label>
                <Input
                  type="number"
                  value={userData.stats.salesTotal}
                  onChange={(e) => handleStatChange('salesTotal', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ventes du jour</label>
                <Input
                  type="number"
                  value={userData.stats.dailySales}
                  onChange={(e) => handleStatChange('dailySales', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ventes Du Mois</label>
                <Input
                  type="number"
                  value={userData.stats.monthlySales}
                  onChange={(e) => handleStatChange('monthlySales', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total des Transactions</label>
                <Input
                  type="number"
                  value={userData.stats.totalTransactions}
                  onChange={(e) => handleStatChange('totalTransactions', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transactions du Jour</label>
                <Input
                  type="number"
                  value={userData.stats.dailyTransactions}
                  onChange={(e) => handleStatChange('dailyTransactions', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transactions du Mois</label>
                <Input
                  type="number"
                  value={userData.stats.monthlyTransactions}
                  onChange={(e) => handleStatChange('monthlyTransactions', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ventes du Mois Précédent</label>
                <Input
                  type="number"
                  value={userData.stats.previousMonthSales}
                  onChange={(e) => handleStatChange('previousMonthSales', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Transactions du Mois Précédent</label>
                <Input
                  type="number"
                  value={userData.stats.previousMonthTransactions}
                  onChange={(e) => handleStatChange('previousMonthTransactions', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Croissance Des Ventes (%)</label>
                <Input
                  type="number"
                  value={userData.stats.salesGrowth}
                  onChange={(e) => handleStatChange('salesGrowth', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Produits</label>
                <Input
                  type="number"
                  value={userData.stats.totalProducts}
                  onChange={(e) => handleStatChange('totalProducts', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Produits Visibles</label>
                <Input
                  type="number"
                  value={userData.stats.visibleProducts}
                  onChange={(e) => handleStatChange('visibleProducts', e.target.value)}
                  className="mb-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Solde(s)</label>
                <Input
                  type="number"
                  value={userData.stats.balance}
                  onChange={(e) => handleStatChange('balance', e.target.value)}
                  className="mb-4"
                />
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave}>Enregistrer les modifications</Button>
      </div>
    </div>
  );
};