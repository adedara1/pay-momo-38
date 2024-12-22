import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy } from "lucide-react";

const ApiKeys = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [publicKey, setPublicKey] = useState("pk_test_" + Math.random().toString(36).substring(2, 15));

  const generateApiKey = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");
      
      // Génération d'une nouvelle clé API
      const newKey = "pk_test_" + Math.random().toString(36).substring(2, 15);
      setPublicKey(newKey);
      
      toast({
        title: "Nouvelle clé API générée",
        description: "La clé a été copiée dans votre presse-papiers",
      });
      
      await navigator.clipboard.writeText(newKey);
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

  const copyKey = async (key: string, type: string) => {
    await navigator.clipboard.writeText(key);
    toast({
      title: `${type} copiée`,
      description: "La clé a été copiée dans votre presse-papiers",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Clés API</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Clé publique (Test)</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 block bg-white p-2 rounded border">
              {publicKey}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyKey(publicKey, "Clé publique")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={generateApiKey} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Génération..." : "Générer une nouvelle clé API"}
        </Button>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Comment intégrer le paiement sur votre site</h3>
          <p className="text-sm text-gray-600 mb-4">
            Pour initier un paiement depuis votre site, utilisez notre API avec votre clé publique :
          </p>
          <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm overflow-x-auto">
{`// Example avec JavaScript
const initPayment = async (amount, description) => {
  const response = await fetch('https://votre-api.com/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${publicKey}'
    },
    body: JSON.stringify({ amount, description })
  });
  
  const data = await response.json();
  // Redirigez l'utilisateur vers l'URL de paiement
  window.location.href = data.payment_url;
}`}
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeys;