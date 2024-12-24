import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  className?: string;
}

const StatCard = ({ title, value, suffix = "", className = "" }: StatCardProps) => {
  const whiteTitles = [
    "Ventes Cumulées",
    "Ventes du jours",
    "Ventes Du Mois",
    "Ventes du Mois Précédent",
    "Transactions du Mois Précédent",
    "Croissance Des Ventes",
    "Solde(s)"
  ];

  const titleColor = whiteTitles.includes(title) ? "text-white" : "text-gray-600";

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className={`text-sm font-medium mb-2 ${titleColor}`}>{title}</h3>
      <p className="text-2xl font-bold">
        {value}
        {suffix && <span className="text-sm ml-1">{suffix}</span>}
      </p>
    </Card>
  );
};

export default StatCard;