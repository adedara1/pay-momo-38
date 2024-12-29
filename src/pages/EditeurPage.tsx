import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ElementEditor from "@/components/ElementEditor";
import StyleControls from "@/components/StyleControls";

const EditeurPage = () => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [styles, setStyles] = useState({
    fontSize: 20,
    lineHeight: 45,
    fontFamily: "Palanquin",
    letterSpacing: 1,
    marginTop: 44,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0
  });

  const handleElementSelect = (element: HTMLElement) => {
    console.log("Element selected:", element);
    setSelectedElement(element);
  };

  const handleStyleChange = (newStyles: typeof styles) => {
    console.log("Applying new styles:", newStyles);
    setStyles(newStyles);
    
    if (selectedElement) {
      Object.assign(selectedElement.style, {
        fontSize: `${newStyles.fontSize}px`,
        lineHeight: `${newStyles.lineHeight}px`,
        fontFamily: newStyles.fontFamily,
        letterSpacing: `${newStyles.letterSpacing}px`,
        marginTop: `${newStyles.marginTop}px`,
        marginRight: `${newStyles.marginRight}px`,
        marginBottom: `${newStyles.marginBottom}px`,
        marginLeft: `${newStyles.marginLeft}px`,
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Editeur de page</CardTitle>
        </CardHeader>
        <CardContent>
          <ElementEditor onElementSelect={handleElementSelect} />
        </CardContent>
      </Card>
      
      <div className="w-80">
        <StyleControls 
          styles={styles}
          onStyleChange={handleStyleChange}
          disabled={!selectedElement}
        />
      </div>
    </div>
  );
};

export default EditeurPage;