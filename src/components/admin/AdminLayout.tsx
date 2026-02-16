import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "AD";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-foreground" />
              <h2 className="text-lg font-bold hidden md:block">TECH VIBE <span className="text-primary">Admin</span></h2>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle isDark={isDark} toggle={toggle} />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">5</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-8 w-8"><AvatarImage src={profile?.avatar_url || ""} /><AvatarFallback className="bg-destructive text-destructive-foreground text-xs">{initials}</AvatarFallback></Avatar>
                    <span className="hidden md:block text-sm font-medium">Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>User Dashboard</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">লগআউট</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
