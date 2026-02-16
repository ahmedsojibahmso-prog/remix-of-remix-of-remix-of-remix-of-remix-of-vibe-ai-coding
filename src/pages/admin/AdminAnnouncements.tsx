import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Plus, Edit, Trash2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminAnnouncements() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: "", content: "", type: "general", priority: "normal" });

  const fetchData = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setAnnouncements(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openDialog = (item?: any) => {
    if (item) { setEditItem(item); setForm({ title: item.title, content: item.content, type: item.type || "general", priority: item.priority || "normal" }); }
    else { setEditItem(null); setForm({ title: "", content: "", type: "general", priority: "normal" }); }
    setDialog(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) { toast({ title: "শিরোনাম ও কন্টেন্ট দিন", variant: "destructive" }); return; }
    if (editItem) {
      await supabase.from("announcements").update({ title: form.title, content: form.content, type: form.type, priority: form.priority }).eq("id", editItem.id);
      toast({ title: "আপডেট হয়েছে" });
    } else {
      await supabase.from("announcements").insert({ title: form.title, content: form.content, type: form.type, priority: form.priority });
      toast({ title: "ঘোষণা তৈরি হয়েছে" });
    }
    setDialog(false); fetchData();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" }); fetchData();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold flex items-center gap-2"><Megaphone className="h-6 w-6 text-primary" />ঘোষণা ম্যানেজমেন্ট</h1></div>
        <Button className="gradient-bg text-primary-foreground gap-2" onClick={() => openDialog()}><Plus className="h-4 w-4" />নতুন ঘোষণা</Button>
      </div>
      <div className="space-y-3">
        {announcements.map(ann => (
          <Card key={ann.id} className="border-border/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{ann.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ann.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{ann.type}</Badge>
                    {ann.priority === "urgent" && <Badge variant="destructive" className="text-xs">জরুরি</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openDialog(ann)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem(ann.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && <p className="text-center text-muted-foreground py-8">কোনো ঘোষণা নেই</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "ঘোষণা এডিট" : "নতুন ঘোষণা"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>শিরোনাম</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>কন্টেন্ট</Label><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="min-h-[100px]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>টাইপ</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="general">সাধারণ</SelectItem><SelectItem value="course_update">কোর্স আপডেট</SelectItem><SelectItem value="live_class">লাইভ ক্লাস</SelectItem><SelectItem value="offer">অফার</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>প্রায়োরিটি</Label>
                <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="normal">সাধারণ</SelectItem><SelectItem value="important">গুরুত্বপূর্ণ</SelectItem><SelectItem value="urgent">জরুরি</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={save}><Save className="h-4 w-4 mr-2" />সেভ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
