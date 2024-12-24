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
      <DialogContent className="w-[95vw] max-w-4xl mx-auto p-4 md:p-8">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl md:text-3xl font-bold">{page.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 md:right-4 md:top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4">
          <div className="space-y-4 text-center md:text-left">
            <p className="text-gray-600 text-sm md:text-base">{page.description}</p>
            <p className="text-xl md:text-2xl font-semibold">{page.amount} FCFA</p>
            <div className="flex justify-center md:justify-start">
              <SimplePaymentButton product={page} />
            </div>
          </div>
          
          <div className="order-first md:order-last flex justify-center md:justify-start w-full">
            {page.image_url && (
              <div className="w-full aspect-[4/3] md:aspect-auto md:h-full relative">
                <img
                  src={page.image_url}
                  alt={page.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full border-b overflow-x-auto flex-nowrap justify-center">
              <TabsTrigger value="description" className="text-purple-600 text-sm md:text-base">Description</TabsTrigger>
              <TabsTrigger value="avis" className="text-purple-600 text-sm md:text-base">Avis (0)</TabsTrigger>
              <TabsTrigger value="politiques" className="text-purple-600 text-sm md:text-base">Politiques</TabsTrigger>
              <TabsTrigger value="renseignements" className="text-purple-600 text-sm md:text-base">Renseignements</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-center md:text-left">
              <p className="text-gray-600 text-sm md:text-base">{page.description}</p>
            </TabsContent>
            <TabsContent value="avis" className="mt-4">
              <div className="flex items-center justify-center md:justify-start space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3 w-3 md:h-4 md:w-4 text-yellow-400" fill="currentColor" />
                ))}
                <span className="ml-2 text-xs md:text-sm text-gray-600">(0 avis)</span>
              </div>
            </TabsContent>
            <TabsContent value="politiques" className="mt-4 text-center md:text-left">
              <p className="text-gray-600 text-sm md:text-base">Politiques de vente et conditions d'utilisation</p>
            </TabsContent>
            <TabsContent value="renseignements" className="mt-4 text-center md:text-left">
              <p className="text-gray-600 text-sm md:text-base">Informations complémentaires sur le produit</p>
            </TabsContent>
          </Tabs>

          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-purple-50 rounded-lg">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-center md:text-left">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-purple-600">Avez-vous une question ?</h3>
                <p className="text-gray-600 text-sm md:text-base mt-1">Avez-vous des questions à propos de notre produit ? N'hésitez pas à nous les poser.</p>
              </div>
              <div className="flex justify-center md:justify-start">
                <Button className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Poser une question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimplePagePreviewDialog;