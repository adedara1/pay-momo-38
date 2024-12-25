import { Card } from "@/components/ui/card";

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:ml-64">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Notre Blog</h1>
            <p className="text-gray-600">
              Découvrez nos derniers articles sur les paiements en ligne et l'e-commerce au Sénégal.
            </p>
          </div>
          
          <div className="order-first md:order-last">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="Blog Header"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Blog;