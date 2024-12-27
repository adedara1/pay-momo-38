import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MainSidebar from "@/components/MainSidebar";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import ProductPage from "@/pages/ProductPage";
import Blog from "@/pages/Blog";
import Transaction from "@/pages/Transaction";
import Clients from "@/pages/Clients";
import Withdrawals from "@/pages/Withdrawals";
import Orders from "@/pages/Orders";
import Refunds from "@/pages/Refunds";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Auth from "@/components/Auth";
import ProfileForm from "@/pages/ProfileForm";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Routes that should not display the sidebar
const noSidebarRoutes = ['/product', '/auth', '/profile'];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
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
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError) {
            throw profileError;
          }
          
          // Vérifier si le profil est complet
          const isProfileComplete = !!profile?.first_name && !!profile?.last_name;
          setHasProfile(isProfileComplete);

          // Si on est sur /profile mais que le profil est déjà complet, rediriger vers home
          if (location.pathname === '/profile' && isProfileComplete) {
            navigate('/home');
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
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        setHasProfile(false);
      }
    });

    return () => subscription.unsubscribe();
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

  // Ne rediriger vers /profile que si le profil n'est pas complet et qu'on n'est pas déjà sur /profile
  if (isAuthenticated && !hasProfile && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const shouldShowSidebar = !noSidebarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="flex min-h-screen max-w-[100vw] overflow-x-hidden">
      {shouldShowSidebar && <MainSidebar />}
      <main className={`flex-1 w-full overflow-y-auto p-4 md:p-8 ${shouldShowSidebar ? 'md:ml-64 max-w-7xl mx-auto' : 'md:w-full'}`}>
        <Routes>
          <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
          <Route path="/withdrawals" element={<ProtectedRoute><Withdrawals /></ProtectedRoute>} />
          <Route path="/refunds" element={<ProtectedRoute><Refunds /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;