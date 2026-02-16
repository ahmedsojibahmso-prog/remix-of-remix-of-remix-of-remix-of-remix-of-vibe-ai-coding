import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, MessageCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminQA() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerDialog, setAnswerDialog] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState("");

  const fetchQuestions = async () => {
    const { data } = await supabase.from("qa_questions").select("*").order("created_at", { ascending: false });
    setQuestions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const openAnswer = async (q: any) => {
    setAnswerDialog(q);
    const { data } = await supabase.from("qa_answers").select("*").eq("question_id", q.id).order("created_at");
    setAnswers(data || []);
  };

  const submitAnswer = async () => {
    if (!user || !newAnswer.trim() || !answerDialog) return;
    const { error } = await supabase.from("qa_answers").insert({ user_id: user.id, question_id: answerDialog.id, content: newAnswer });
    if (error) { toast({ title: "ত্রুটি", description: error.message, variant: "destructive" }); return; }
    await supabase.from("qa_questions").update({ status: "answered" }).eq("id", answerDialog.id);
    toast({ title: "উত্তর দেওয়া হয়েছে!" });
    setNewAnswer("");
    openAnswer(answerDialog);
    fetchQuestions();
  };

  const pendingCount = questions.filter(q => q.status === "pending").length;
  const answeredCount = questions.filter(q => q.status === "answered").length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><HelpCircle className="h-6 w-6 text-primary" />Q&A ম্যানেজমেন্ট</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-destructive/20 border-2"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-destructive">{pendingCount}</p><p className="text-sm text-muted-foreground">উত্তর দেওয়া বাকি</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-success">{answeredCount}</p><p className="text-sm text-muted-foreground">উত্তর দেওয়া</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-info">{questions.length}</p><p className="text-sm text-muted-foreground">মোট প্রশ্ন</p></CardContent></Card>
      </div>
      <div className="space-y-3">
        {questions.map(q => (
          <Card key={q.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{q.title}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleDateString("bn-BD")}</p>
                </div>
                <Badge className={q.status === "pending" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}>
                  {q.status === "pending" ? "পেন্ডিং" : "উত্তর দেওয়া"}
                </Badge>
                <Button size="sm" className="gradient-bg text-primary-foreground" onClick={() => openAnswer(q)}>
                  {q.status === "pending" ? "উত্তর দিন" : "দেখুন"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {questions.length === 0 && <p className="text-center text-muted-foreground py-8">কোনো প্রশ্ন নেই</p>}
      </div>

      <Dialog open={!!answerDialog} onOpenChange={() => setAnswerDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{answerDialog?.title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm bg-secondary/50 p-3 rounded-lg">{answerDialog?.content}</p>
            <h4 className="font-semibold text-sm">{answers.length} টি উত্তর</h4>
            {answers.map(a => (
              <div key={a.id} className="bg-secondary/30 p-3 rounded-lg text-sm">
                <p>{a.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleDateString("bn-BD")}</p>
              </div>
            ))}
            <Textarea placeholder="আপনার উত্তর লিখুন..." value={newAnswer} onChange={e => setNewAnswer(e.target.value)} />
            <Button className="w-full gradient-bg text-primary-foreground" onClick={submitAnswer}>উত্তর দিন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
