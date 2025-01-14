import OrdersManagement from "@/components/OrdersManagement";

const Orders = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Commandes</h1>
      <OrdersManagement />
    </div>
  );
};

export default Orders;