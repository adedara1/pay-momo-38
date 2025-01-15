import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/StatCard";
import WalletStats from "@/components/WalletStats";
import { useStatsSync } from "@/hooks/use-stats-sync";
import { useQuery } from "@tanstack/react-query";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, UserRound, Upload } from "lucide-react";
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

  // Enable stats sync
  useStatsSync(userId);

  // Fetch banner image
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

    setIsUploading(true);
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Save to banner_images table
      const { error: dbError } = await supabase
        .from('banner_images')
        .insert({
          image_url: publicUrl,
        });

      if (dbError) throw dbError;

      setBannerImage(publicUrl);
      toast({
        title: "Success",
        description: "Banner image updated successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch user profile and set userId
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

  // Use React Query for stats
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

  return (
    <>
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Banner Section */}
        <div className="relative">
          <div 
            className="w-full max-w-[100vw] px-4 py-6 mb-4 rounded-[15px] bg-white shadow-sm border-4 border-blue-500 relative overflow-hidden"
            style={{
              backgroundImage: `url('${bannerImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "auto",
              minHeight: "200px",
              aspectRatio: "16/9"
            }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="absolute top-4 left-4 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Banner Image</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {isUploading && <p className="text-sm text-gray-500">Uploading...</p>}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="absolute top-0 right-0 p-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors bg-white/80 backdrop-blur-sm">
                  <UserRound className="h-6 w-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Mon profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h1 className="text-3xl font-bold text-center text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg">
              Tableau de bord
            </h1>
          </div>
        </div>

        <div 
          className="w-full max-w-[100vw] px-4 py-6 shadow-sm"
          style={{
            background: "linear-gradient(135deg, rgba(255,236,210,1) 0%, rgba(252,182,255,1) 50%, rgba(185,178,255,1) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 px-2 md:px-4">
            Salut {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}!
          </h1>

          <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8 bg-white rounded-t-[10px]">
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
      </div>
    </>
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