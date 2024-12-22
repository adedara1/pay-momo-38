import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const PaymentLinksList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: paymentLinks, isLoading } = useQuery({
    queryKey: ["payment-links"],
    queryFn: async () => {
      console.log("Fetching payment links...");
      const { data, error } = await supabase
        .from("payment_links")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching payment links:", error);
        throw error;
      }

      console.log("Payment links fetched:", data);
      return data;
    },
  });

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

      // Refresh the payment links list
      queryClient.invalidateQueries({ queryKey: ["payment-links"] });
    } catch (error) {
      console.error("Error deleting payment link:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const getPaymentUrl = (token: string) => {
    return `https://app.paydunya.com/checkout/invoice/${token}`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Liens de paiement</h2>
      
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
                      href={getPaymentUrl(link.paydunya_token)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {getPaymentUrl(link.paydunya_token)}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(getPaymentUrl(link.paydunya_token));
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
  );
};

export default PaymentLinksList;