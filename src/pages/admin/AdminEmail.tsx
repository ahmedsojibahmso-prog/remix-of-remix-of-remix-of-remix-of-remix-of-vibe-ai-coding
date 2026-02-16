import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminEmail() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: "ত্রুটি", description: "বিষয় ও মেসেজ লিখুন", variant: "destructive" });
      return;
    }
    setSending(true);
    // Simulate sending - in production would use edge function
    setTimeout(() => {
      toast({ title: "ইমেইল পাঠানো হয়েছে!", description: "সব ইউজারকে ইমেইল পাঠানো হচ্ছে" });
      setSubject(""); setBody("");
      setSending(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Mail className="h-6 w-6 text-primary" />ইমেইল ক্যাম্পেইন</h1></div>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">দ্রুত ইমেইল পাঠান</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>বিষয়</Label><Input placeholder="ইমেইলের বিষয় লিখুন..." value={subject} onChange={e => setSubject(e.target.value)} /></div>
          <div className="space-y-2"><Label>মেসেজ</Label><Textarea placeholder="ইমেইলের বডি লিখুন..." className="min-h-[120px]" value={body} onChange={e => setBody(e.target.value)} /></div>
          <Button className="gradient-bg text-primary-foreground gap-2" onClick={handleSend} disabled={sending}>
            <Send className="h-4 w-4" />{sending ? "পাঠানো হচ্ছে..." : "পাঠান"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
