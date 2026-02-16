import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Eye, MessageCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const typeColors: Record<string, string> = {
  course_update: "bg-info/10 text-info border-info/20",
  live_class: "bg-success/10 text-success border-success/20",
  offer: "bg-warning/10 text-warning border-warning/20",
  maintenance: "bg-destructive/10 text-destructive border-destructive/20",
  general: "bg-secondary text-foreground",
};

const typeLabels: Record<string, string> = {
  course_update: "কোর্স আপডেট",
  live_class: "লাইভ ক্লাস",
  offer: "অফার",
  maintenance: "মেইনটেনেন্স",
  general: "সাধারণ",
};

const mockAnnouncements = [
  { id: 1, title: "নতুন Module 8 যুক্ত হয়েছে: Full Stack Deployment", content: "আজ থেকে Module 8 অ্যাক্সেস করতে পারবেন। এই মডিউলে আপনি শিখবেন কিভাবে আপনার প্রজেক্ট ডিপ্লয় করতে হয়।", type: "course_update", priority: "important", views: 234, comments: 12, created_at: "২ ঘন্টা আগে" },
  { id: 2, title: "আগামীকাল Live Q&A Session - বিকাল ৫টা", content: "সবাই জয়েন করুন আমাদের সাপ্তাহিক Q&A সেশনে। আপনার সব প্রশ্নের উত্তর পাবেন।", type: "live_class", priority: "normal", views: 156, comments: 8, created_at: "৫ ঘন্টা আগে" },
  { id: 3, title: "🎉 ঈদ স্পেশাল অফার - ৩০% ছাড়!", content: "সীমিত সময়ের জন্য ৩০% ছাড় পাচ্ছেন সব কোর্সে। কুপন কোড: EID2026", type: "offer", priority: "urgent", views: 567, comments: 45, created_at: "১ দিন আগে" },
  { id: 4, title: "সিস্টেম আপগ্রেড নোটিশ", content: "আগামীকাল রাত ২টা থেকে ৪টা পর্যন্ত সিস্টেম মেইনটেনেন্সের জন্য বন্ধ থাকবে।", type: "maintenance", priority: "normal", views: 89, comments: 2, created_at: "৩ দিন আগে" },
];

export default function DashboardAnnouncements() {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "course_update", "live_class", "offer"];

  const filtered = filter === "all" ? mockAnnouncements : mockAnnouncements.filter(a => a.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            ঘোষণা
          </h1>
          <p className="text-muted-foreground text-sm mt-1">সব সাম্প্রতিক আপডেট ও নোটিশ</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}
            className={filter === f ? "gradient-bg text-primary-foreground" : ""}>
            {f === "all" ? "সবগুলো" : typeLabels[f]}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((ann) => (
          <Card key={ann.id} className="border-border/50 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={typeColors[ann.type]}>{typeLabels[ann.type]}</Badge>
                    {ann.priority === "urgent" && <Badge variant="destructive" className="text-xs">জরুরি</Badge>}
                    {ann.priority === "important" && <Badge className="bg-warning text-warning-foreground text-xs">গুরুত্বপূর্ণ</Badge>}
                  </div>
                  <h3 className="font-semibold text-lg">{ann.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{ann.created_at}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ann.views}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{ann.comments}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
