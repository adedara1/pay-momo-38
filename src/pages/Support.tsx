import { Button } from "@/components/ui/button";

const Support = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Support</h1>
      <div className="space-y-6">
        <p>Pour toute assistance, veuillez nous contacter.</p>
        <Button>Contacter le support</Button>
      </div>
    </div>
  );
};

export default Support;