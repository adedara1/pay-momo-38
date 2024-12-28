import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import WalletStats from "@/components/WalletStats";
import WithdrawalsList from "@/components/WithdrawalsList";
import WithdrawalForm from "@/components/WithdrawalForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Withdrawals() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Retraits</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Demander un Retrait
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Demande de retrait</DialogTitle>
            </DialogHeader>
            <WithdrawalForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <WalletStats />
        <WithdrawalsList />
      </div>
    </div>
  );
}