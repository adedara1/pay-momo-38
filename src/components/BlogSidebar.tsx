import { useLocation } from "react-router-dom";
import { menuItems } from "@/lib/menuItems";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const BlogSidebar = () => {
  const location = useLocation();

  // Ne rendre la sidebar que sur la page blog
  if (location.pathname !== "/blog") {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="hidden md:flex min-h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Digit-Sarl</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.path}
                          className="flex items-center gap-2 w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
};

export default BlogSidebar;