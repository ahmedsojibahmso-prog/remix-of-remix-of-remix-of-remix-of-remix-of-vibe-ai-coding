import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, ClipboardCheck, Clock, Flame, TrendingUp, Megaphone, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Realtime subscriptions
  useRealtimeSubscription("announcements", ["dashboard-announcements"]);
  useRealtimeSubscription("assignments", ["dashboard-assignments"]);
  useRealtimeSubscription("modules", ["dashboard-modules"]);
  useRealtimeSubscription("lessons", ["dashboard-lessons"]);
  useRealtimeSubscription("notifications", ["dashboard-notifications"]);

  const { data: announcements = [] } = useQuery({
    queryKey: ["dashboard-announcements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["dashboard-assignments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const { data: modules = [] } = useQuery({
    queryKey: ["dashboard-modules"],
    queryFn: async () => {
      const { data } = await supabase.from("modules").select("*").order("order_index");
      return data || [];
    },
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["dashboard-lessons"],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("*").order("order_index");
      return data || [];
    },
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["dashboard-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("user_progress").select("*").eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["dashboard-submissions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("assignment_submissions").select("*").eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const completedLessons = progress.filter((p: any) => p.completed).length;
  const totalLessons = lessons.length;
  const lessonPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const completedAssignments = submissions.filter((s: any) => s.status === "graded").length;
  const totalAssignments = assignments.length;
  const assignmentPercent = totalAssignments ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  const stats = [
    { label: "মডিউল", value: `${modules.length} টি`, percent: modules.length > 0 ? 100 : 0, icon: BookOpen, color: "text-info" },
    { label: "ভিডিও দেখা হয়েছে", value: `${completedLessons}/${totalLessons}`, percent: lessonPercent, icon: Play, color: "text-success" },
    { label: "অ্যাসাইনমেন্ট", value: `${completedAssignments}/${totalAssignments}`, percent: assignmentPercent, icon: ClipboardCheck, color: "text-warning" },
    { label: "মোট লেসন", value: `${totalLessons} টি`, percent: totalLessons > 0 ? 100 : 0, icon: Clock, color: "text-primary" },
  ];

  const typeColors: Record<string, string> = {
    course_update: "bg-success",
    live_class: "bg-info",
    offer: "bg-warning",
    general: "bg-muted-foreground",
    maintenance: "bg-destructive",
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "এইমাত্র";
    if (hours < 24) return `${hours} ঘন্টা আগে`;
    const days = Math.floor(hours / 24);
    return `${days} দিন আগে`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            স্বাগতম, {profile?.full_name || "শিক্ষার্থী"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">আজকের লার্নিং জার্নি শুরু করুন</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <Progress value={stat.percent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{stat.percent}% সম্পন্ন</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              শেখা চালিয়ে যান
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-24 h-16 rounded-lg gradient-bg flex items-center justify-center">
                  <Play className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {lessons.length > 0 ? lessons[0].title : "কোনো লেসন নেই"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {modules.length > 0 ? modules[0].title : "মডিউল যোগ হয়নি"}
                  </p>
                  <Progress value={lessonPercent} className="h-1.5 mt-2" />
                </div>
              </div>
              <Button size="sm" className="w-full gradient-bg text-primary-foreground" onClick={() => navigate("/dashboard/course")}>
                শেখা চালু রাখুন →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              সাম্প্রতিক ঘোষণা
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">কোনো ঘোষণা নেই</p>
            ) : (
              announcements.slice(0, 3).map((ann: any) => (
                <div key={ann.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-2 ${typeColors[ann.type] || typeColors.general}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ann.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatTime(ann.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              অ্যাসাইনমেন্ট
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">কোনো অ্যাসাইনমেন্ট নেই</p>
            ) : (
              assignments.slice(0, 3).map((asn: any) => (
                <div key={asn.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{asn.title}</p>
                    <p className="text-xs text-muted-foreground">{asn.max_points} পয়েন্ট</p>
                  </div>
                  {asn.due_date && (
                    <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded">
                      {new Date(asn.due_date).toLocaleDateString("bn-BD")}
                    </span>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              সামগ্রিক অবস্থা
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">কোর্স প্রগ্রেস</span>
                <span className="text-sm font-bold">{lessonPercent}%</span>
              </div>
              <Progress value={lessonPercent} className="h-3" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{modules.length}</p>
                  <p className="text-xs text-muted-foreground">মডিউল</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-2xl font-bold text-success">{completedLessons}</p>
                  <p className="text-xs text-muted-foreground">লেসন সম্পন্ন</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
