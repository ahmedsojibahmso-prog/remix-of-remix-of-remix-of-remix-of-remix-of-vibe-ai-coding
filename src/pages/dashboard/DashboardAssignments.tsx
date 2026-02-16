import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Clock, Award, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function DashboardAssignments() {
  const { user } = useAuth();
  const { toast } = useToast();
  useRealtimeSubscription("assignments", ["user-assignments"]);
  useRealtimeSubscription("assignment_submissions", ["user-submissions"]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitDialog, setSubmitDialog] = useState<any>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const [asn, sub] = await Promise.all([
        supabase.from("assignments").select("*").order("created_at", { ascending: false }),
        user ? supabase.from("assignment_submissions").select("*").eq("user_id", user.id) : { data: [] },
      ]);
      setAssignments(asn.data || []);
      setSubmissions(sub.data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const getSubmission = (assignmentId: string) => submissions.find(s => s.assignment_id === assignmentId);

  const handleSubmit = async () => {
    if (!user || !submitDialog) return;
    setSubmitting(true);
    const existing = getSubmission(submitDialog.id);
    if (existing) {
      const { error } = await supabase.from("assignment_submissions").update({
        github_url: githubUrl || null,
        live_demo_url: liveUrl || null,
        notes: notes || null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      }).eq("id", existing.id);
      if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); }
      else { toast({ title: "আপডেট হয়েছে!" }); }
    } else {
      const { error } = await supabase.from("assignment_submissions").insert({
        user_id: user.id,
        assignment_id: submitDialog.id,
        github_url: githubUrl || null,
        live_demo_url: liveUrl || null,
        notes: notes || null,
        status: "submitted",
      });
      if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); }
      else { toast({ title: "সাবমিট হয়েছে!" }); }
    }
    // Refresh
    const { data } = await supabase.from("assignment_submissions").select("*").eq("user_id", user.id);
    setSubmissions(data || []);
    setSubmitDialog(null);
    setGithubUrl(""); setLiveUrl(""); setNotes("");
    setSubmitting(false);
  };

  const openSubmitDialog = (asn: any) => {
    const sub = getSubmission(asn.id);
    setGithubUrl(sub?.github_url || "");
    setLiveUrl(sub?.live_demo_url || "");
    setNotes(sub?.notes || "");
    setSubmitDialog(asn);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const pending = assignments.filter(a => !getSubmission(a.id));
  const submitted = assignments.filter(a => {
    const s = getSubmission(a.id);
    return s && s.status === "submitted";
  });
  const graded = assignments.filter(a => {
    const s = getSubmission(a.id);
    return s && s.status === "graded";
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardCheck className="h-6 w-6 text-primary" />অ্যাসাইনমেন্ট</h1>
        <p className="text-muted-foreground text-sm mt-1">আপনার সব অ্যাসাইনমেন্ট ও সাবমিশন</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-warning">{pending.length}</p><p className="text-sm text-muted-foreground">পেন্ডিং</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-info">{submitted.length}</p><p className="text-sm text-muted-foreground">সাবমিটেড</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-success">{graded.length}</p><p className="text-sm text-muted-foreground">গ্রেড হয়েছে</p></CardContent></Card>
      </div>

      {assignments.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold">কোনো অ্যাসাইনমেন্ট নেই</h3>
            <p className="text-sm text-muted-foreground mt-1">অ্যাডমিন অ্যাসাইনমেন্ট যোগ করলে এখানে দেখতে পাবেন</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map((asn) => {
            const sub = getSubmission(asn.id);
            const status = sub?.status || "not_started";
            const statusLabels: Record<string, { label: string; class: string; dot: string }> = {
              not_started: { label: "শুরু হয়নি", class: "bg-warning/10 text-warning", dot: "bg-warning" },
              submitted: { label: "সাবমিটেড", class: "bg-info/10 text-info", dot: "bg-info" },
              graded: { label: "গ্রেড হয়েছে", class: "bg-success/10 text-success", dot: "bg-success" },
            };
            const cfg = statusLabels[status] || statusLabels.not_started;

            return (
              <Card key={asn.id} className="border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <h3 className="font-semibold">{asn.title}</h3>
                        <Badge className={cfg.class}>{cfg.label}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Award className="h-3 w-3" />{asn.max_points} পয়েন্ট</span>
                        {asn.due_date && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(asn.due_date).toLocaleDateString("bn-BD")}</span>}
                      </div>
                      {asn.description && <p className="text-xs text-muted-foreground mt-1">{asn.description}</p>}
                      {sub?.score != null && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-medium">স্কোর: {sub.score}/{asn.max_points}</span>
                          <Progress value={(sub.score / asn.max_points) * 100} className="h-2 flex-1 max-w-[150px]" />
                          <Badge className={sub.score >= (asn.pass_mark || 60) ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                            {sub.score >= (asn.pass_mark || 60) ? "পাস ✅" : "ফেইল ❌"}
                          </Badge>
                        </div>
                      )}
                      {sub?.feedback && <p className="text-xs text-info mt-1">ফিডব্যাক: {sub.feedback}</p>}
                    </div>
                    <div className="shrink-0">
                      {status !== "graded" && (
                        <Button size="sm" className="gradient-bg text-primary-foreground" onClick={() => openSubmitDialog(asn)}>
                          {status === "not_started" ? "শুরু করুন" : "আপডেট/সাবমিট"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!submitDialog} onOpenChange={() => setSubmitDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{submitDialog?.title} - সাবমিট</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>GitHub URL</Label><Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/..." /></div>
            <div className="space-y-2"><Label>Live Demo URL</Label><Input value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>নোট</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="আপনার কাজ সম্পর্কে লিখুন..." /></div>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}সাবমিট করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
