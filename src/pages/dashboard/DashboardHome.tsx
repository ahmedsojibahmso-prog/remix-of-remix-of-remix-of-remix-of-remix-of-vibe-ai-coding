import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, ClipboardCheck, Clock, Flame, TrendingUp, Megaphone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "মডিউল সম্পন্ন", value: "8/12", percent: 67, icon: BookOpen, color: "text-info" },
  { label: "ভিডিও দেখা হয়েছে", value: "42/58", percent: 72, icon: Play, color: "text-success" },
  { label: "অ্যাসাইনমেন্ট", value: "6/10", percent: 60, icon: ClipboardCheck, color: "text-warning" },
  { label: "শেখার সময়", value: "24.5 ঘন্টা", percent: 80, icon: Clock, color: "text-primary" },
];

const announcements = [
  { title: "নতুন মডিউল যুক্ত হয়েছে: Advanced AI Prompting", time: "২ ঘন্টা আগে", type: "course_update" },
  { title: "আগামীকাল Live Class: বিকাল ৫টায়", time: "৫ ঘন্টা আগে", type: "live_class" },
  { title: "ঈদ অফার: ৩০% ছাড়!", time: "১ দিন আগে", type: "offer" },
];

const upcomingAssignments = [
  { title: "AI Chatbot Project", module: "Module 5", dueIn: "৩ দিন বাকি", points: 100 },
  { title: "Landing Page Design", module: "Module 3", dueIn: "৫ দিন বাকি", points: 80 },
  { title: "API Integration Task", module: "Module 7", dueIn: "১ সপ্তাহ বাকি", points: 120 },
];

export default function DashboardHome() {
  const { profile } = useAuth();
  const navigate = useNavigate();

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
        <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 rounded-lg border border-warning/20">
          <Flame className="h-5 w-5 text-warning" />
          <span className="text-sm font-semibold text-warning">🔥 ৭ দিনের স্ট্রিক!</span>
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
                  <p className="font-semibold text-sm truncate">1.3 First AI Prompt</p>
                  <p className="text-xs text-muted-foreground">Module 1: Introduction</p>
                  <Progress value={45} className="h-1.5 mt-2" />
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
            {announcements.map((ann, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full mt-2 ${ann.type === 'offer' ? 'bg-warning' : ann.type === 'live_class' ? 'bg-info' : 'bg-success'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{ann.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ann.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Assignments + Learning Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              আসন্ন অ্যাসাইনমেন্ট
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments.map((asn, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{asn.title}</p>
                  <p className="text-xs text-muted-foreground">{asn.module} · {asn.points} পয়েন্ট</p>
                </div>
                <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded">{asn.dueIn}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              সাপ্তাহিক অ্যাক্টিভিটি
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র"].map((day, i) => {
                const values = [45, 60, 30, 80, 55, 90, 70];
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">{day}</span>
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div className="gradient-bg h-2 rounded-full transition-all" style={{ width: `${values[i]}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{values[i]}m</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
