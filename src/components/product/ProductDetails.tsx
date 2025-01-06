interface ProductDetailsProps {
  name: string;
  description: string | null;
  amount: number;
  imageUrl: string | null;
}

const ProductDetails = ({ name, description, amount, imageUrl }: ProductDetailsProps) => {
  return (
    <div className="space-y-4">
      {imageUrl && (
        <div className="w-full h-64 mb-6">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-gray-600">{description}</p>
      <p className="text-xl font-semibold">{amount} XOF</p>
    </div>
  );
};

export default ProductDetails;