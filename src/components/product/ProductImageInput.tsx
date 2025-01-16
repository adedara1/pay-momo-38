import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProductImageInputProps {
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const ProductImageInput = ({ handleImageChange, required = true }: ProductImageInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Create a new FileList with the dropped file
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      
      // Update the input's files
      if (inputRef.current) {
        inputRef.current.files = dt.files;
        // Trigger the change event manually
        const event = new Event('change', { bubbles: true });
        inputRef.current.dispatchEvent(event);
        
        // Call the handleImageChange with the proper event
        handleImageChange({
          target: inputRef.current
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Image</label>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          required={required}
        />
        <div className="space-y-2">
          <div className="text-gray-600">
            Glissez et déposez une image ici, ou
          </div>
          <button
            type="button"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Parcourir vos fichiers
          </button>
        </div>
      </div>
    </div>
  );
};