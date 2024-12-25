import { useIsMobile } from "@/hooks/use-mobile";
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

const MainSidebar = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <DesktopSidebar />;
  }

  return <MobileSidebar />;
};

export default MainSidebar;