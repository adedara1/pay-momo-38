import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WithdrawalStats from "./WithdrawalStats";
import WithdrawalPieChart from "./WithdrawalPieChart";

const WithdrawalsList = () => {
  // Fetch withdrawals for statistics
  const { data: withdrawals } = useQuery({
    queryKey: ["withdrawals-stats"],
    queryFn: async () => {
      console.log("Fetching withdrawals...");
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq('type', 'withdrawal')
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching withdrawals:", error);
        throw error;
      }
      
      console.log("Withdrawals fetched:", data);
      return data;
    },
  });

  // Calculate statistics
  const stats = {
    total: withdrawals?.length || 0,
    success: withdrawals?.filter(t => t.status === "completed")?.length || 0,
    pending: withdrawals?.filter(t => t.status === "pending")?.length || 0,
    failed: withdrawals?.filter(t => t.status === "failed")?.length || 0,
  };

  // Prepare data for pie chart with exact colors from the image
  const pieData = [
    { name: "En attente", value: stats.pending, color: "#ffc107" },
    { name: "Succès", value: stats.success, color: "#28a745" },
    { name: "Échec", value: stats.failed, color: "#dc3545" },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes Retraits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WithdrawalStats stats={stats} />
        <WithdrawalPieChart data={pieData} />
      </div>
    </div>
  );
};

export default WithdrawalsList;