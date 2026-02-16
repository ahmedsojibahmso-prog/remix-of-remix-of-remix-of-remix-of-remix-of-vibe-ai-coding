import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, ThumbsUp, Heart, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function DashboardCommunity() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  useRealtimeSubscription("community_posts", ["community-posts"]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const fetchPosts = async () => {
    const { data } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!user || !newPost.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("community_posts").insert({ user_id: user.id, content: newPost, type: "post" });
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      setNewPost("");
      fetchPosts();
    }
    setPosting(false);
  };

  const handleLike = async (postId: string, currentLikes: number) => {
    await supabase.from("community_posts").update({ likes_count: (currentLikes || 0) + 1 }).eq("id", postId);
    fetchPosts();
  };

  const toggleComments = async (postId: string) => {
    const newShow = !showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: newShow }));
    if (newShow && !comments[postId]) {
      const { data } = await supabase.from("post_comments").select("*").eq("post_id", postId).order("created_at", { ascending: true });
      setComments(prev => ({ ...prev, [postId]: data || [] }));
    }
  };

  const submitComment = async (postId: string) => {
    if (!user || !commentInputs[postId]?.trim()) return;
    const { error } = await supabase.from("post_comments").insert({ user_id: user.id, post_id: postId, content: commentInputs[postId] });
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      const { data } = await supabase.from("post_comments").select("*").eq("post_id", postId).order("created_at", { ascending: true });
      setComments(prev => ({ ...prev, [postId]: data || [] }));
      // Update comment count
      await supabase.from("community_posts").update({ comments_count: (data?.length || 0) }).eq("id", postId);
      fetchPosts();
    }
  };

  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "ME";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" />কমিউনিটি</h1>
        <p className="text-muted-foreground text-sm mt-1">সহশিক্ষার্থীদের সাথে যুক্ত হোন</p>
      </div>

      {/* Create Post */}
      <Card className="border-border/50">
        <CardContent className="pt-4 space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10"><AvatarFallback className="gradient-bg text-primary-foreground text-xs">{initials}</AvatarFallback></Avatar>
            <Textarea placeholder="কিছু শেয়ার করুন..." className="flex-1 min-h-[60px]" value={newPost} onChange={e => setNewPost(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button className="gradient-bg text-primary-foreground" onClick={handlePost} disabled={posting || !newPost.trim()}>
              {posting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}পোস্ট করুন
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="border-border/50">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-secondary text-foreground text-xs">U</AvatarFallback></Avatar>
                  <div>
                    <p className="font-semibold text-sm">{post.title || "পোস্ট"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString("bn-BD")}</p>
                  </div>
                </div>
                <p className="text-sm">{post.content}</p>
                <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-info" onClick={() => handleLike(post.id, post.likes_count)}>
                    <ThumbsUp className="h-4 w-4" />{post.likes_count || 0}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary" onClick={() => handleLike(post.id, post.likes_count)}>
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground ml-auto" onClick={() => toggleComments(post.id)}>
                    <MessageCircle className="h-4 w-4" />{post.comments_count || 0}
                  </Button>
                </div>

                {showComments[post.id] && (
                  <div className="space-y-3 pt-2 border-t border-border/50">
                    {(comments[post.id] || []).map(c => (
                      <div key={c.id} className="flex gap-2 text-sm">
                        <Avatar className="h-6 w-6"><AvatarFallback className="text-xs bg-secondary">U</AvatarFallback></Avatar>
                        <div className="bg-secondary/50 rounded-lg px-3 py-2 flex-1">
                          <p>{c.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(c.created_at).toLocaleDateString("bn-BD")}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="মন্তব্য লিখুন..."
                        value={commentInputs[post.id] || ""}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && submitComment(post.id)}
                      />
                      <Button size="sm" className="gradient-bg text-primary-foreground" onClick={() => submitComment(post.id)}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {posts.length === 0 && <p className="text-center text-muted-foreground py-8">এখনো কোনো পোস্ট নেই। প্রথম পোস্ট করুন!</p>}
        </div>
      )}
    </div>
  );
}
