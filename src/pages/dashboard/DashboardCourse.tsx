import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Play, CheckCircle2, Lock, Clock, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function DashboardCourse() {
  const { user } = useAuth();
  const { toast } = useToast();
  useRealtimeSubscription("modules", ["course-modules"]);
  useRealtimeSubscription("lessons", ["course-lessons"]);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [mods, lsns, prog] = await Promise.all([
        supabase.from("modules").select("*").order("order_index"),
        supabase.from("lessons").select("*").order("order_index"),
        user ? supabase.from("user_progress").select("*").eq("user_id", user.id) : { data: [] },
      ]);
      setModules(mods.data || []);
      setLessons(lsns.data || []);
      setProgress(prog.data || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getModuleLessons = (moduleId: string) => lessons.filter(l => l.module_id === moduleId);
  const isCompleted = (lessonId: string) => progress.some(p => p.lesson_id === lessonId && p.completed);
  
  const getModuleProgress = (moduleId: string) => {
    const modLessons = getModuleLessons(moduleId);
    if (!modLessons.length) return 0;
    const completed = modLessons.filter(l => isCompleted(l.id)).length;
    return Math.round((completed / modLessons.length) * 100);
  };

  const totalLessons = lessons.length;
  const completedLessons = progress.filter(p => p.completed).length;
  const totalProgress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const openLesson = (lesson: any) => {
    if (lesson.status === "locked") {
      toast({ title: "লক করা আছে", description: "আগের লেসনগুলো শেষ করুন", variant: "destructive" });
      return;
    }
    setSelectedLesson(lesson);
  };

  const markComplete = async (lessonId: string) => {
    if (!user) return;
    const existing = progress.find(p => p.lesson_id === lessonId);
    if (existing) {
      await supabase.from("user_progress").update({ completed: true, completed_at: new Date().toISOString(), progress_percent: 100 }).eq("id", existing.id);
    } else {
      await supabase.from("user_progress").insert({ user_id: user.id, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString(), progress_percent: 100 });
    }
    const { data } = await supabase.from("user_progress").select("*").eq("user_id", user.id);
    setProgress(data || []);
    toast({ title: "সম্পন্ন!", description: "লেসন কমপ্লিট করা হয়েছে" });
    setSelectedLesson(null);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />আমার কোর্স</h1>
        <p className="text-muted-foreground text-sm mt-1">AI দিয়ে কোডিং শিখুন</p>
      </div>

      <Card className="border-border/50 gradient-bg text-primary-foreground">
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-90">সামগ্রিক অগ্রগতি</p>
              <p className="text-3xl font-bold">{totalProgress}%</p>
            </div>
            <div className="text-right text-sm opacity-90">
              <p>{completedLessons}/{totalLessons} লেসন সম্পন্ন</p>
              <p>{modules.length} টি মডিউল</p>
            </div>
          </div>
          <Progress value={totalProgress} className="h-3 bg-primary-foreground/20" />
        </CardContent>
      </Card>

      {modules.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">কোনো মডিউল যোগ করা হয়নি</h3>
            <p className="text-sm text-muted-foreground mt-1">অ্যাডমিন কোর্স কন্টেন্ট যোগ করলে এখানে দেখতে পাবেন</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" defaultValue={modules.map((_, i) => `module-${i}`)} className="space-y-3">
          {modules.map((mod, idx) => {
            const modLessons = getModuleLessons(mod.id);
            const modProgress = getModuleProgress(mod.id);
            const modCompleted = modLessons.filter(l => isCompleted(l.id)).length;
            return (
              <AccordionItem key={mod.id} value={`module-${idx}`} className="border border-border/50 rounded-xl overflow-hidden bg-card">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30">
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-bold shrink-0">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm md:text-base truncate">{mod.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Progress value={modProgress} className="h-1.5 flex-1 max-w-[200px]" />
                        <span className="text-xs text-muted-foreground">{modProgress}%</span>
                        <Badge variant="outline" className="text-xs">{modCompleted}/{modLessons.length}</Badge>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <div className="space-y-1 mt-2">
                    {modLessons.map((lesson) => {
                      const completed = isCompleted(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => openLesson(lesson)}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                            completed ? "hover:bg-secondary/30" : "hover:bg-primary/5"
                          }`}
                        >
                          {completed ? <CheckCircle2 className="h-5 w-5 text-success shrink-0" /> : <Play className="h-5 w-5 text-primary shrink-0" />}
                          <div className="flex-1">
                            <p className={`text-sm ${!completed ? "font-semibold" : ""}`}>{lesson.title}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDuration(lesson.duration_seconds)}
                          </div>
                          {lesson.is_free && <Badge variant="outline" className="text-xs text-success border-success/20">ফ্রি</Badge>}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Lesson Viewer Dialog */}
      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedLesson?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedLesson?.video_url ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe src={selectedLesson.video_url} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
              </div>
            ) : (
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">ভিডিও শীঘ্রই আসছে</p>
                </div>
              </div>
            )}
            {selectedLesson?.content && (
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-muted-foreground">{selectedLesson.content}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button className="gradient-bg text-primary-foreground flex-1" onClick={() => selectedLesson && markComplete(selectedLesson.id)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />সম্পন্ন হিসেবে চিহ্নিত করুন
              </Button>
              <Button variant="outline" onClick={() => setSelectedLesson(null)}>বন্ধ করুন</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
