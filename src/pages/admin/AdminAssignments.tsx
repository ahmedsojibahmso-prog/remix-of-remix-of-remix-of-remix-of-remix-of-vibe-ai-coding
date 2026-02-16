import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AdminAssignments() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeDialog, setGradeDialog] = useState<any>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [assignDialog, setAssignDialog] = useState(false);
  const [newAssign, setNewAssign] = useState({ title: "", description: "", max_points: 100, type: "project" });

  const fetchData = async () => {
    const [a, s] = await Promise.all([
      supabase.from("assignments").select("*").order("created_at", { ascending: false }),
      supabase.from("assignment_submissions").select("*").order("submitted_at", { ascending: false }),
    ]);
    setAssignments(a.data || []);
    setSubmissions(s.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleGrade = async () => {
    if (!gradeDialog || !score) return;
    const { error } = await supabase.from("assignment_submissions").update({
      score: parseInt(score), feedback, status: "graded", graded_at: new Date().toISOString(),
      grade: parseInt(score) >= (gradeDialog.pass_mark || 60) ? "pass" : "fail",
    }).eq("id", gradeDialog.id);
    if (error) toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    else { toast({ title: "গ্রেড দেওয়া হয়েছে!" }); setGradeDialog(null); fetchData(); }
  };

  const createAssignment = async () => {
    if (!newAssign.title.trim()) return;
    const { error } = await supabase.from("assignments").insert({ title: newAssign.title, description: newAssign.description, max_points: newAssign.max_points, type: newAssign.type });
    if (error) toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    else { toast({ title: "অ্যাসাইনমেন্ট তৈরি হয়েছে!" }); setAssignDialog(false); setNewAssign({ title: "", description: "", max_points: 100, type: "project" }); fetchData(); }
  };

  const deleteAssignment = async (id: string) => {
    await supabase.from("assignments").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" }); fetchData();
  };

  const getAssignmentTitle = (id: string) => assignments.find(a => a.id === id)?.title || "Unknown";
  const pendingCount = submissions.filter(s => s.status === "submitted").length;
  const gradedCount = submissions.filter(s => s.status === "graded").length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardCheck className="h-6 w-6 text-primary" />অ্যাসাইনমেন্ট</h1></div>
        <Button className="gradient-bg text-primary-foreground" onClick={() => setAssignDialog(true)}>নতুন অ্যাসাইনমেন্ট</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-warning">{pendingCount}</p><p className="text-sm text-muted-foreground">গ্রেড করা বাকি</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-success">{gradedCount}</p><p className="text-sm text-muted-foreground">গ্রেড সম্পন্ন</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-info">{assignments.length}</p><p className="text-sm text-muted-foreground">মোট অ্যাসাইনমেন্ট</p></CardContent></Card>
      </div>

      <h3 className="font-semibold text-lg">সাবমিশন</h3>
      {submissions.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">কোনো সাবমিশন নেই</p>
      ) : submissions.map(sub => (
        <Card key={sub.id} className="border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm">{getAssignmentTitle(sub.assignment_id)}</p>
                <p className="text-xs text-muted-foreground">{new Date(sub.submitted_at).toLocaleString("bn-BD")}</p>
                {sub.github_url && <a href={sub.github_url} target="_blank" className="text-xs text-primary hover:underline">GitHub</a>}
                {sub.live_demo_url && <a href={sub.live_demo_url} target="_blank" className="text-xs text-primary hover:underline ml-2">Demo</a>}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={sub.status === "graded" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                  {sub.status === "graded" ? `গ্রেড: ${sub.score}` : "নতুন"}
                </Badge>
                {sub.status !== "graded" && (
                  <Button size="sm" className="gradient-bg text-primary-foreground" onClick={() => { setGradeDialog(sub); setScore(""); setFeedback(""); }}>গ্রেড</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <h3 className="font-semibold text-lg mt-6">অ্যাসাইনমেন্ট তালিকা</h3>
      {assignments.map(a => (
        <Card key={a.id} className="border-border/50">
          <CardContent className="py-3 flex items-center justify-between">
            <div><p className="font-semibold text-sm">{a.title}</p><p className="text-xs text-muted-foreground">{a.max_points} পয়েন্ট · {a.type}</p></div>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteAssignment(a.id)}>মুছুন</Button>
          </CardContent>
        </Card>
      ))}

      {/* Grade Dialog */}
      <Dialog open={!!gradeDialog} onOpenChange={() => setGradeDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>গ্রেড দিন</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {gradeDialog?.notes && <p className="text-sm bg-secondary/50 p-3 rounded-lg">{gradeDialog.notes}</p>}
            <div className="space-y-2"><Label>স্কোর</Label><Input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="0-100" /></div>
            <div className="space-y-2"><Label>ফিডব্যাক</Label><Textarea value={feedback} onChange={e => setFeedback(e.target.value)} /></div>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={handleGrade}>গ্রেড সেভ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Assignment Dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>নতুন অ্যাসাইনমেন্ট</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>শিরোনাম</Label><Input value={newAssign.title} onChange={e => setNewAssign(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>বিবরণ</Label><Textarea value={newAssign.description} onChange={e => setNewAssign(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="space-y-2"><Label>সর্বোচ্চ পয়েন্ট</Label><Input type="number" value={newAssign.max_points} onChange={e => setNewAssign(p => ({ ...p, max_points: parseInt(e.target.value) || 100 }))} /></div>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={createAssignment}>তৈরি করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
