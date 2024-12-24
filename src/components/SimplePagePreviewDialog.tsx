import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
        <DialogHeader className="flex flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/9b076227-506d-4fd2-ab82-1f9fc1d8fddd.png"
              alt="DigitStores Logo" 
              className="w-8 h-8"
            />
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

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Accueil</span>
              <span>/</span>
              <span>Abonnement</span>
              <span>/</span>
              <span>{page.name}</span>
            </div>
            <h1 className="text-2xl font-medium">{page.name}</h1>
          </div>
          
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/9b076227-506d-4fd2-ab82-1f9fc1d8fddd.png"
                  alt="DigitStores" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">DigitStores</h3>
                  <div className="flex gap-1">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                <span className="text-sm text-purple-600">Catégorie</span>
                <span className="ml-2 text-sm">Abonnement</span>
              </div>
              
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[400px] bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="description" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger 
                    value="avis" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                  >
                    Avis (0)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="politiques" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                  >
                    Renseignements
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-6">
                  <p className="text-gray-600">{page.description}</p>
                </TabsContent>
                
                <TabsContent value="avis" className="mt-6">
                  <p className="text-gray-600">Aucun avis pour le moment.</p>
                </TabsContent>
                
                <TabsContent value="politiques" className="mt-6">
                  <p className="text-gray-600">Informations complémentaires sur le produit.</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/9b076227-506d-4fd2-ab82-1f9fc1d8fddd.png"
                  alt="DigitStores" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">Avez-vous des questions ?</h3>
                  <p className="text-sm text-gray-600">
                    Avez-vous des questions à propos de notre produit ? N'hésitez pas à nous les poser.
                  </p>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Poser une question
              </Button>
            </div>
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