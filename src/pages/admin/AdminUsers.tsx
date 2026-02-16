import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Search, MoreHorizontal, Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsers() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    setUsers(profilesRes.data || []);
    setRoles(rolesRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const getUserRole = (userId: string) => {
    const userRole = roles.find(r => r.user_id === userId);
    return userRole?.role || "student";
  };

  const toggleAdmin = async (userId: string) => {
    const currentRole = getUserRole(userId);
    if (currentRole === "admin" || currentRole === "super_admin") {
      await supabase.from("user_roles").update({ role: "student" }).eq("user_id", userId);
      toast({ title: "Admin সরানো হয়েছে" });
    } else {
      await supabase.from("user_roles").update({ role: "admin" }).eq("user_id", userId);
      toast({ title: "Admin বানানো হয়েছে" });
    }
    await logAction(`Role changed for user ${userId}`);
    fetchUsers();
  };

  const logAction = async (action: string) => {
    if (currentUser) {
      await supabase.from("admin_activity_logs").insert({ user_id: currentUser.id, action });
    }
  };

  const filtered = users.filter(u =>
    !search || (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || (u.phone || "").includes(search)
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" />ইউজার ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground text-sm">মোট {users.length} জন ইউজার</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="নাম দিয়ে খুঁজুন..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-3">
        {filtered.map((u) => {
          const role = getUserRole(u.user_id);
          const isAdmin = role === "admin" || role === "super_admin";
          return (
            <Card key={u.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-foreground text-xs">{(u.full_name || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{u.full_name || "No Name"}</p>
                      <Badge className={isAdmin ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}>
                        {role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{u.phone || "No phone"} · যোগদান: {new Date(u.created_at).toLocaleDateString("bn-BD")}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleAdmin(u.user_id)}>
                        {isAdmin ? <><ShieldOff className="h-4 w-4 mr-2" />Admin সরান</> : <><ShieldCheck className="h-4 w-4 mr-2" />Admin বানান</>}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
