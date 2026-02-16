import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function AdminReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const approveReview = async (id: string) => {
    await supabase.from("reviews").update({ is_published: true }).eq("id", id);
    toast({ title: "রিভিউ অনুমোদিত হয়েছে" }); fetchReviews();
  };

  const rejectReview = async (id: string) => {
    await supabase.from("reviews").update({ is_published: false }).eq("id", id);
    toast({ title: "রিভিউ প্রত্যাখ্যান করা হয়েছে" }); fetchReviews();
  };

  const pendingCount = reviews.filter(r => !r.is_published).length;
  const publishedCount = reviews.filter(r => r.is_published).length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Star className="h-6 w-6 text-primary" />রিভিউ ম্যানেজমেন্ট</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-warning">{pendingCount}</p><p className="text-sm text-muted-foreground">পেন্ডিং</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="pt-5 text-center"><p className="text-2xl font-bold text-success">{publishedCount}</p><p className="text-sm text-muted-foreground">প্রকাশিত</p></CardContent></Card>
      </div>
      <div className="space-y-3">
        {reviews.map(rev => (
          <Card key={rev.id} className="border-border/50">
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-secondary">R</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">{Array.from({ length: rev.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-warning text-warning" />)}</div>
                    <Badge className={rev.is_published ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                      {rev.is_published ? "প্রকাশিত" : "পেন্ডিং"}
                    </Badge>
                  </div>
                  {rev.title && <h4 className="font-medium text-sm mt-1">{rev.title}</h4>}
                  {rev.content && <p className="text-sm text-muted-foreground">{rev.content}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{new Date(rev.created_at).toLocaleDateString("bn-BD")}</p>
                  <div className="flex gap-2 mt-3">
                    {!rev.is_published && (
                      <Button size="sm" className="bg-success text-success-foreground gap-1" onClick={() => approveReview(rev.id)}><CheckCircle2 className="h-3 w-3" />অনুমোদন</Button>
                    )}
                    {rev.is_published && (
                      <Button size="sm" variant="outline" className="text-destructive gap-1" onClick={() => rejectReview(rev.id)}><Trash2 className="h-3 w-3" />আনপাবলিশ</Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && <p className="text-center text-muted-foreground py-8">কোনো রিভিউ নেই</p>}
      </div>
    </div>
  );
}
