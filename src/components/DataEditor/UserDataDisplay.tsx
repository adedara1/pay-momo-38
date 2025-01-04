import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserInfo } from "./UserInfo";
import { WalletInfo } from "./WalletInfo";
import { StatsEditor } from "./StatsEditor";
import { UserData } from "@/services/user-data.service";
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates";
import { useStatsSync } from "@/hooks/use-stats-sync";

interface UserDataDisplayProps {
  userData: UserData | null;
  onSave: () => void;
  onUpdateUserData: (field: string, value: string) => void;
  onUpdateStats: (field: string, value: number) => void;
}

export const UserDataDisplay = ({ 
  userData, 
  onSave, 
  onUpdateUserData, 
  onUpdateStats 
}: UserDataDisplayProps) => {
  const [isEditingStats, setIsEditingStats] = useState(false);

  // Enable realtime updates for user data
  useRealtimeUpdates(userData?.id);
  useStatsSync(userData?.id);

  if (!userData) return null;

  const toggleEditStats = () => {
    setIsEditingStats(!isEditingStats);
    if (!isEditingStats) {
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      <UserInfo
        firstName={userData.first_name}
        lastName={userData.last_name}
        onUpdateUserData={onUpdateUserData}
      />
      
      <WalletInfo wallet={userData.wallet} />
      
      <StatsEditor
        stats={userData.stats}
        isEditingStats={isEditingStats}
        onToggleEditStats={toggleEditStats}
        onUpdateStats={onUpdateStats}
      />

      <div className="flex justify-end">
        <Button onClick={onSave}>Enregistrer les modifications</Button>
      </div>
    </div>
  );
};