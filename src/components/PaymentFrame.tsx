import { useSearchParams } from 'react-router-dom';

const PaymentFrame = () => {
  const [searchParams] = useSearchParams();
  const paymentUrl = searchParams.get('url');

  if (!paymentUrl) {
    return <div className="min-h-screen flex items-center justify-center">URL de paiement manquante</div>;
  }

  return (
    <div className="min-h-screen">
      <iframe
        src={paymentUrl}
        className="w-full h-screen border-0"
        allow="payment"
      />
    </div>
  );
};

export default PaymentFrame;