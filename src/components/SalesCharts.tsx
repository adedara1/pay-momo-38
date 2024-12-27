import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

const SalesCharts = () => {
  // Données pour les graphiques (à remplacer par des données réelles)
  const monthlyData = [
    { month: 'Jan', sales: 5000 },
    { month: 'Feb', sales: 6000 },
    { month: 'Mar', sales: 7500 },
    { month: 'Apr', sales: 8000 },
    { month: 'May', sales: 9000 },
    { month: 'Jun', sales: 10000 },
    { month: 'Jul', sales: 12000 },
    { month: 'Aug', sales: 14000 },
    { month: 'Sep', sales: 16000 },
    { month: 'Oct', sales: 20000 },
    { month: 'Nov', sales: 25000 },
    { month: 'Dec', sales: 35000 },
  ];

  const dailyData = [
    { day: '1', sales: 1200, visits: 1500 },
    { day: '2', sales: 1400, visits: 1700 },
    { day: '3', sales: 1100, visits: 1300 },
    { day: '4', sales: 1600, visits: 1900 },
    { day: '5', sales: 1300, visits: 1600 },
    // ... autres jours
  ];

  const topProducts = [
    { name: 'Point Abonnement', value: 25000 },
    { name: 'PG China USDT/XAF', value: 15000 },
    { name: 'Pack Formation', value: 8000 },
  ];

  return (
    <div className="space-y-6 mt-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Évolution des ventes par mois</h3>
        <LineChart width={800} height={300} data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        </LineChart>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Nombre de ventes et de visites par jour</h3>
        <LineChart width={800} height={300} data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Ventes" />
          <Line type="monotone" dataKey="visits" stroke="#82ca9d" name="Visites" />
        </LineChart>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Produits les plus vendus</h3>
        <BarChart width={800} height={300} data={topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </Card>
    </div>
  );
};

export default SalesCharts;