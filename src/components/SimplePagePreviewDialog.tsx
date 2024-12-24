import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import PaymentLinkButton from "./PaymentLinkButton";
import SimplePaymentButton from "./SimplePaymentButton";
import { SimplePage } from "@/types/simple-page";

interface SimplePagePreviewDialogProps {
  page: SimplePage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSimplePayment?: boolean;
}

const SimplePagePreviewDialog = ({ page, open, onOpenChange, isSimplePayment = false }: SimplePagePreviewDialogProps) => {
  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <DialogTitle className="text-3xl font-bold">{page.name}</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600">{page.description}</p>
              <p className="text-2xl font-semibold">{page.amount} FCFA</p>
              {isSimplePayment ? (
                <SimplePaymentButton product={page} />
              ) : (
                <PaymentLinkButton product={page} />
              )}
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
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SimplePagePreviewDialog;