import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Filter, Plus } from "lucide-react";

const TransactionsTable = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions-list"],
    queryFn: async () => {
      console.log("Fetching transactions with profiles...");
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }
      
      console.log("Fetched transactions:", data);
      return data;
    },
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#ffc107]/10 text-[#ffc107] px-2 py-1 rounded-full text-xs";
      case "completed":
        return "bg-[#28a745]/10 text-[#28a745] px-2 py-1 rounded-full text-xs";
      case "cancelled":
        return "bg-[#e84c79]/10 text-[#e84c79] px-2 py-1 rounded-full text-xs";
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
      case "cancelled":
        return "Annulée";
      case "failed":
        return "Expirée";
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button variant="default" className="bg-blue-500 hover:bg-blue-600">Tout</Button>
          <Button variant="ghost">Réussies</Button>
          <Button variant="ghost">En attente</Button>
        </div>
        <div className="space-x-2">
          <Button variant="outline" className="space-x-2">
            <Download className="w-4 h-4" />
            <span>Exporter en CSV</span>
          </Button>
          <Button variant="outline" className="space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </Button>
          <Button className="space-x-2 bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4" />
            <span>Ajouter une transaction</span>
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MONTANT</TableHead>
              <TableHead>CLIENT</TableHead>
              <TableHead>STATUT</TableHead>
              <TableHead>DATE DE CREATION</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600">₣</span>
                    </div>
                    <span>{transaction.amount.toLocaleString()} CFA</span>
                  </div>
                </TableCell>
                <TableCell>
                  {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                </TableCell>
                <TableCell>
                  <span className={getStatusClass(transaction.status)}>
                    {getStatusText(transaction.status)}
                  </span>
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.created_at), "dd MMM yyyy, HH:mm:ss", { locale: fr })}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionsTable;