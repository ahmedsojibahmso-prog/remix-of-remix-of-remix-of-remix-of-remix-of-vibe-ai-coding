import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, MoreHorizontal, Loader2, ShieldCheck, ShieldOff, CheckCircle, XCircle, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AdminUsers() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

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

  const updateApprovalStatus = async (userId: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("profiles").update({ admin_status: status }).eq("user_id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: status === "approved" ? "ইউজার অনুমোদিত ✅" : "ইউজার প্রত্যাখ্যাত ❌",
      description: status === "approved" ? "ইউজার এখন লগইন করতে পারবে" : "ইউজার লগইন করতে পারবে না",
    });
    await logAction(`User ${userId} ${status}`);
    fetchUsers();
  };

  const logAction = async (action: string) => {
    if (currentUser) {
      await supabase.from("admin_activity_logs").insert({ user_id: currentUser.id, action });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || (u.phone || "").includes(search);
    const matchTab = tab === "all" || u.admin_status === tab;
    return matchSearch && matchTab;
  });

  const pendingCount = users.filter(u => u.admin_status === "pending").length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" />ইউজার ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground text-sm">মোট {users.length} জন ইউজার · {pendingCount} জন অপেক্ষমান</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">সকল ({users.length})</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            অপেক্ষমান ({pendingCount})
            {pendingCount > 0 && <span className="ml-1 w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />}
          </TabsTrigger>
          <TabsTrigger value="approved">অনুমোদিত</TabsTrigger>
          <TabsTrigger value="rejected">প্রত্যাখ্যাত</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="নাম দিয়ে খুঁজুন..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">কোনো ইউজার পাওয়া যায়নি</div>
        )}
        {filtered.map((u) => {
          const role = getUserRole(u.user_id);
          const isAdmin = role === "admin" || role === "super_admin";
          const adminStatus = u.admin_status || "pending";
          return (
            <Card key={u.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-secondary text-foreground text-xs">{(u.full_name || "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm truncate">{u.full_name || "No Name"}</p>
                      <Badge className={isAdmin ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"} variant="outline">
                        {role}
                      </Badge>
                      {getStatusBadge(adminStatus)}
                    </div>
                    <p className="text-xs text-muted-foreground">{u.phone || "No phone"} · যোগদান: {new Date(u.created_at).toLocaleDateString("bn-BD")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {adminStatus === "pending" && (
                      <>
                        <Button size="sm" variant="default" className="gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => updateApprovalStatus(u.user_id, "approved")}>
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-1" onClick={() => updateApprovalStatus(u.user_id, "rejected")}>
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {adminStatus === "rejected" && (
                          <DropdownMenuItem onClick={() => updateApprovalStatus(u.user_id, "approved")}>
                            <CheckCircle className="h-4 w-4 mr-2" />Approve করুন
                          </DropdownMenuItem>
                        )}
                        {adminStatus === "approved" && (
                          <DropdownMenuItem onClick={() => updateApprovalStatus(u.user_id, "rejected")}>
                            <XCircle className="h-4 w-4 mr-2" />Reject করুন
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleAdmin(u.user_id)}>
                          {isAdmin ? <><ShieldOff className="h-4 w-4 mr-2" />Admin সরান</> : <><ShieldCheck className="h-4 w-4 mr-2" />Admin বানান</>}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
