import { useEffect } from "react";

interface PriceCalculatorProps {
  amount: string;
  feePercentage: number;
  currency: string;
}

export const PriceCalculator = ({ amount, feePercentage, currency }: PriceCalculatorProps) => {
  const calculateFinalAmount = () => {
    if (amount && !isNaN(parseFloat(amount))) {
      const baseAmount = parseFloat(amount);
      const fee = (baseAmount * feePercentage) / 100;
      return baseAmount + fee;
    }
    return 0;
  };

  const finalAmount = calculateFinalAmount();

  return amount ? (
    <div className="bg-gray-50 p-4 rounded-lg">
      <label className="block text-sm font-medium mb-2">Votre Client verra</label>
      <div className="text-lg font-semibold">
        {finalAmount.toFixed(2)} {currency}
        {feePercentage > 0 && (
          <span className="text-sm text-gray-500 ml-2">
            (inclus {feePercentage}% de frais)
          </span>
        )}
      </div>
    </div>
  ) : null;
};