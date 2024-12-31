import { useState } from "react";
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
import WithdrawalConfirmation from "./WithdrawalConfirmation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  amount: z.string().min(1, "Le montant est requis"),
});

export default function WithdrawalForm() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amount, setAmount] = useState("");

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setAmount(values.amount);
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <WithdrawalConfirmation
        amount={amount}
        onBack={() => {
          setShowConfirmation(false);
          form.reset();
        }}
        onEdit={() => setShowConfirmation(false)}
        userProfile={userProfile}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant de retrait (FCFA)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Continuer
        </Button>
      </form>
    </Form>
  );
}