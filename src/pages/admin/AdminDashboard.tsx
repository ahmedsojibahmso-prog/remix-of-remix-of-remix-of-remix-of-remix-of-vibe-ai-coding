import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, DollarSign, Target, Plus, Send, BarChart3, ClipboardCheck, Award, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, revenue: 0, pendingGrades: 0, pendingQA: 0, pendingReviews: 0 });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profiles, transactions, submissions, questions, reviews] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("amount_bdt").eq("status", "success"),
        supabase.from("assignment_submissions").select("id", { count: "exact", head: true }).eq("status", "submitted"),
        supabase.from("qa_questions").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_published", false),
      ]);
      const totalRevenue = (transactions.data || []).reduce((sum, t) => sum + (t.amount_bdt || 0), 0);
      setStats({
        users: profiles.count || 0,
        revenue: totalRevenue,
        pendingGrades: submissions.count || 0,
        pendingQA: questions.count || 0,
        pendingReviews: reviews.count || 0,
      });
      const { data: logs } = await supabase.from("admin_activity_logs").select("*").order("created_at", { ascending: false }).limit(5);
      setRecentLogs(logs || []);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const statCards = [
    { label: "মোট ইউজার", value: stats.users.toLocaleString(), icon: Users, color: "text-info" },
    { label: "মোট রেভিনিউ", value: `৳${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-warning" },
    { label: "পেন্ডিং গ্রেড", value: stats.pendingGrades.toString(), icon: ClipboardCheck, color: "text-destructive" },
    { label: "পেন্ডিং Q&A", value: stats.pendingQA.toString(), icon: Target, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-muted-foreground text-sm">TECH VIBE LMS ওভারভিউ</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
                <div className={`p-2 rounded-lg bg-secondary ${s.color}`}><s.icon className="h-5 w-5" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/content")}><Plus className="h-5 w-5 text-primary" /><span className="text-xs">লেসন যোগ করুন</span></Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/announcements")}><Send className="h-5 w-5 text-primary" /><span className="text-xs">ঘোষণা তৈরি</span></Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/reports")}><BarChart3 className="h-5 w-5 text-primary" /><span className="text-xs">রিপোর্ট দেখুন</span></Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/assignments")}><ClipboardCheck className="h-5 w-5 text-primary" /><span className="text-xs">গ্রেড করুন</span></Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-lg">সাম্প্রতিক লগ</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">কোনো লগ নেই</p>
            ) : recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString("bn-BD")}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-warning" />পেন্ডিং কাজ</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-warning/5 rounded-lg cursor-pointer" onClick={() => navigate("/admin/assignments")}>
              <span className="text-sm">গ্রেড করা বাকি</span><Badge className="bg-warning/10 text-warning">{stats.pendingGrades} টি</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-info/5 rounded-lg cursor-pointer" onClick={() => navigate("/admin/qa")}>
              <span className="text-sm">Q&A উত্তর দিতে হবে</span><Badge className="bg-info/10 text-info">{stats.pendingQA} টি</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-destructive/5 rounded-lg cursor-pointer" onClick={() => navigate("/admin/reviews")}>
              <span className="text-sm">রিভিউ মডারেশন</span><Badge className="bg-destructive/10 text-destructive">{stats.pendingReviews} টি</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
