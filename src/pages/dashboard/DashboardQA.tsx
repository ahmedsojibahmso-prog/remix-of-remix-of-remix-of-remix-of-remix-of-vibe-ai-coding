import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, ThumbsUp, MessageCircle, Plus, Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function DashboardQA() {
  const { user } = useAuth();
  const { toast } = useToast();
  useRealtimeSubscription("qa_questions", ["qa-questions"]);
  useRealtimeSubscription("qa_answers", ["qa-answers"]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQ, setSelectedQ] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [answerContent, setAnswerContent] = useState("");
  const [answerSubmitting, setAnswerSubmitting] = useState(false);

  const fetchQuestions = async () => {
    const { data } = await supabase.from("qa_questions").select("*").order("created_at", { ascending: false });
    setQuestions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleAsk = async () => {
    if (!user || !newTitle.trim() || !newContent.trim()) {
      toast({ title: "ত্রুটি", description: "শিরোনাম ও বিস্তারিত লিখুন", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("qa_questions").insert({ user_id: user.id, title: newTitle, content: newContent });
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "প্রশ্ন জমা হয়েছে!" });
      setNewTitle(""); setNewContent(""); setDialogOpen(false);
      fetchQuestions();
    }
    setSubmitting(false);
  };

  const openQuestion = async (q: any) => {
    setSelectedQ(q);
    const { data } = await supabase.from("qa_answers").select("*").eq("question_id", q.id).order("created_at", { ascending: true });
    setAnswers(data || []);
  };

  const submitAnswer = async () => {
    if (!user || !answerContent.trim() || !selectedQ) return;
    setAnswerSubmitting(true);
    const { error } = await supabase.from("qa_answers").insert({ user_id: user.id, question_id: selectedQ.id, content: answerContent });
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "উত্তর দেওয়া হয়েছে!" });
      setAnswerContent("");
      const { data } = await supabase.from("qa_answers").select("*").eq("question_id", selectedQ.id).order("created_at", { ascending: true });
      setAnswers(data || []);
    }
    setAnswerSubmitting(false);
  };

  const statusConfig: Record<string, { label: string; class: string }> = {
    answered: { label: "✅ উত্তর দেওয়া", class: "bg-info/10 text-info" },
    pending: { label: "⏳ পেন্ডিং", class: "bg-warning/10 text-warning" },
  };

  if (selectedQ) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedQ(null)} className="gap-2"><ArrowLeft className="h-4 w-4" />ফিরে যান</Button>
        <Card className="border-border/50">
          <CardContent className="pt-5 space-y-3">
            <h2 className="text-xl font-bold">{selectedQ.title}</h2>
            <p className="text-sm text-muted-foreground">{selectedQ.content}</p>
            <Badge className={statusConfig[selectedQ.status]?.class || statusConfig.pending.class}>
              {statusConfig[selectedQ.status]?.label || statusConfig.pending.label}
            </Badge>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-lg">{answers.length} টি উত্তর</h3>
        {answers.map(a => (
          <Card key={a.id} className="border-border/50">
            <CardContent className="pt-4">
              <p className="text-sm">{a.content}</p>
              <p className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleDateString("bn-BD")}</p>
            </CardContent>
          </Card>
        ))}

        <Card className="border-border/50">
          <CardContent className="pt-4 space-y-3">
            <Textarea placeholder="আপনার উত্তর লিখুন..." value={answerContent} onChange={e => setAnswerContent(e.target.value)} />
            <Button className="gradient-bg text-primary-foreground" onClick={submitAnswer} disabled={answerSubmitting}>
              {answerSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}উত্তর দিন
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><HelpCircle className="h-6 w-6 text-primary" />প্রশ্নোত্তর</h1>
          <p className="text-muted-foreground text-sm mt-1">প্রশ্ন করুন, উত্তর দিন, শিখুন</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg text-primary-foreground gap-2"><Plus className="h-4 w-4" />প্রশ্ন করুন</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>নতুন প্রশ্ন করুন</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="প্রশ্নের শিরোনাম" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <Textarea placeholder="বিস্তারিত লিখুন..." className="min-h-[120px]" value={newContent} onChange={e => setNewContent(e.target.value)} />
              <Button className="w-full gradient-bg text-primary-foreground" onClick={handleAsk} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}প্রশ্ন জমা দিন
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Card key={q.id} className="border-border/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openQuestion(q)}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold hover:text-primary transition-colors">{q.title}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge className={statusConfig[q.status]?.class || statusConfig.pending.class}>
                        {statusConfig[q.status]?.label || statusConfig.pending.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleDateString("bn-BD")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {questions.length === 0 && <p className="text-center text-muted-foreground py-8">এখনো কোনো প্রশ্ন নেই। প্রথম প্রশ্ন করুন!</p>}
        </div>
      )}
    </div>
  );
}
