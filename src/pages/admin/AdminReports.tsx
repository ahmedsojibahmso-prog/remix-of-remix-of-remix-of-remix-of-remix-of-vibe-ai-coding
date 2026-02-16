import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminReports() {
  const [stats, setStats] = useState({ users: 0, transactions: [] as any[], modules: 0, lessons: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [p, t, m, l, r] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("*").eq("status", "success").order("created_at", { ascending: false }),
        supabase.from("modules").select("id", { count: "exact", head: true }),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
      ]);
      setStats({ users: p.count || 0, transactions: t.data || [], modules: m.count || 0, lessons: l.count || 0, reviews: r.count || 0 });
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const totalRevenue = stats.transactions.reduce((s, t) => s + (t.amount_bdt || 0), 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" />রিপোর্ট ও অ্যানালিটিক্স</h1></div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold">{stats.users}</p><p className="text-xs text-muted-foreground">ইউজার</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</p><p className="text-xs text-muted-foreground">রেভিনিউ</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold">{stats.modules}</p><p className="text-xs text-muted-foreground">মডিউল</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold">{stats.reviews}</p><p className="text-xs text-muted-foreground">রিভিউ</p></CardContent></Card>
      </div>

      <Card className="border-border/50">
        <CardHeader><CardTitle>সাম্প্রতিক ট্রানজেকশন</CardTitle></CardHeader>
        <CardContent>
          {stats.transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">কোনো ট্রানজেকশন নেই</p>
          ) : stats.transactions.slice(0, 10).map(t => (
            <div key={t.id} className="flex items-center justify-between p-2 border-b border-border/30 last:border-0">
              <div><p className="text-sm">৳{t.amount_bdt}</p><p className="text-xs text-muted-foreground">{t.payment_method || "Unknown"}</p></div>
              <span className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString("bn-BD")}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
