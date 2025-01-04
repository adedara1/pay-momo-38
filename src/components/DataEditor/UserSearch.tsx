import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";

interface UserSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const UserSearch = ({ searchQuery, setSearchQuery, onSearch, isLoading }: UserSearchProps) => {
  const [suggestions, setSuggestions] = useState<Array<{ id: string; first_name: string; last_name: string; company_email: string }>>([]);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, company_email')
          .or(`first_name.ilike.%${debouncedSearch}%,last_name.ilike.%${debouncedSearch}%,company_email.ilike.%${debouncedSearch}%`)
          .limit(5);

        if (error) throw error;
        setSuggestions(data || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex gap-2">
        <Input
          placeholder="Rechercher par ID, email ou nom complet"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={onSearch} disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => {
                setSearchQuery(suggestion.id);
                onSearch();
                setSuggestions([]);
              }}
            >
              <div className="text-sm font-medium">
                {suggestion.first_name} {suggestion.last_name}
              </div>
              {suggestion.company_email && (
                <div className="text-xs text-gray-500">{suggestion.company_email}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};