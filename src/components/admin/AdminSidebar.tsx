import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, Users, BookOpen, ClipboardCheck, HelpCircle, Star,
  BarChart3, CreditCard, Mail, Megaphone, Calendar, Gift, Globe, Settings,
} from "lucide-react";

const menuItems = [
  { title: "ড্যাশবোর্ড", url: "/admin", icon: LayoutDashboard },
  { title: "ইউজার ম্যানেজমেন্ট", url: "/admin/users", icon: Users },
  { title: "কোর্স কন্টেন্ট", url: "/admin/content", icon: BookOpen },
  { title: "অ্যাসাইনমেন্ট", url: "/admin/assignments", icon: ClipboardCheck },
  { title: "Q&A", url: "/admin/qa", icon: HelpCircle },
  { title: "রিভিউ", url: "/admin/reviews", icon: Star },
  { title: "রিপোর্ট", url: "/admin/reports", icon: BarChart3 },
  { title: "পেমেন্ট", url: "/admin/payments", icon: CreditCard },
  { title: "ইমেইল", url: "/admin/email", icon: Mail },
  { title: "ঘোষণা", url: "/admin/announcements", icon: Megaphone },
  { title: "ইভেন্ট", url: "/admin/events", icon: Calendar },
  { title: "টুলস ও গিফট", url: "/admin/tools", icon: Gift },
  { title: "ওয়েবসাইট", url: "/admin/website", icon: Globe },
  { title: "সেটিংস", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-destructive-foreground">TV</span>
            </div>
            <div>
              <span className="font-bold text-sm text-sidebar-foreground">TECH VIBE</span>
              <p className="text-[10px] text-sidebar-foreground/60">Admin Panel</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center mx-auto">
            <span className="text-sm font-bold text-destructive-foreground">TV</span>
          </div>
        )}
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Admin মেনু</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/admin"} className="hover:bg-sidebar-accent/50 transition-colors" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
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
