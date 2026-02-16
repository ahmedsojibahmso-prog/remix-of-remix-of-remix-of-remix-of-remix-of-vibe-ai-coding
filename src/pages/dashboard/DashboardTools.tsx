import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, ExternalLink, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const fallbackTools: Record<string, any[]> = {
  ai: [
    { name: "Cursor IDE", description: "AI-powered code editor", logo_url: null, status: "active", url: "https://cursor.sh" },
    { name: "Bolt.new", description: "AI full-stack builder", logo_url: null, status: "active", url: "https://bolt.new" },
    { name: "Lovable", description: "AI web app builder", logo_url: null, status: "active", url: "https://lovable.dev" },
    { name: "v0.dev", description: "AI UI generator", logo_url: null, status: "active", url: "https://v0.dev" },
  ],
  hosting: [
    { name: "Vercel", description: "Frontend deployment", logo_url: null, status: "active", url: "https://vercel.com" },
    { name: "Netlify", description: "JAMstack hosting", logo_url: null, status: "active", url: "https://netlify.com" },
    { name: "Railway", description: "Backend hosting", logo_url: null, status: "active", url: "https://railway.app" },
  ],
  design: [
    { name: "Figma", description: "UI/UX design tool", logo_url: null, status: "active", url: "https://figma.com" },
    { name: "Canva Pro", description: "Graphic design", logo_url: null, status: "active", url: "https://canva.com" },
  ],
  payment: [
    { name: "Stripe", description: "International payments", logo_url: null, status: "active", url: "https://stripe.com" },
    { name: "bKash", description: "Mobile banking BD", logo_url: null, status: "active", url: "https://bkash.com" },
  ],
};

const emojiMap: Record<string, string> = {
  "Cursor IDE": "🖥️", "Bolt.new": "⚡", "Lovable": "💜", "v0.dev": "🎨",
  "Vercel": "▲", "Netlify": "🌐", "Railway": "🚂",
  "Figma": "🎯", "Canva Pro": "🎨",
  "Stripe": "💳", "bKash": "📱",
};

export default function DashboardTools() {
  const { toast } = useToast();
  const [dbTools, setDbTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("tools_gifts").select("*").eq("category", "tool").then(({ data }) => {
      setDbTools(data || []);
      setLoading(false);
    });
  }, []);

  const getTools = (category: string) => {
    const fromDb = dbTools.filter(t => t.name?.toLowerCase().includes(category));
    return fromDb.length > 0 ? fromDb : fallbackTools[category] || [];
  };

  const handleVisit = (url: string | null, name: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      toast({ title: name, description: "লিঙ্ক শীঘ্রই যোগ করা হবে" });
    }
  };

  const handleTutorial = (name: string) => {
    toast({ title: `${name} Tutorial`, description: "টিউটোরিয়াল শীঘ্রই আসছে!" });
  };

  const categories = ["ai", "hosting", "design", "payment"];
  const catLabels: Record<string, string> = { ai: "AI Tools", hosting: "Hosting", design: "Design", payment: "Payment" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Wrench className="h-6 w-6 text-primary" />টুলস</h1>
        <p className="text-muted-foreground text-sm mt-1">কোর্সে ব্যবহৃত সব টুলস ও রিসোর্স</p>
      </div>

      <Tabs defaultValue="ai">
        <TabsList className="bg-secondary">
          {categories.map(c => <TabsTrigger key={c} value={c}>{catLabels[c]}</TabsTrigger>)}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(fallbackTools[cat] || []).map((tool) => (
                <Card key={tool.name} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                          {emojiMap[tool.name] || "🔧"}
                        </div>
                        <div>
                          <h3 className="font-semibold">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={tool.status === "active" ? "text-success border-success/20" : "text-warning border-warning/20"}>
                        {tool.status === "active" ? "Active" : "Coming Soon"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handleTutorial(tool.name)}>
                        <ExternalLink className="h-3 w-3" />Tutorial
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handleVisit(tool.url, tool.name)}>
                        <ExternalLink className="h-3 w-3" />Visit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
