import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "./MobileSidebar";
import BlogSidebar from "./BlogSidebar";

const MainSidebar = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? <MobileSidebar /> : <BlogSidebar />}
    </>
  );
};

export default MainSidebar;