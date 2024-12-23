import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Star, MessageSquare } from "lucide-react";
import SimplePaymentButton from "./SimplePaymentButton";
import { SimplePage } from "@/types/simple-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SimplePagePreviewDialogProps {
  page: SimplePage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SimplePagePreviewDialog = ({ page, open, onOpenChange }: SimplePagePreviewDialogProps) => {
  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container mx-auto px-4 py-8 max-w-4xl bg-[#FAFAFA]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/95bf1d12-36c0-4134-af27-d44df247ff03.png" alt="Logo" className="w-8 h-8" />
            <span className="text-lg font-medium">DigitStores</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-purple-600 font-medium">{page.amount} CFA</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-8">
          <h1 className="text-2xl font-semibold mb-4">{page.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <img src="/lovable-uploads/95bf1d12-36c0-4134-af27-d44df247ff03.png" alt="Store" className="w-6 h-6 rounded-full" />
              <span className="text-sm">DigitStores</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <Star className="h-4 w-4 text-yellow-400" />
              <Star className="h-4 w-4 text-yellow-400" />
              <Star className="h-4 w-4 text-yellow-400" />
              <Star className="h-4 w-4 text-yellow-400" />
            </div>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent border-b rounded-none h-auto p-0">
              <TabsTrigger 
                value="description" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none bg-transparent h-10"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="avis" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none bg-transparent h-10"
              >
                Avis (0)
              </TabsTrigger>
              <TabsTrigger 
                value="politiques" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none rounded-none bg-transparent h-10"
              >
                Politiques
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <p className="text-gray-600">{page.description}</p>
            </TabsContent>
            
            <TabsContent value="avis" className="mt-6">
              <p className="text-gray-600">Aucun avis pour le moment.</p>
            </TabsContent>
            
            <TabsContent value="politiques" className="mt-6">
              <p className="text-gray-600">Politiques de vente et conditions d'utilisation.</p>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/95bf1d12-36c0-4134-af27-d44df247ff03.png" alt="Store" className="w-8 h-8 rounded-full" />
                <span className="font-medium">DigitStores</span>
              </div>
              <Button variant="outline" className="ml-auto">
                <MessageSquare className="h-4 w-4 mr-2" />
                Poser une question
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Avez-vous des questions à propos de notre produit ? N'hésitez pas à nous les poser.
            </p>
          </div>

          <div className="mt-6">
            <SimplePaymentButton product={page} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimplePagePreviewDialog;