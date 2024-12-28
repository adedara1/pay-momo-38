import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  amount: z.string().min(1, "Le montant est requis"),
  description: z.string().min(1, "La description est requise"),
  customer_email: z.string().email("Email invalide"),
  customer_first_name: z.string().min(1, "Le prénom est requis"),
  customer_last_name: z.string().min(1, "Le nom est requis"),
  customer_phone: z.string().min(1, "Le numéro de téléphone est requis"),
  method: z.string().min(1, "La méthode de paiement est requise"),
});

export default function WithdrawalForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      customer_email: "",
      customer_first_name: "",
      customer_last_name: "",
      customer_phone: "",
      method: "mtn_ci", // Par défaut pour MTN Côte d'Ivoire
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from("payouts")
        .insert({
          user_id: profile.id,
          amount: parseInt(values.amount),
          description: values.description,
          customer_email: values.customer_email,
          customer_first_name: values.customer_first_name,
          customer_last_name: values.customer_last_name,
          customer_phone: values.customer_phone,
          method: values.method,
          currency: "XOF",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Demande de retrait créée",
        description: "Votre demande de retrait a été créée avec succès",
      });

      form.reset();
    } catch (error) {
      console.error("Erreur lors de la création du retrait:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du retrait",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant (FCFA)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Retrait de fonds" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customer_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customer_last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="customer_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input placeholder="+225 0123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Demander un retrait
        </Button>
      </form>
    </Form>
  );
}