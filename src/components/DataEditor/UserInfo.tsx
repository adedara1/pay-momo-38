import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface UserInfoProps {
  firstName: string;
  lastName: string;
  onUpdateUserData: (field: string, value: string) => void;
}

export const UserInfo = ({ firstName, lastName, onUpdateUserData }: UserInfoProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Informations utilisateur</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prénom</label>
          <Input
            value={firstName}
            onChange={(e) => onUpdateUserData('first_name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <Input
            value={lastName}
            onChange={(e) => onUpdateUserData('last_name', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};