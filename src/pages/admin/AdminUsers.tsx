import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Search, Loader2, ShieldCheck, ShieldOff, CheckCircle, XCircle, Clock,
  UserCheck, UserX, UserPlus, Mail,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [confirmAction, setConfirmAction] = useState<{ userId: string; action: string; name: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
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
    setActionLoading(true);
    try {
      const { error } = await supabase.from("profiles").update({ admin_status: status }).eq("user_id", userId);
      if (error) throw error;

      // Send in-app notification to user
      const notifTitle = status === "approved" ? "একাউন্ট অনুমোদিত! ✅" : "একাউন্ট প্রত্যাখ্যাত ❌";
      const notifMessage = status === "approved"
        ? "আপনার একাউন্ট Admin দ্বারা অনুমোদিত হয়েছে। এখন আপনি সকল ফিচার ব্যবহার করতে পারবেন!"
        : "দুঃখিত, আপনার একাউন্ট প্রত্যাখ্যাত হয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।";

      await supabase.from("notifications").insert({
        user_id: userId,
        title: notifTitle,
        message: notifMessage,
        type: status === "approved" ? "success" : "warning",
      });

      // Send email notification via edge function
      try {
        await supabase.functions.invoke("send-approval-email", {
          body: { userId, status },
        });
      } catch (emailErr) {
        console.warn("Email notification failed (non-critical):", emailErr);
      }

      toast({
        title: status === "approved" ? "ইউজার অনুমোদিত ✅" : "ইউজার প্রত্যাখ্যাত ❌",
        description: status === "approved" ? "ইউজারকে নোটিফিকেশন পাঠানো হয়েছে" : "ইউজারকে জানানো হয়েছে",
      });

      await logAction(`User ${userId} ${status}`);
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const logAction = async (action: string) => {
    if (currentUser) {
      await supabase.from("admin_activity_logs").insert({ user_id: currentUser.id, action });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").includes(search);
    const matchTab = tab === "all" || (u.admin_status || "pending") === tab;
    return matchSearch && matchTab;
  });

  const pendingCount = users.filter(u => (u.admin_status || "pending") === "pending").length;
  const approvedCount = users.filter(u => u.admin_status === "approved").length;
  const rejectedCount = users.filter(u => u.admin_status === "rejected").length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />ইউজার ম্যানেজমেন্ট
        </h1>
        <p className="text-muted-foreground text-sm">সকল ইউজার পরিচালনা ও অনুমোদন</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-muted-foreground">মোট ইউজার</p>
            </div>
          </CardContent>
        </Card>
        <Card className={pendingCount > 0 ? "border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/10" : ""}>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><Clock className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">অপেক্ষমান</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><UserCheck className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-xs text-muted-foreground">অনুমোদিত</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10"><UserX className="h-5 w-5 text-destructive" /></div>
            <div>
              <p className="text-2xl font-bold">{rejectedCount}</p>
              <p className="text-xs text-muted-foreground">প্রত্যাখ্যাত</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="all">সকল ({users.length})</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              অপেক্ষমান ({pendingCount})
              {pendingCount > 0 && <span className="ml-1 w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />}
            </TabsTrigger>
            <TabsTrigger value="approved">অনুমোদিত ({approvedCount})</TabsTrigger>
            <TabsTrigger value="rejected">প্রত্যাখ্যাত ({rejectedCount})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ইউজার</TableHead>
                <TableHead>ইমেইল</TableHead>
                <TableHead>রোল</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>যোগদান</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    {tab === "pending" ? "কোনো অপেক্ষমান ইউজার নেই" : "কোনো ইউজার পাওয়া যায়নি"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => {
                  const role = getUserRole(u.user_id);
                  const isAdmin = role === "admin" || role === "super_admin";
                  const adminStatus = u.admin_status || "pending";
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">
                              {(u.full_name || "U")[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{u.full_name || "No Name"}</p>
                            <p className="text-xs text-muted-foreground">{u.phone || ""}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{u.email || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={isAdmin ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-primary/10 text-primary border-primary/20"}>
                          {role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(adminStatus)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString("bn-BD")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {adminStatus === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white h-8"
                                onClick={() => setConfirmAction({ userId: u.user_id, action: "approved", name: u.full_name || "User" })}
                              >
                                <CheckCircle className="h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1 h-8"
                                onClick={() => setConfirmAction({ userId: u.user_id, action: "rejected", name: u.full_name || "User" })}
                              >
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </Button>
                            </>
                          )}
                          {adminStatus !== "pending" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8">অ্যাকশন</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {adminStatus === "rejected" && (
                                  <DropdownMenuItem onClick={() => setConfirmAction({ userId: u.user_id, action: "approved", name: u.full_name || "User" })}>
                                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />Approve করুন
                                  </DropdownMenuItem>
                                )}
                                {adminStatus === "approved" && (
                                  <DropdownMenuItem onClick={() => setConfirmAction({ userId: u.user_id, action: "rejected", name: u.full_name || "User" })}>
                                    <XCircle className="h-4 w-4 mr-2 text-destructive" />Reject করুন
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toggleAdmin(u.user_id)}>
                                  {isAdmin ? <><ShieldOff className="h-4 w-4 mr-2" />Admin সরান</> : <><ShieldCheck className="h-4 w-4 mr-2" />Admin বানান</>}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.action === "approved" ? "ইউজার অনুমোদন করুন" : "ইউজার প্রত্যাখ্যান করুন"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি <strong>{confirmAction?.name}</strong> কে{" "}
              {confirmAction?.action === "approved" ? "অনুমোদন" : "প্রত্যাখ্যান"} করতে চান?
              {confirmAction?.action === "approved" && " ইউজার এরপর লগইন করতে এবং ড্যাশবোর্ড ব্যবহার করতে পারবে।"}
              {confirmAction?.action === "rejected" && " ইউজার লগইন করতে পারবে না।"}
              {" "}ইউজারকে ইমেইল ও নোটিফিকেশন পাঠানো হবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              disabled={actionLoading}
              className={confirmAction?.action === "approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90"}
              onClick={() => confirmAction && updateApprovalStatus(confirmAction.userId, confirmAction.action as "approved" | "rejected")}
            >
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {confirmAction?.action === "approved" ? "Approve করুন" : "Reject করুন"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
