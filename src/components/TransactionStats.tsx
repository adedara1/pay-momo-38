import { Card } from "@/components/ui/card";

interface TransactionStatsProps {
  stats: {
    total: number;
    success: number;
    pending: number;
    cancelled: number;
    failed: number;
  };
}

const TransactionStats = ({ stats }: TransactionStatsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Vue d'ensemble des transactions</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#007bff] mr-2"></span>
            Total
          </span>
          <span>{stats.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#28a745] mr-2"></span>
            Succès
          </span>
          <span>{stats.success}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#ffc107] mr-2"></span>
            En attente
          </span>
          <span>{stats.pending}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#e84c79] mr-2"></span>
            Annulé
          </span>
          <span>{stats.cancelled}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#dc3545] mr-2"></span>
            Échec
          </span>
          <span>{stats.failed}</span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionStats;