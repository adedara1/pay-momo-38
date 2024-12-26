import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSetupForm from "@/components/ProfileSetupForm";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur n'a pas de profil complet, afficher le formulaire
  if (!profile?.first_name || !profile?.last_name) {
    return <ProfileSetupForm />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;