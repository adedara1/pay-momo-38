import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextEditor from "@/components/TextEditor";

const EditeurPage = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Editeur de page</CardTitle>
      </CardHeader>
      <CardContent>
        <TextEditor />
      </CardContent>
    </Card>
  );
};

export default EditeurPage;