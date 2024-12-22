import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">
          Ooups, La page n'a pas été trouvée
        </h2>
        <p className="text-gray-600 max-w-md">
          Nous sommes vraiment désolés pour ce désagrément. Il semble que vous
          essayez d'accéder à une page qui a été supprimée ou qui n'a jamais
          existé.
        </p>
        <Button
          onClick={() => navigate("/dashboard")}
          className="mt-4"
        >
          Retourner au tableau de bord
        </Button>
      </div>
    </div>
  );
};

export default NotFound;