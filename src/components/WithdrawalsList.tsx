import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WithdrawalStats from "./WithdrawalStats";
import WithdrawalPieChart from "./WithdrawalPieChart";
import AutoWithdrawalBanner from "./AutoWithdrawalBanner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const WithdrawalsList = () => {
  // Fetch withdrawals for statistics
  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ["withdrawals-stats"],
    queryFn: async () => {
      console.log("Fetching withdrawals...");
      const { data, error } = await supabase
        .from("payouts")
        .select(`
          *,
          profile:user_id (
            first_name,
            last_name
          )
        `)
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

  // Prepare data for pie chart
  const pieData = [
    { name: "En attente", value: stats.pending, color: "#ffc107" },
    { name: "Succès", value: stats.success, color: "#28a745" },
    { name: "Échec", value: stats.failed, color: "#dc3545" },
  ].filter(item => item.value > 0);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#ffc107]/10 text-[#ffc107] px-2 py-1 rounded-full text-xs";
      case "completed":
        return "bg-[#28a745]/10 text-[#28a745] px-2 py-1 rounded-full text-xs";
      case "failed":
        return "bg-[#dc3545]/10 text-[#dc3545] px-2 py-1 rounded-full text-xs";
      default:
        return "bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "completed":
        return "Transférée";
      case "failed":
        return "Échec";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Mes Retraits</h2>
        <AutoWithdrawalBanner />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WithdrawalStats stats={stats} />
        <WithdrawalPieChart data={pieData} />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Demandes de paiement Global FCFA Balance</h3>
          <div className="space-x-2">
            <Button variant="outline" className="space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filtrer</span>
            </Button>
            <Button variant="outline" className="space-x-2">
              <Download className="w-4 h-4" />
              <span>Exporter en CSV</span>
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>MONTANT</TableHead>
                <TableHead>STATUT</TableHead>
                <TableHead>BALANCE</TableHead>
                <TableHead>DATE DE CREATION</TableHead>
                <TableHead>MODE DE PAIEMENT</TableHead>
                <TableHead>VERS</TableHead>
                <TableHead>APPROUVÉE LE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals?.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>{withdrawal.id.slice(0, 5)}</TableCell>
                  <TableCell>{withdrawal.amount.toLocaleString()} CFA</TableCell>
                  <TableCell>
                    <span className={getStatusClass(withdrawal.status)}>
                      {getStatusText(withdrawal.status)}
                    </span>
                  </TableCell>
                  <TableCell>Wave Côte d'Ivoire</TableCell>
                  <TableCell>
                    {format(new Date(withdrawal.created_at), "dd MMM yyyy, HH:mm:ss", { locale: fr })}
                  </TableCell>
                  <TableCell>balances.add_request.mtn_open</TableCell>
                  <TableCell>
                    {withdrawal.profile?.first_name} {withdrawal.profile?.last_name}
                  </TableCell>
                  <TableCell>
                    {withdrawal.status === "completed" 
                      ? format(new Date(withdrawal.updated_at), "dd MMM yyyy, HH:mm:ss", { locale: fr })
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalsList;
