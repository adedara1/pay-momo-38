import { Input } from "@/components/ui/input";

interface ProductImageInputProps {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const ProductImageInput = ({ handleImageChange, required = true }: ProductImageInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Image</label>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="cursor-pointer"
        required={required}
      />
    </div>
  );
};