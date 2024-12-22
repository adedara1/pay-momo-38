import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ApiKeys = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const generateApiKey = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");
      
      // Génération d'une clé API simple pour démonstration
      const apiKey = "pk_test_" + Math.random().toString(36).substring(2, 15);
      
      toast({
        title: "Clé API générée",
        description: `Votre nouvelle clé API: ${apiKey}`,
      });
    } catch (error) {
      console.error("Error generating API key:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la clé API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Clés API</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Clé publique (Test)</p>
          <code className="block bg-white p-2 rounded border">
            pk_test_***********************
          </code>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Clé secrète (Test)</p>
          <code className="block bg-white p-2 rounded border">
            sk_test_***********************
          </code>
        </div>

        <Button 
          onClick={generateApiKey} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Génération..." : "Générer une nouvelle clé API"}
        </Button>
      </div>
    </Card>
  );
};

export default ApiKeys;