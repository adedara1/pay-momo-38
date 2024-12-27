import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Réglages</h1>
      </div>
      
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Paramètres généraux</h2>
          <p className="text-muted-foreground">
            Les paramètres seront bientôt disponibles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;