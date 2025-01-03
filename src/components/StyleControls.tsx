import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MarginControls from "./MarginControls";

interface StyleControlsProps {
  styles: {
    fontSize: number;
    lineHeight: number;
    fontFamily: string;
    letterSpacing: number;
    marginTop: number;
    marginRight: number;
    marginBottom: number;
    marginLeft: number;
  };
  onStyleChange: (styles: StyleControlsProps["styles"]) => void;
  disabled?: boolean;
}

const StyleControls = ({ styles, onStyleChange, disabled = false }: StyleControlsProps) => {
  const handleStyleChange = (key: keyof typeof styles, value: number | string) => {
    onStyleChange({
      ...styles,
      [key]: value
    });
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Taille</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[styles.fontSize]}
              onValueChange={(value) => handleStyleChange("fontSize", value[0])}
              min={8}
              max={72}
              step={1}
              disabled={disabled}
              className="flex-1"
            />
            <span className="w-12 text-right">{styles.fontSize}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Hauteur de la ligne</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[styles.lineHeight]}
              onValueChange={(value) => handleStyleChange("lineHeight", value[0])}
              min={10}
              max={100}
              step={1}
              disabled={disabled}
              className="flex-1"
            />
            <span className="w-12 text-right">{styles.lineHeight}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Type de police</Label>
          <Select
            value={styles.fontFamily}
            onValueChange={(value) => handleStyleChange("fontFamily", value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Palanquin">Palanquin</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Espacement des lettres</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[styles.letterSpacing]}
              onValueChange={(value) => handleStyleChange("letterSpacing", value[0])}
              min={0}
              max={10}
              step={0.1}
              disabled={disabled}
              className="flex-1"
            />
            <span className="w-12 text-right">{styles.letterSpacing}</span>
          </div>
        </div>

        <MarginControls
          marginTop={styles.marginTop}
          marginRight={styles.marginRight}
          marginBottom={styles.marginBottom}
          marginLeft={styles.marginLeft}
          setMarginTop={(value) => handleStyleChange("marginTop", value)}
          setMarginRight={(value) => handleStyleChange("marginRight", value)}
          setMarginBottom={(value) => handleStyleChange("marginBottom", value)}
          setMarginLeft={(value) => handleStyleChange("marginLeft", value)}
        />
      </div>
    </div>
  );
};

export default StyleControls;