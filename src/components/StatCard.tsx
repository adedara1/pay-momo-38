import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  className?: string;
}

const StatCard = ({ title, value, suffix = "", className = "" }: StatCardProps) => {
  const [userCurrency, setUserCurrency] = useState("FCFA");
  const [isMoneyValue, setIsMoneyValue] = useState(false);

  useEffect(() => {
    const fetchUserCurrency = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('currency_iso')
          .eq('id', user.id)
          .single();
        
        if (profile?.currency_iso) {
          setUserCurrency(profile.currency_iso);
        }
      }
    };

    const moneyTitles = [
      "Ventes Cumulées",
      "Ventes du jours",
      "Ventes Du Mois",
      "Ventes du Mois Précédent",
      "Solde(s)"
    ];

    setIsMoneyValue(moneyTitles.includes(title));
    fetchUserCurrency();
  }, [title]);

  const whiteTitles = [
    "Ventes Cumulées",
    "Ventes du jours",
    "Ventes Du Mois",
    "Ventes du Mois Précédent",
    "Transactions du Mois Précédent",
    "Croissance Des Ventes",
    "Solde(s)",
    "Solde Disponible",
    "Demandes en attente",
    "Demandes validées"
  ];

  const titleColor = whiteTitles.includes(title) ? "text-white" : "text-gray-600";

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className={`text-sm font-medium mb-2 ${titleColor}`}>{title}</h3>
      <p className="text-2xl font-bold">
        {value}
        {isMoneyValue ? (
          <span className="text-sm ml-1">{userCurrency}</span>
        ) : (
          suffix && <span className="text-sm ml-1">{suffix}</span>
        )}
      </p>
    </Card>
  );
};

export default StatCard;