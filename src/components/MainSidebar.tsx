import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "./MobileSidebar";
import BlogSidebar from "./BlogSidebar";

const MainSidebar = () => {
  const isMobile = useIsMobile();

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen">
      {isMobile ? <MobileSidebar /> : <BlogSidebar />}
    </aside>
  );
};

export default MainSidebar;