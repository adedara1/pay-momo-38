import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductBasicInfoProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

export const ProductBasicInfo = ({
  name,
  setName,
  description,
  setDescription,
}: ProductBasicInfoProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Nom du produit</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du produit"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du produit"
          required
        />
      </div>
    </>
  );
};