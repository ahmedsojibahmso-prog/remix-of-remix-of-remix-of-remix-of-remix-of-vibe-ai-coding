import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Edit, Trash2, Loader2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AdminContent() {
  const { toast } = useToast();
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleDialog, setModuleDialog] = useState(false);
  const [lessonDialog, setLessonDialog] = useState<string | null>(null);
  const [editModule, setEditModule] = useState<any>(null);
  const [editLesson, setEditLesson] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", status: "published" });
  const [lessonForm, setLessonForm] = useState({ title: "", video_url: "", content: "", type: "video", status: "published", duration_seconds: 0, is_free: false });

  const fetchData = async () => {
    const [m, l] = await Promise.all([
      supabase.from("modules").select("*").order("order_index"),
      supabase.from("lessons").select("*").order("order_index"),
    ]);
    setModules(m.data || []);
    setLessons(l.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openModuleDialog = (mod?: any) => {
    if (mod) { setEditModule(mod); setForm({ title: mod.title, description: mod.description || "", status: mod.status }); }
    else { setEditModule(null); setForm({ title: "", description: "", status: "published" }); }
    setModuleDialog(true);
  };

  const saveModule = async () => {
    if (!form.title.trim()) { toast({ title: "শিরোনাম দিন", variant: "destructive" }); return; }
    if (editModule) {
      const { error } = await supabase.from("modules").update({ title: form.title, description: form.description, status: form.status }).eq("id", editModule.id);
      if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
      toast({ title: "মডিউল আপডেট হয়েছে" });
    } else {
      const { error } = await supabase.from("modules").insert({ title: form.title, description: form.description, status: form.status, order_index: modules.length });
      if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
      toast({ title: "মডিউল যোগ হয়েছে" });
    }
    setModuleDialog(false);
    fetchData();
  };

  const deleteModule = async (id: string) => {
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    else { toast({ title: "মডিউল মুছে ফেলা হয়েছে" }); fetchData(); }
  };

  const openLessonDialog = (moduleId: string, lesson?: any) => {
    setLessonDialog(moduleId);
    if (lesson) {
      setEditLesson(lesson);
      setLessonForm({ title: lesson.title, video_url: lesson.video_url || "", content: lesson.content || "", type: lesson.type, status: lesson.status, duration_seconds: lesson.duration_seconds || 0, is_free: lesson.is_free || false });
    } else {
      setEditLesson(null);
      setLessonForm({ title: "", video_url: "", content: "", type: "video", status: "published", duration_seconds: 0, is_free: false });
    }
  };

  const saveLesson = async () => {
    if (!lessonForm.title.trim() || !lessonDialog) return;
    const modLessons = lessons.filter(l => l.module_id === lessonDialog);
    if (editLesson) {
      const { error } = await supabase.from("lessons").update({ title: lessonForm.title, video_url: lessonForm.video_url || null, content: lessonForm.content || null, type: lessonForm.type, status: lessonForm.status, duration_seconds: lessonForm.duration_seconds, is_free: lessonForm.is_free }).eq("id", editLesson.id);
      if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
      toast({ title: "লেসন আপডেট হয়েছে" });
    } else {
      const { error } = await supabase.from("lessons").insert({ module_id: lessonDialog, title: lessonForm.title, video_url: lessonForm.video_url || null, content: lessonForm.content || null, type: lessonForm.type, status: lessonForm.status, duration_seconds: lessonForm.duration_seconds, is_free: lessonForm.is_free, order_index: modLessons.length });
      if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
      toast({ title: "লেসন যোগ হয়েছে" });
    }
    setLessonDialog(null);
    fetchData();
  };

  const deleteLesson = async (id: string) => {
    await supabase.from("lessons").delete().eq("id", id);
    toast({ title: "লেসন মুছে ফেলা হয়েছে" });
    fetchData();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />কোর্স কন্টেন্ট</h1>
          <p className="text-muted-foreground text-sm">{modules.length} টি মডিউল, {lessons.length} টি লেসন</p>
        </div>
        <Button className="gradient-bg text-primary-foreground gap-2" onClick={() => openModuleDialog()}><Plus className="h-4 w-4" />নতুন মডিউল</Button>
      </div>

      {modules.length === 0 ? (
        <Card className="border-border/50"><CardContent className="py-12 text-center text-muted-foreground">কোনো মডিউল নেই। উপরে "নতুন মডিউল" ক্লিক করুন।</CardContent></Card>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {modules.map((mod, idx) => {
            const modLessons = lessons.filter(l => l.module_id === mod.id);
            return (
              <AccordionItem key={mod.id} value={mod.id} className="border border-border/50 rounded-xl overflow-hidden bg-card">
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/30">
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground font-bold shrink-0">{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{mod.title}</p>
                      <p className="text-xs text-muted-foreground">{modLessons.length} লেসন</p>
                    </div>
                    <Badge className={mod.status === "published" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{mod.status === "published" ? "প্রকাশিত" : "ড্রাফট"}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <div className="space-y-2 mt-2">
                    {modLessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40">
                        <div className="flex-1"><p className="text-sm font-medium">{lesson.title}</p><p className="text-xs text-muted-foreground">{lesson.type} · {Math.floor((lesson.duration_seconds || 0) / 60)}m</p></div>
                        <Badge variant="outline" className="text-xs">{lesson.status}</Badge>
                        {lesson.is_free && <Badge className="bg-success/10 text-success text-xs">ফ্রি</Badge>}
                        <Button variant="ghost" size="icon" onClick={() => openLessonDialog(mod.id, lesson)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteLesson(lesson.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full gap-1 mt-2" onClick={() => openLessonDialog(mod.id)}><Plus className="h-3 w-3" />লেসন যোগ করুন</Button>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
                    <Button variant="outline" size="sm" onClick={() => openModuleDialog(mod)}><Edit className="h-3 w-3 mr-1" />এডিট</Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteModule(mod.id)}><Trash2 className="h-3 w-3 mr-1" />মুছুন</Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Module Dialog */}
      <Dialog open={moduleDialog} onOpenChange={setModuleDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editModule ? "মডিউল এডিট" : "নতুন মডিউল"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>শিরোনাম</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>বিবরণ</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="space-y-2">
              <Label>স্ট্যাটাস</Label>
              <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="published">প্রকাশিত</SelectItem><SelectItem value="draft">ড্রাফট</SelectItem></SelectContent>
              </Select>
            </div>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={saveModule}><Save className="h-4 w-4 mr-2" />সেভ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={!!lessonDialog} onOpenChange={() => setLessonDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editLesson ? "লেসন এডিট" : "নতুন লেসন"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>শিরোনাম</Label><Input value={lessonForm.title} onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>ভিডিও URL</Label><Input value={lessonForm.video_url} onChange={e => setLessonForm(p => ({ ...p, video_url: e.target.value }))} placeholder="https://youtube.com/embed/..." /></div>
            <div className="space-y-2"><Label>কন্টেন্ট</Label><Textarea value={lessonForm.content} onChange={e => setLessonForm(p => ({ ...p, content: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>সময় (সেকেন্ড)</Label><Input type="number" value={lessonForm.duration_seconds} onChange={e => setLessonForm(p => ({ ...p, duration_seconds: parseInt(e.target.value) || 0 }))} /></div>
              <div className="space-y-2">
                <Label>টাইপ</Label>
                <Select value={lessonForm.type} onValueChange={v => setLessonForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="video">ভিডিও</SelectItem><SelectItem value="text">টেক্সট</SelectItem><SelectItem value="quiz">কুইজ</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={lessonForm.is_free} onChange={e => setLessonForm(p => ({ ...p, is_free: e.target.checked }))} />
              <Label>ফ্রি লেসন</Label>
            </div>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={saveLesson}><Save className="h-4 w-4 mr-2" />সেভ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
