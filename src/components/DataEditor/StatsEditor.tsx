import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import { UserStats } from "@/services/user-data.service";

interface StatsEditorProps {
  stats: UserStats;
  isEditingStats: boolean;
  onToggleEditStats: () => void;
  onUpdateStats: (field: string, value: number) => void;
}

export const StatsEditor = ({ stats, isEditingStats, onToggleEditStats, onUpdateStats }: StatsEditorProps) => {
  const handleStatChange = (field: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onUpdateStats(field, numericValue);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Statistiques</h3>
        <Button onClick={onToggleEditStats}>
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
                value={stats.salesTotal}
                onChange={(e) => handleStatChange('salesTotal', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ventes du jour</label>
              <Input
                type="number"
                value={stats.dailySales}
                onChange={(e) => handleStatChange('dailySales', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ventes Du Mois</label>
              <Input
                type="number"
                value={stats.monthlySales}
                onChange={(e) => handleStatChange('monthlySales', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total des Transactions</label>
              <Input
                type="number"
                value={stats.totalTransactions}
                onChange={(e) => handleStatChange('totalTransactions', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transactions du Jour</label>
              <Input
                type="number"
                value={stats.dailyTransactions}
                onChange={(e) => handleStatChange('dailyTransactions', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transactions du Mois</label>
              <Input
                type="number"
                value={stats.monthlyTransactions}
                onChange={(e) => handleStatChange('monthlyTransactions', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ventes du Mois Précédent</label>
              <Input
                type="number"
                value={stats.previousMonthSales}
                onChange={(e) => handleStatChange('previousMonthSales', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transactions du Mois Précédent</label>
              <Input
                type="number"
                value={stats.previousMonthTransactions}
                onChange={(e) => handleStatChange('previousMonthTransactions', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Croissance Des Ventes (%)</label>
              <Input
                type="number"
                value={stats.salesGrowth}
                onChange={(e) => handleStatChange('salesGrowth', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Produits</label>
              <Input
                type="number"
                value={stats.totalProducts}
                onChange={(e) => handleStatChange('totalProducts', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Produits Visibles</label>
              <Input
                type="number"
                value={stats.visibleProducts}
                onChange={(e) => handleStatChange('visibleProducts', e.target.value)}
                className="mb-4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Solde(s)</label>
              <Input
                type="number"
                value={stats.balance}
                onChange={(e) => handleStatChange('balance', e.target.value)}
                className="mb-4"
              />
            </div>
          </>
        ) : (
          <>
            <StatCard
              title="Ventes Cumulées"
              value={stats.salesTotal}
              suffix="FCFA"
              className="bg-blue-500 text-white"
            />
            <StatCard
              title="Ventes du jours"
              value={stats.dailySales}
              suffix="FCFA"
              className="bg-green-500 text-white"
            />
            <StatCard
              title="Ventes Du Mois"
              value={stats.monthlySales}
              suffix="FCFA"
              className="bg-indigo-500 text-white"
            />
            <StatCard
              title="Total des Transactions"
              value={stats.totalTransactions}
              className="bg-gray-100"
            />
            <StatCard
              title="Transactions du Jour"
              value={stats.dailyTransactions}
              className="bg-gray-100"
            />
            <StatCard
              title="Transactions du Mois"
              value={stats.monthlyTransactions}
              className="bg-gray-100"
            />
            <StatCard
              title="Ventes du Mois Précédent"
              value={stats.previousMonthSales}
              suffix="FCFA"
              className="bg-purple-500 text-white"
            />
            <StatCard
              title="Transactions du Mois Précédent"
              value={stats.previousMonthTransactions}
              className="bg-gray-100"
            />
            <StatCard
              title="Croissance Des Ventes"
              value={stats.salesGrowth.toFixed(2)}
              suffix="%"
              className="bg-yellow-500 text-white"
            />
            <StatCard
              title="Total Produits"
              value={stats.totalProducts}
              className="bg-gray-100"
            />
            <StatCard
              title="Produits Visibles"
              value={stats.visibleProducts}
              className="bg-gray-100"
            />
            <StatCard
              title="Solde(s)"
              value={stats.balance}
              suffix="FCFA"
              className="bg-green-500 text-white"
            />
          </>
        )}
      </div>
    </Card>
  );
};
