import { Card } from "@/components/ui/card";

const TransactionHistory = () => {
  // Simulation de transactions
  const transactions = [];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Historique des transactions</h2>
      
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">Aucune transaction</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Montant</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{transaction.date}</td>
                  <td className="p-2">{transaction.amount} FCFA</td>
                  <td className="p-2">{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default TransactionHistory;