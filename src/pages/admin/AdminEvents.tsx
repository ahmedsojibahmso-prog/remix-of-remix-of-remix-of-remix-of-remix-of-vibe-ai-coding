import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Plus, Edit, Trash2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", event_date: "", type: "live_class", platform: "", meeting_url: "" });

  const fetchData = async () => {
    const [e, r] = await Promise.all([
      supabase.from("events").select("*").order("event_date", { ascending: false }),
      supabase.from("event_registrations").select("event_id"),
    ]);
    setEvents(e.data || []);
    setRegistrations(r.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getRegCount = (eventId: string) => registrations.filter(r => r.event_id === eventId).length;

  const openDialog = (item?: any) => {
    if (item) {
      setEditItem(item);
      setForm({ title: item.title, description: item.description || "", event_date: item.event_date?.slice(0, 16) || "", type: item.type || "live_class", platform: item.platform || "", meeting_url: item.meeting_url || "" });
    } else {
      setEditItem(null);
      setForm({ title: "", description: "", event_date: "", type: "live_class", platform: "", meeting_url: "" });
    }
    setDialog(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.event_date) { toast({ title: "শিরোনাম ও তারিখ দিন", variant: "destructive" }); return; }
    const payload = { title: form.title, description: form.description, event_date: form.event_date, type: form.type, platform: form.platform || null, meeting_url: form.meeting_url || null };
    if (editItem) {
      await supabase.from("events").update(payload).eq("id", editItem.id);
      toast({ title: "আপডেট হয়েছে" });
    } else {
      await supabase.from("events").insert(payload);
      toast({ title: "ইভেন্ট তৈরি হয়েছে" });
    }
    setDialog(false); fetchData();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" }); fetchData();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold flex items-center gap-2"><Calendar className="h-6 w-6 text-primary" />ইভেন্ট ম্যানেজমেন্ট</h1></div>
        <Button className="gradient-bg text-primary-foreground gap-2" onClick={() => openDialog()}><Plus className="h-4 w-4" />নতুন ইভেন্ট</Button>
      </div>
      <div className="space-y-3">
        {events.map(ev => (
          <Card key={ev.id} className="border-border/50">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground shrink-0"><Calendar className="h-5 w-5" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{ev.title}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(ev.event_date).toLocaleString("bn-BD")} · {getRegCount(ev.id)} রেজিস্টার্ড</p>
                </div>
                <Badge variant="outline">{ev.type}</Badge>
                <Button variant="ghost" size="icon" onClick={() => openDialog(ev)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem(ev.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && <p className="text-center text-muted-foreground py-8">কোনো ইভেন্ট নেই</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "ইভেন্ট এডিট" : "নতুন ইভেন্ট"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>শিরোনাম</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>বিবরণ</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="space-y-2"><Label>তারিখ ও সময়</Label><Input type="datetime-local" value={form.event_date} onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>টাইপ</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="live_class">লাইভ ক্লাস</SelectItem><SelectItem value="webinar">ওয়েবিনার</SelectItem><SelectItem value="workshop">ওয়ার্কশপ</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>প্ল্যাটফর্ম</Label><Input value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} placeholder="Zoom, Meet..." /></div>
            </div>
            <div className="space-y-2"><Label>Meeting URL</Label><Input value={form.meeting_url} onChange={e => setForm(p => ({ ...p, meeting_url: e.target.value }))} placeholder="https://..." /></div>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={save}><Save className="h-4 w-4 mr-2" />সেভ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
