import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Megaphone,
  BookOpen,
  Users,
  Wrench,
  HelpCircle,
  ClipboardCheck,
  Gift,
  Star,
  CreditCard,
  UserCircle,
} from "lucide-react";

const menuItems = [
  { title: "ড্যাশবোর্ড", url: "/dashboard", icon: LayoutDashboard },
  { title: "ঘোষণা", url: "/dashboard/announcements", icon: Megaphone },
  { title: "আমার কোর্স", url: "/dashboard/course", icon: BookOpen },
  { title: "কমিউনিটি", url: "/dashboard/community", icon: Users },
  { title: "টুলস", url: "/dashboard/tools", icon: Wrench },
  { title: "প্রশ্নোত্তর", url: "/dashboard/qa", icon: HelpCircle },
  { title: "অ্যাসাইনমেন্ট", url: "/dashboard/assignments", icon: ClipboardCheck },
  { title: "ফ্রি গিফট", url: "/dashboard/gifts", icon: Gift },
  { title: "রিভিউ", url: "/dashboard/reviews", icon: Star },
  { title: "সাবস্ক্রিপশন", url: "/dashboard/subscription", icon: CreditCard },
  { title: "প্রোফাইল", url: "/dashboard/profile", icon: UserCircle },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">TV</span>
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">TECH VIBE</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-primary-foreground">TV</span>
          </div>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">মেনু</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
