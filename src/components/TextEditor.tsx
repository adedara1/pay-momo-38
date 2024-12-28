import { useState } from "react";
import { Bold, Italic, Underline, Strikethrough, Grid, Link } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 bg-blue-500 p-1 rounded-t-md">
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${isBold ? 'bg-blue-600' : ''} hover:bg-blue-600`}
          onClick={() => setIsBold(!isBold)}
        >
          <Bold className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${isItalic ? 'bg-blue-600' : ''} hover:bg-blue-600`}
          onClick={() => setIsItalic(!isItalic)}
        >
          <Italic className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${isUnderline ? 'bg-blue-600' : ''} hover:bg-blue-600`}
          onClick={() => setIsUnderline(!isUnderline)}
        >
          <Underline className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${isStrikethrough ? 'bg-blue-600' : ''} hover:bg-blue-600`}
          onClick={() => setIsStrikethrough(!isStrikethrough)}
        >
          <Strikethrough className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-blue-600"
        >
          <Grid className="h-4 w-4 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-blue-600"
        >
          <Link className="h-4 w-4 text-white" />
        </Button>
      </div>
      <Textarea
        placeholder="Entrer votre texte ici"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`min-h-[200px] ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''} ${
          isUnderline ? 'underline' : ''
        } ${isStrikethrough ? 'line-through' : ''}`}
      />
    </div>
  );
};

export default TextEditor;