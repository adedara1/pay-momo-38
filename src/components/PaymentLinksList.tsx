import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const PaymentLinksList = () => {
  const { toast } = useToast();
  
  const { data: paymentLinks, isLoading } = useQuery({
    queryKey: ["payment-links"],
    queryFn: async () => {
      console.log("Fetching payment links...");
      const { data, error } = await supabase
        .from("payment_links")
        .select(`
          *,
          products (
            id
          )
        `)
        .eq("payment_type", "product")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching payment links:", error);
        throw error;
      }

      console.log("Payment links fetched:", data);
      return data;
    },
  });

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

  // Prepare data for pie chart
  const pieData = [
    { name: "En attente", value: stats.pending, color: "#FCD34D" },
    { name: "Succès", value: stats.success, color: "#10B981" },
    { name: "Échec", value: stats.failed, color: "#EF4444" },
    { name: "Annulé", value: stats.cancelled, color: "#F87171" },
  ].filter(item => item.value > 0);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("payment_links")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Lien supprimé",
        description: "Le lien de paiement a été supprimé avec succès",
      });
    } catch (error) {
      console.error("Error deleting payment link:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mes Paiements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistics Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vue d'ensemble des transactions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                Total
              </span>
              <span>{stats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Succès
              </span>
              <span>{stats.success}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                En attente
              </span>
              <span>{stats.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-300 mr-2"></span>
                Annulé
              </span>
              <span>{stats.cancelled}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                Échec
              </span>
              <span>{stats.failed}</span>
            </div>
          </div>
        </Card>

        {/* Pie Chart Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vue d'ensemble du statut des transactions</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Payment Links Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Liens de paiement</h3>
        {isLoading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : paymentLinks?.length === 0 ? (
          <p className="text-center text-gray-500">Aucun lien de paiement</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentLinks?.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      {new Date(link.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{link.amount} FCFA</TableCell>
                    <TableCell>{link.description}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          link.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {link.status}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <a
                        href={`https://checkout.moneroo.io/${link.moneroo_token}`}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`https://checkout.moneroo.io/${link.moneroo_token}`}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://checkout.moneroo.io/${link.moneroo_token}`
                            );
                            toast({
                              title: "URL copiée",
                              description: "L'URL a été copiée dans le presse-papiers",
                            });
                          }}
                        >
                          Copier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentLinksList;