import { Input } from "@/components/ui/input";

interface RedirectUrlInputProps {
  redirectUrl: string;
  setRedirectUrl: (url: string) => void;
}

export const RedirectUrlInput = ({ redirectUrl, setRedirectUrl }: RedirectUrlInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        URL de redirection après paiement (optionnel)
      </label>
      <Input
        type="url"
        value={redirectUrl}
        onChange={(e) => setRedirectUrl(e.target.value)}
        placeholder="https://votre-site.com/merci"
      />
    </div>
  );
};