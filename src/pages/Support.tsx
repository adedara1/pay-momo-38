import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Support = () => {
  const [url, setUrl] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      new URL(url); // Validate URL format
      setDisplayUrl(url);
    } catch (error) {
      toast({
        title: "URL invalide",
        description: "Veuillez entrer une URL valide",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
          <Input
            type="url"
            placeholder="Entrez l'URL du site à afficher"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Afficher</Button>
        </form>
      </div>
      
      {displayUrl && (
        <div className="flex-1">
          <iframe
            src={displayUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default Support;