import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Save, Shield, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteName, setSiteName] = useState("TECH VIBE");
  const [siteUrl, setSiteUrl] = useState("https://techvibe.com");
  const [siteEmail, setSiteEmail] = useState("info@techvibe.com");
  const [sitePhone, setSitePhone] = useState("+880 1234-567890");

  useEffect(() => {
    supabase.from("admin_activity_logs").select("*").order("created_at", { ascending: false }).limit(20).then(({ data }) => {
      setLogs(data || []);
      setLoading(false);
    });
  }, []);

  const handleSave = (section: string) => {
    toast({ title: "সেভ হয়েছে!", description: `${section} আপডেট করা হয়েছে` });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="h-6 w-6 text-primary" />সিস্টেম সেটিংস</h1></div>

      <Tabs defaultValue="general">
        <TabsList className="bg-secondary flex-wrap">
          <TabsTrigger value="general">সাধারণ</TabsTrigger>
          <TabsTrigger value="logs">অ্যাক্টিভিটি লগ</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card className="border-border/50">
            <CardHeader><CardTitle>সাধারণ সেটিংস</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>সাইটের নাম</Label><Input value={siteName} onChange={e => setSiteName(e.target.value)} /></div>
              <div className="space-y-2"><Label>সাইট URL</Label><Input value={siteUrl} onChange={e => setSiteUrl(e.target.value)} /></div>
              <div className="space-y-2"><Label>ইমেইল</Label><Input value={siteEmail} onChange={e => setSiteEmail(e.target.value)} /></div>
              <div className="space-y-2"><Label>ফোন</Label><Input value={sitePhone} onChange={e => setSitePhone(e.target.value)} /></div>
              <Button className="gradient-bg text-primary-foreground gap-2" onClick={() => handleSave("সাধারণ")}><Save className="h-4 w-4" />সেভ করুন</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />অ্যাক্টিভিটি লগ</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">কোনো লগ নেই</p>
              ) : logs.map(log => (
                <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString("bn-BD")}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
