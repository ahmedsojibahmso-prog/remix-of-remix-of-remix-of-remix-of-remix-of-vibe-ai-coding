import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Eye, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

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

export default function DashboardAnnouncements() {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "course_update", "live_class", "offer"];

  useRealtimeSubscription("announcements", ["announcements-list"]);

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const filtered = filter === "all" ? announcements : announcements.filter((a: any) => a.type === filter);

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

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold">কোনো ঘোষণা নেই</h3>
            <p className="text-sm text-muted-foreground mt-1">অ্যাডমিন নতুন ঘোষণা দিলে এখানে দেখতে পাবেন</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((ann: any) => (
            <Card key={ann.id} className="border-border/50 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={typeColors[ann.type] || typeColors.general}>
                        {typeLabels[ann.type] || typeLabels.general}
                      </Badge>
                      {ann.priority === "urgent" && <Badge variant="destructive" className="text-xs">জরুরি</Badge>}
                      {ann.priority === "important" && <Badge className="bg-warning text-warning-foreground text-xs">গুরুত্বপূর্ণ</Badge>}
                    </div>
                    <h3 className="font-semibold text-lg">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ann.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatTime(ann.created_at)}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ann.views_count || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
