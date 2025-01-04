import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const UserSearch = ({ searchQuery, setSearchQuery, onSearch, isLoading }: UserSearchProps) => {
  return (
    <div className="flex justify-end">
      <div className="flex gap-2 w-full max-w-sm">
        <Input
          placeholder="Rechercher par ID ou nom complet"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={onSearch} disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};