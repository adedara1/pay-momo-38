import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  checkAdmin?: boolean;
}

const ProtectedRoute = ({ children, checkAdmin = false }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        setIsAuthenticated(!!session);

        if (session) {
          // Check if user is admin
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          setIsAdmin(!!adminData);

          // Only check profile and approval if not admin
          if (!adminData) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('first_name, last_name, is_approved')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (profileError) {
              throw profileError;
            }
            
            const isProfileComplete = !!profile?.first_name && !!profile?.last_name;
            setHasProfile(isProfileComplete);
            setIsApproved(!!profile?.is_approved);

            if (location.pathname === '/profile' && isProfileComplete) {
              navigate('/home');
            }

            // If user is not approved and trying to access restricted pages
            if (!profile?.is_approved && !['/profile', '/home'].includes(location.pathname)) {
              toast({
                title: "Accès refusé",
                description: "Votre compte n'a pas encore été approuvé",
                variant: "destructive",
              });
              navigate('/home');
              return;
            }
          } else {
            setHasProfile(true); // Admins don't need profile
            setIsApproved(true); // Admins are always approved
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Error",
          description: "Une erreur est survenue lors de la vérification de l'authentification",
          variant: "destructive",
        });
        setIsAuthenticated(false);
        setHasProfile(false);
        setIsAdmin(false);
        setIsApproved(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [toast, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (checkAdmin && !isAdmin) {
    toast({
      title: "Accès refusé",
      description: "Cette page est réservée aux administrateurs",
      variant: "destructive",
    });
    return <Navigate to="/home" replace />;
  }

  if (isAuthenticated && !hasProfile && !isAdmin && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;