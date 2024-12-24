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
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SimplePage } from "@/types/simple-page";
import SimplePagePreviewDialog from "./SimplePagePreviewDialog";

const SimplePagesList = () => {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<SimplePage | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const { data: pages, isLoading } = useQuery({
    queryKey: ["simple-pages"],
    queryFn: async () => {
      console.log("Fetching simple pages...");
      const { data, error } = await supabase
        .from("simple_pages")
        .select(`
          *,
          payment_links (
            id,
            paydunya_token
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching simple pages:", error);
        throw error;
      }

      console.log("Simple pages fetched:", data);
      return data as SimplePage[];
    },
  });

  const handleDelete = async (pageId: string) => {
    try {
      const { error } = await supabase
        .from("simple_pages")
        .delete()
        .eq("id", pageId);

      if (error) throw error;

      toast({
        title: "Page supprimée",
        description: "La page a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting simple page:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (page: SimplePage) => {
    setSelectedPage(page);
    setPreviewOpen(true);
  };

  const handleCopyLink = (pageId: string) => {
    const pageUrl = `${window.location.origin}/simple-pages/${pageId}`;
    navigator.clipboard.writeText(pageUrl);
    toast({
      title: "Lien copié",
      description: "Le lien de la page a été copié dans le presse-papier",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mes pages simples</h2>
      
      {isLoading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : pages?.length === 0 ? (
        <p className="text-center text-gray-500">Aucune page simple</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages?.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    {new Date(page.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{page.name}</TableCell>
                  <TableCell>{page.description}</TableCell>
                  <TableCell>{page.amount} FCFA</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(page)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyLink(page.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(page.id)}
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

      <SimplePagePreviewDialog
        page={selectedPage}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </Card>
  );
};

export default SimplePagesList;