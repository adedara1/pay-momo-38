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
import { supabase } from "@/integrations/supabase/client";

const PaymentLinksList = () => {
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
                <TableHead>Lien</TableHead>
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
                  <TableCell>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://app.paydunya.com/checkout/invoice/${link.paydunya_token}`);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Copier le lien
                    </button>
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