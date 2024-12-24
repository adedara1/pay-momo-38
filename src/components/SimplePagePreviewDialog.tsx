import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Star, MessageSquare } from "lucide-react";
import SimplePaymentButton from "./SimplePaymentButton";
import { SimplePage } from "@/types/simple-page";

interface SimplePagePreviewDialogProps {
  page: SimplePage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SimplePagePreviewDialog = ({ page, open, onOpenChange }: SimplePagePreviewDialogProps) => {
  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container mx-auto px-4 py-8 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{page.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div className="space-y-4">
            <p className="text-gray-600">{page.description}</p>
            <p className="text-2xl font-semibold">{page.amount} FCFA</p>
            <SimplePaymentButton product={page} />
          </div>
          
          <div className="order-first md:order-last">
            {page.image_url && (
              <img
                src={page.image_url}
                alt={page.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Nouvelle section avec les onglets et la section questions */}
        <div className="mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full border-b">
              <TabsTrigger value="description" className="text-purple-600">Description</TabsTrigger>
              <TabsTrigger value="avis" className="text-purple-600">Avis (0)</TabsTrigger>
              <TabsTrigger value="politiques" className="text-purple-600">Politiques</TabsTrigger>
              <TabsTrigger value="renseignements" className="text-purple-600">Renseignements</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-gray-600">{page.description}</p>
            </TabsContent>
            <TabsContent value="avis" className="mt-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                ))}
                <span className="ml-2 text-sm text-gray-600">(0 avis)</span>
              </div>
            </TabsContent>
            <TabsContent value="politiques" className="mt-4">
              <p className="text-gray-600">Politiques de vente et conditions d'utilisation</p>
            </TabsContent>
            <TabsContent value="renseignements" className="mt-4">
              <p className="text-gray-600">Informations complémentaires sur le produit</p>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-6 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-purple-600">Avez-vous une question ?</h3>
                <p className="text-gray-600 mt-1">Avez-vous des questions à propos de notre produit ? N'hésitez pas à nous les poser.</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Poser une question
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimplePagePreviewDialog;