import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Download, Eye, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const fallbackGifts: Record<string, any[]> = {
  templates: [
    { name: "SaaS Dashboard Template", value_bdt: 5000, description: "Full SaaS dashboard with auth, billing, and analytics", url: null },
    { name: "Landing Page Kit", value_bdt: 3000, description: "10+ responsive landing page templates", url: null },
    { name: "E-commerce Starter", value_bdt: 8000, description: "Complete e-commerce starter with cart and checkout", url: null },
  ],
  design: [
    { name: "Premium UI Kit (500+ Components)", value_bdt: 10000, description: "500+ React components for any project", url: null },
    { name: "Icon Pack (2000+ Icons)", value_bdt: 2000, description: "2000+ custom SVG icons", url: null },
  ],
  tools: [
    { name: "Vercel Pro Credits (3 months)", value_bdt: 5000, description: "3 months of Vercel Pro hosting", url: null },
    { name: "Figma Pro (1 month)", value_bdt: 1500, description: "1 month Figma Pro subscription", url: null },
  ],
  ebooks: [
    { name: "ফ্রিল্যান্সিং গাইড বাংলায়", value_bdt: 1000, description: "Complete freelancing guide in Bengali", url: null },
    { name: "AI Coding Complete Guide", value_bdt: 2000, description: "Master AI-powered coding", url: null },
  ],
};

export default function DashboardGifts() {
  const { toast } = useToast();
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [dbGifts, setDbGifts] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("tools_gifts").select("*").then(({ data }) => setDbGifts(data || []));
  }, []);

  const handleDownload = (item: any) => {
    if (item.url) {
      window.open(item.url, "_blank");
    } else {
      toast({ title: "ডাউনলোড", description: `"${item.name}" শীঘ্রই উপলব্ধ হবে!` });
    }
  };

  const handlePreview = (item: any) => {
    setPreviewItem(item);
  };

  const formatBDT = (amount: number) => `৳${amount?.toLocaleString("bn-BD") || 0}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Gift className="h-6 w-6 text-primary" />ফ্রি গিফট</h1>
        <p className="text-muted-foreground text-sm mt-1">৳৫৮,০০০+ মূল্যের ফ্রি রিসোর্স</p>
      </div>

      <Card className="border-border/50 gradient-bg text-primary-foreground">
        <CardContent className="py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">মোট গিফটের মূল্য</p>
              <p className="text-3xl font-bold">৳৫৮,০০০+</p>
            </div>
            <Gift className="h-10 w-10 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates">
        <TabsList className="bg-secondary">
          <TabsTrigger value="templates">টেমপ্লেট</TabsTrigger>
          <TabsTrigger value="design">ডিজাইন</TabsTrigger>
          <TabsTrigger value="tools">টুলস</TabsTrigger>
          <TabsTrigger value="ebooks">ইবুক</TabsTrigger>
        </TabsList>

        {Object.entries(fallbackGifts).map(([key, items]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-xs">{key === "templates" ? "Code Template" : key === "design" ? "Design Resource" : key === "tools" ? "Premium Tool" : "Ebook"}</Badge>
                      <span className="text-sm font-bold text-success">{formatBDT(item.value_bdt)}</span>
                    </div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handlePreview(item)}>
                        <Eye className="h-3 w-3" />প্রিভিউ
                      </Button>
                      <Button size="sm" className="flex-1 gap-1 gradient-bg text-primary-foreground" onClick={() => handleDownload(item)}>
                        <Download className="h-3 w-3" />ডাউনলোড
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{previewItem?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">প্রিভিউ</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{previewItem?.description}</p>
            <p className="font-bold text-success">{previewItem && formatBDT(previewItem.value_bdt)} মূল্যের - ফ্রি!</p>
            <Button className="w-full gradient-bg text-primary-foreground" onClick={() => { handleDownload(previewItem); setPreviewItem(null); }}>
              <Download className="h-4 w-4 mr-2" />ডাউনলোড করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
