import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function DashboardReviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").eq("is_published", true).order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async () => {
    if (!user || !rating) {
      toast({ title: "রেটিং দিন", description: "অন্তত একটি স্টার দিন", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({ user_id: user.id, rating, title: title || null, content: content || null });
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "ধন্যবাদ!", description: "আপনার রিভিউ জমা হয়েছে" });
      setRating(0); setTitle(""); setContent("");
      fetchReviews();
    }
    setSubmitting(false);
  };

  const handleHelpful = async (reviewId: string, currentCount: number) => {
    await supabase.from("reviews").update({ helpful_count: (currentCount || 0) + 1 }).eq("id", reviewId);
    fetchReviews();
  };

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0";
  const ratingBreakdown = [5, 4, 3, 2, 1].map(s => {
    const count = reviews.filter(r => r.rating === s).length;
    return { stars: s, count, percent: reviews.length ? Math.round((count / reviews.length) * 100) : 0 };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Star className="h-6 w-6 text-primary" />রিভিউ</h1>
        <p className="text-muted-foreground text-sm mt-1">কোর্স রিভিউ দেখুন ও লিখুন</p>
      </div>

      <Card className="border-border/50">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center">
              <p className="text-5xl font-bold">{avgRating}</p>
              <div className="flex gap-0.5 mt-2">{[1,2,3,4,5].map(i => <Star key={i} className={`h-5 w-5 ${i <= Math.round(Number(avgRating)) ? "fill-warning text-warning" : "text-muted-foreground"}`} />)}</div>
              <p className="text-sm text-muted-foreground mt-1">{reviews.length} রিভিউ</p>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="text-sm w-12 flex items-center gap-1">{r.stars}<Star className="h-3 w-3 fill-warning text-warning" /></span>
                  <Progress value={r.percent} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground w-12">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg">আপনার রিভিউ লিখুন</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                className={`h-6 w-6 cursor-pointer transition-colors ${i <= (hoverRating || rating) ? "fill-warning text-warning" : "text-muted-foreground"}`}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i)}
              />
            ))}
          </div>
          <Input placeholder="রিভিউ শিরোনাম" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..." className="min-h-[100px]" value={content} onChange={e => setContent(e.target.value)} />
          <Button className="gradient-bg text-primary-foreground" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}রিভিউ জমা দিন
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="border-border/50">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-secondary">R</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{rev.title || "রিভিউ"}</p>
                    <div className="flex gap-0.5">{Array.from({length: rev.rating}).map((_, j) => <Star key={j} className="h-3 w-3 fill-warning text-warning" />)}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(rev.created_at).toLocaleDateString("bn-BD")}</span>
                </div>
                {rev.content && <p className="text-sm text-muted-foreground">{rev.content}</p>}
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => handleHelpful(rev.id, rev.helpful_count)}>
                  <ThumbsUp className="h-3 w-3" />সহায়ক ({rev.helpful_count || 0})
                </Button>
              </CardContent>
            </Card>
          ))}
          {reviews.length === 0 && <p className="text-center text-muted-foreground py-8">এখনো কোনো রিভিউ নেই</p>}
        </div>
      )}
    </div>
  );
}
