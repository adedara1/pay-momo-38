import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "./MobileSidebar";

const MainSidebar = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return <MobileSidebar />;
};

export default MainSidebar;