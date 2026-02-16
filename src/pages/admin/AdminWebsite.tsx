import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function AdminWebsite() {
  const { toast } = useToast();
  const [heroTitle, setHeroTitle] = useState("AI দিয়ে কোডিং শিখুন");
  const [heroSub, setHeroSub] = useState("বাংলাদেশের সেরা AI Coding কোর্স");
  const [price, setPrice] = useState("৳999");
  const [metaTitle, setMetaTitle] = useState("TECH VIBE - AI দিয়ে কোডিং শিখুন");
  const [metaDesc, setMetaDesc] = useState("বাংলাদেশের সেরা AI Coding কোর্স।");
  const [keywords, setKeywords] = useState("AI coding, Bangladesh, web development");

  const handleSave = (section: string) => {
    toast({ title: "সেভ হয়েছে!", description: `${section} আপডেট করা হয়েছে` });
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Globe className="h-6 w-6 text-primary" />ওয়েবসাইট সেটিংস</h1></div>

      <Tabs defaultValue="hero">
        <TabsList className="bg-secondary">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-4">
          <Card className="border-border/50">
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>শিরোনাম</Label><Input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} /></div>
              <div className="space-y-2"><Label>সাব-শিরোনাম</Label><Textarea value={heroSub} onChange={e => setHeroSub(e.target.value)} /></div>
              <div className="space-y-2"><Label>মূল্য</Label><Input value={price} onChange={e => setPrice(e.target.value)} /></div>
              <Button className="gradient-bg text-primary-foreground gap-2" onClick={() => handleSave("Hero")}><Save className="h-4 w-4" />সেভ করুন</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <Card className="border-border/50">
            <CardHeader><CardTitle>SEO সেটিংস</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Meta Title</Label><Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} /></div>
              <div className="space-y-2"><Label>Meta Description</Label><Textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} /></div>
              <div className="space-y-2"><Label>Keywords</Label><Input value={keywords} onChange={e => setKeywords(e.target.value)} /></div>
              <Button className="gradient-bg text-primary-foreground gap-2" onClick={() => handleSave("SEO")}><Save className="h-4 w-4" />সেভ করুন</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
