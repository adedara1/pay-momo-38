import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TransactionStats from "./TransactionStats";
import TransactionPieChart from "./TransactionPieChart";

const PaymentLinksList = () => {
  // Fetch transactions for statistics
  const { data: transactions } = useQuery({
    queryKey: ["transactions-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Calculate statistics
  const stats = {
    total: transactions?.length || 0,
    success: transactions?.filter(t => t.status === "completed")?.length || 0,
    pending: transactions?.filter(t => t.status === "pending")?.length || 0,
    cancelled: transactions?.filter(t => t.status === "cancelled")?.length || 0,
    failed: transactions?.filter(t => t.status === "failed")?.length || 0,
  };

  // Prepare data for pie chart with exact colors from the image
  const pieData = [
    { name: "En attente", value: stats.pending, color: "#ffc107" },
    { name: "Succès", value: stats.success, color: "#28a745" },
    { name: "Échec", value: stats.failed, color: "#dc3545" },
    { name: "Annulé", value: stats.cancelled, color: "#e84c79" },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes Paiements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionStats stats={stats} />
        <TransactionPieChart data={pieData} />
      </div>
    </div>
  );
};

export default PaymentLinksList;