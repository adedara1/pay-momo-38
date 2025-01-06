import { ChevronDown } from "lucide-react";

interface ProductDetailsProps {
  name: string;
  description: string | null;
  long_description: string | null;
  amount: number;
  imageUrl: string | null;
}

const ProductDetails = ({ name, description, long_description, amount, imageUrl }: ProductDetailsProps) => {
  const scrollToDescription = () => {
    const element = document.getElementById('long-description');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <p className="text-xl">{amount} XOF</p>
      {description && <p className="text-gray-600">{description}</p>}
      
      {long_description && (
        <div 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer"
          onClick={scrollToDescription}
        >
          <h2 className="text-lg">Voir plus de détails</h2>
          <ChevronDown className="w-5 h-5" />
        </div>
      )}

      {long_description && (
        <div id="long-description" className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Détails du produit</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{long_description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;