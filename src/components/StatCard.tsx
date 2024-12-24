import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  className?: string;
}

const StatCard = ({ title, value, suffix = "", className = "" }: StatCardProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold">
        {value}
        {suffix && <span className="text-sm ml-1">{suffix}</span>}
      </p>
    </Card>
  );
};

export default StatCard;