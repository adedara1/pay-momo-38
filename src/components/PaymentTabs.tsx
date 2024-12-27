import { useState } from "react";
import { Button } from "@/components/ui/button";
import PaymentLinksList from "./PaymentLinksList";
import TransactionHistory from "./TransactionHistory";

const PaymentTabs = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'withdrawals'>('payments');

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          variant={activeTab === 'payments' ? 'default' : 'outline'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setActiveTab('payments')}
        >
          Mes Paiements
        </Button>
        <Button
          variant={activeTab === 'withdrawals' ? 'default' : 'outline'}
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setActiveTab('withdrawals')}
        >
          Mes Retraits
        </Button>
      </div>

      {activeTab === 'payments' ? (
        <PaymentLinksList />
      ) : (
        <TransactionHistory />
      )}
    </div>
  );
};

export default PaymentTabs;