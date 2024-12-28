import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, Suspense, lazy } from "react";
import { supabase } from "@/integrations/supabase/client";
import MainSidebar from "@/components/MainSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import SettingsSidebar from "@/components/SettingsSidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load components
const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const Blog = lazy(() => import("@/pages/Blog"));
const Transaction = lazy(() => import("@/pages/Transaction"));
const Clients = lazy(() => import("@/pages/Clients"));
const Withdrawals = lazy(() => import("@/pages/Withdrawals"));
const Orders = lazy(() => import("@/pages/Orders"));
const Refunds = lazy(() => import("@/pages/Refunds"));
const Settings = lazy(() => import("@/pages/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Auth = lazy(() => import("@/components/Auth"));
const ProfileForm = lazy(() => import("@/pages/ProfileForm"));

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache garbage collection after 30 minutes
    },
  },
});

function App() {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      setUserProfile(data);
    };

    fetchUserProfile();
  }, [session]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex">
          <MainSidebar />
          <div className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    session ? <Dashboard /> : <Navigate to="/auth" replace />
                  }
                />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/transaction" element={<Transaction />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/withdrawals" element={<Withdrawals />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/refunds" element={<Refunds />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<ProfileForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
          <SettingsSidebar userProfile={userProfile} />
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;