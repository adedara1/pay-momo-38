import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            La plateforme de paiement pour les entreprises modernes
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Créez des liens de paiement, intégrez les paiements sur votre site et gérez vos transactions en toute simplicité.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="rounded-full px-8 py-6 text-lg"
            >
              Commencer maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;