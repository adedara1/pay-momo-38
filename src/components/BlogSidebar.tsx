import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { menuItems } from "@/lib/menuItems";

const BlogSidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/cba544ba-0ad2-4425-ba9c-1ce8aed026cb.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="font-semibold text-blue-600">Digit-Sarl</span>
        </div>
      </div>
      <div className="flex-1 py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors",
                location.pathname === item.path && "bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;