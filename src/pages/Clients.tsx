import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";

interface Client {
  id: string;
  email: string | null;
  created_at: string;
}

export default function Clients() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      console.log("Fetching clients...");
      // Modified query to directly get user data from auth.users through profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          created_at,
          user:id (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }

      // Transform the data to match our Client interface
      const transformedData: Client[] = profiles.map((profile: any) => ({
        id: profile.id,
        email: profile.user?.email,
        created_at: profile.created_at,
      }));

      console.log("Clients fetched:", transformedData);
      return transformedData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>CLIENT</TableHead>
              <TableHead className="text-right">DATE DE CREATION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-blue-600">{client.email}</span>
                </TableCell>
                <TableCell className="text-right">
                  {client.created_at && format(new Date(client.created_at), "dd MMM yyyy, HH:mm:ss", { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}