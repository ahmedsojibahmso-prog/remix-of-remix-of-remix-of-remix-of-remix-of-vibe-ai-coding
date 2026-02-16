import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Plus, Edit, Trash2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminTools() {
  const { toast } = useToast();
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", category: "tool", url: "", value_bdt: 0, status: "active" });

  const fetchData = async () => {
    const { data } = await supabase.from("tools_gifts").select("*").order("created_at", { ascending: false });
    setTools(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openDialog = (item?: any) => {
    if (item) {
      setEditItem(item);
      setForm({ name: item.name, description: item.description || "", category: item.category, url: item.url || "", value_bdt: item.value_bdt || 0, status: item.status || "active" });
    } else {
      setEditItem(null);
      setForm({ name: "", description: "", category: "tool", url: "", value_bdt: 0, status: "active" });
    }
    setDialog(true);
  };

  const save = async () => {
    if (!form.name.trim()) { toast({ title: "নাম দিন", variant: "destructive" }); return; }
    const payload = { name: form.name, description: form.description, category: form.category, url: form.url || null, value_bdt: form.value_bdt, status: form.status };
    if (editItem) {
      await supabase.from("tools_gifts").update(payload).eq("id", editItem.id);
      toast({ title: "আপডেট হয়েছে" });
    } else {
      await supabase.from("tools_gifts").insert(payload);
      toast({ title: "যোগ করা হয়েছে" });
    }
    setDialog(false); fetchData();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("tools_gifts").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" }); fetchData();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold flex items-center gap-2"><Gift className="h-6 w-6 text-primary" />টুলস ও গিফট</h1></div>
        <Button className="gradient-bg text-primary-foreground gap-2" onClick={() => openDialog()}><Plus className="h-4 w-4" />নতুন যোগ করুন</Button>
      </div>
      <div className="space-y-3">
        {tools.map(t => (
          <Card key={t.id} className="border-border/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{t.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <Badge variant="outline">{t.category}</Badge>
                    <span>৳{t.value_bdt?.toLocaleString()}</span>
                  </div>
                </div>
                <Badge className={t.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                  {t.status === "active" ? "Active" : t.status}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => openDialog(t)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteItem(t.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {tools.length === 0 && <p className="text-center text-muted-foreground py-8">কোনো টুল/গিফট নেই</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? "এডিট" : "নতুন যোগ"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>নাম</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>বিবরণ</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ক্যাটেগরি</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="tool">টুল</SelectItem><SelectItem value="template">টেমপ্লেট</SelectItem><SelectItem value="design">ডিজাইন</SelectItem><SelectItem value="ebook">ইবুক</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>মূল্য (৳)</Label><Input type="number" value={form.value_bdt} onChange={e => setForm(p => ({ ...p, value_bdt: parseInt(e.target.value) || 0 }))} /></div>
            </div>
            <div className="space-y-2"><Label>URL</Label><Input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." /></div>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={save}><Save className="h-4 w-4 mr-2" />সেভ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
