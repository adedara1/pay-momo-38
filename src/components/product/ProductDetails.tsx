import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ProductDetailsProps {
  name: string;
  description: string | null;
  long_description: string | null;
  amount: number;
  imageUrl: string | null;
}

const ProductDetails = ({ name, description, long_description, amount }: ProductDetailsProps) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
    if (!isDetailsVisible) {
      setTimeout(() => {
        const element = document.getElementById('long-description');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-xl">{amount} XOF</p>
      {description && <p className="text-gray-600">{description}</p>}
      
      {long_description && (
        <div 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer"
          onClick={toggleDetails}
        >
          <h2 className="text-lg">Voir plus de détails</h2>
          <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${isDetailsVisible ? 'rotate-180' : ''}`} />
        </div>
      )}

      {long_description && isDetailsVisible && (
        <>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4">
                <div className="w-2 h-2 rounded-full bg-blue-200" />
              </span>
            </div>
          </div>
          <div id="long-description" className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Détails du produit</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{long_description}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;