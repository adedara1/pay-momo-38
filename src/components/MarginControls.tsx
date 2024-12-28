import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

interface MarginControlsProps {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  setMarginTop: (value: number) => void;
  setMarginRight: (value: number) => void;
  setMarginBottom: (value: number) => void;
  setMarginLeft: (value: number) => void;
}

const MarginControls = ({
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  setMarginTop,
  setMarginRight,
  setMarginBottom,
  setMarginLeft,
}: MarginControlsProps) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-medium">Marge</h3>
      
      <div className="space-y-2">
        <Label>En haut</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[marginTop]}
            onValueChange={(value) => setMarginTop(value[0])}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="w-12 text-right">{marginTop}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Droite</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[marginRight]}
            onValueChange={(value) => setMarginRight(value[0])}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="w-12 text-right">{marginRight}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>En bas</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[marginBottom]}
            onValueChange={(value) => setMarginBottom(value[0])}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="w-12 text-right">{marginBottom}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gauche</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[marginLeft]}
            onValueChange={(value) => setMarginLeft(value[0])}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="w-12 text-right">{marginLeft}</span>
        </div>
      </div>
    </div>
  );
};

export default MarginControls;