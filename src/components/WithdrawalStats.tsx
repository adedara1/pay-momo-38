import { Card } from "@/components/ui/card";

interface WithdrawalStatsProps {
  stats: {
    total: number;
    success: number;
    pending: number;
    failed: number;
  };
}

const WithdrawalStats = ({ stats }: WithdrawalStatsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Vue d'ensemble des transferts</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#007bff] mr-2"></span>
            total
          </span>
          <span>{stats.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#28a745] mr-2"></span>
            success
          </span>
          <span>{stats.success}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#ffc107] mr-2"></span>
            pending
          </span>
          <span>{stats.pending}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#dc3545] mr-2"></span>
            failed
          </span>
          <span>{stats.failed}</span>
        </div>
      </div>
    </Card>
  );
};

export default WithdrawalStats;