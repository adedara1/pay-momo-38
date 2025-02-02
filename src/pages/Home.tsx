import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import WalletStats from "@/components/WalletStats";
import { useStatsSync } from "@/hooks/use-stats-sync";
import { useQuery } from "@tanstack/react-query";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, UserRound } from "lucide-react";
import SalesCharts from "@/components/SalesCharts";
import ProtectedRoute from "@/components/routes/ProtectedRoute";
import { UserStats } from "@/types/stats";
import OrdersManagement from "@/components/OrdersManagement";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const HomeContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);
  const [userId, setUserId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState<string>('/lovable-uploads/2dae098d-873c-40ec-9994-1dcc844f975f.png');
  const [isUploading, setIsUploading] = useState(false);

  useStatsSync(userId);

  useEffect(() => {
    const fetchBannerImage = async () => {
      try {
        const { data, error } = await supabase
          .from('banner_images')
          .select('image_url')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (data && !error) {
          setBannerImage(data.image_url);
          console.log('Banner image loaded:', data.image_url);
        } else if (error) {
          console.error('Error fetching banner image:', error);
        }
      } catch (error) {
        console.error('Error in fetchBannerImage:', error);
      }
    };

    fetchBannerImage();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      
      if (img.width !== 1584 || img.height !== 140) {
        toast({
          title: "Erreur",
          description: "L'image doit être exactement de 1584x140 pixels",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('banner_images')
          .insert({
            image_url: publicUrl,
          });

        if (dbError) throw dbError;

        setBannerImage(publicUrl);
        toast({
          title: "Succès",
          description: "Image de bannière mise à jour",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Erreur",
          description: "Échec du téléchargement de l'image",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    img.src = objectUrl;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const { data: stats = {
    totalSales: 0,
    dailySales: 0,
    monthlySales: 0,
    totalTransactions: 0,
    dailyTransactions: 0,
    monthlyTransactions: 0,
    previousMonthSales: 0,
    previousMonthTransactions: 0,
    salesGrowth: 0,
    totalProducts: 0,
    visibleProducts: 0,
    soldAmount: 0
  } as UserStats } = useQuery({
    queryKey: ['home-stats', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        totalSales: data?.sales_total || 0,
        dailySales: data?.daily_sales || 0,
        monthlySales: data?.monthly_sales || 0,
        totalTransactions: data?.total_transactions || 0,
        dailyTransactions: data?.daily_transactions || 0,
        monthlyTransactions: data?.monthly_transactions || 0,
        previousMonthSales: data?.previous_month_sales || 0,
        previousMonthTransactions: data?.previous_month_transactions || 0,
        salesGrowth: data?.sales_growth || 0,
        totalProducts: data?.total_products || 0,
        visibleProducts: data?.visible_products || 0,
        soldAmount: data?.balance || 0
      } as UserStats;
    },
    enabled: !!userId
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      
      navigate("/auth");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full min-h-screen border border-white relative" style={{ backgroundColor: '#000080' }}>
      <div className="relative px-4 md:px-8">
        <div 
          className="w-full max-w-[1584px] h-[140px] mb-4 mt-[50px] rounded-[15px] bg-white shadow-sm border-4 border-blue-500 relative overflow-hidden mx-auto"
          style={{
            backgroundImage: `url('${bannerImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-0 right-0 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors bg-white/80 backdrop-blur-sm">
                <UserRound className="h-6 w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/profile-management")}>
                  Mon profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <h1 className="text-3xl font-bold text-white absolute left-16 top-1/2 transform -translate-y-1/2 drop-shadow-lg">
            Tableau de bord
          </h1>
        </div>
      </div>

      <div 
        className="w-full max-w-[100vw] px-4 py-6 shadow-sm rounded-t-[25px] relative"
        style={{
          background: "linear-gradient(135deg, rgba(255,236,210,1) 0%, rgba(252,182,255,1) 50%, rgba(185,178,255,1) 100%)",
          backdropFilter: "blur(10px)",
          height: "200px"
        }}
      >
        <h1 className="text-xl md:text-2xl font-bold mb-[40px] mt-[10px] text-gray-800 px-2 md:px-4">
          Salut {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}!
        </h1>
      </div>

      <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8 bg-white rounded-t-[25px] relative -mt-[100px]">
        <div className="mb-4 md:mb-8">
          <WalletStats />
        </div>

        <div className="mb-6">
          <OrdersManagement />
        </div>

        <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
            <div className="flex flex-col items-center justify-center mb-4">
              <h2 className="text-lg font-semibold mb-2">Afficher plus</h2>
              <CollapsibleTrigger className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                {isOpen ? (
                  <ChevronUp className="h-6 w-6 text-gray-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                )}
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
                <StatCard
                  title="Ventes Cumulées"
                  value={stats.totalSales}
                  suffix="Fcfa"
                  className="bg-blue-500 text-white"
                />
                <StatCard
                  title="Ventes du jours"
                  value={stats.dailySales}
                  className="bg-purple-500 text-white"
                />
                <StatCard
                  title="Ventes Du Mois"
                  value={stats.monthlySales}
                  className="bg-pink-500 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
                <StatCard
                  title="Total Des Transactions"
                  value={String(stats.totalTransactions).padStart(3, '0')}
                />
                <StatCard
                  title="Transactions Du Jour"
                  value={String(stats.dailyTransactions).padStart(2, '0')}
                />
                <StatCard
                  title="Transactions Du Mois"
                  value={String(stats.monthlyTransactions).padStart(2, '0')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
                <StatCard
                  title="Ventes du Mois Précédent"
                  value={stats.previousMonthSales}
                  suffix="Fcfa"
                  className="bg-blue-800 text-white"
                />
                <StatCard
                  title="Transactions du Mois Précédent"
                  value={String(stats.previousMonthTransactions).padStart(2, '0')}
                  className="bg-purple-800 text-white"
                />
                <StatCard
                  title="Croissance Des Ventes"
                  value={stats.salesGrowth}
                  suffix="%"
                  className="bg-purple-900 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <StatCard
                  title="Totals Produits"
                  value={String(stats.totalProducts).padStart(3, '0')}
                />
                <StatCard
                  title="Totals Produits Visible"
                  value={String(stats.visibleProducts).padStart(2, '0')}
                />
                <StatCard
                  title="Solde(s)"
                  value={stats.soldAmount}
                  className="bg-gray-900 text-white"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <SalesCharts />
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
};

export default Home;
