import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Award, Trophy, Flame, Clock, Target, Github, Linkedin, Mail, Phone, MapPin, Camera, Upload, Loader2 } from "lucide-react";

export default function DashboardProfile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [githubUrl, setGithubUrl] = useState(profile?.github_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || "");
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [coverUrl, setCoverUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Sync state when profile loads
  useState(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setLocation(profile.location || "");
      setBio(profile.bio || "");
      setGithubUrl(profile.github_url || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  });

  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const uploadImage = async (file: File, type: "avatar" | "cover") => {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${type}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

      if (type === "avatar") {
        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
        setAvatarUrl(publicUrl);
      } else {
        setCoverUrl(publicUrl);
      }
      toast({ title: "আপলোড সফল!", description: `${type === "avatar" ? "প্রোফাইল ছবি" : "কভার ছবি"} আপডেট হয়েছে` });
    } catch (err: any) {
      toast({ title: "আপলোড ব্যর্থ", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        phone,
        location,
        bio,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
      }).eq("user_id", user.id);
      if (error) throw error;
      toast({ title: "সেভ হয়েছে!", description: "আপনার প্রোফাইল আপডেট করা হয়েছে" });
    } catch (err: any) {
      toast({ title: "ত্রুটি", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const newPass = (document.getElementById("new-password") as HTMLInputElement)?.value;
    if (!newPass || newPass.length < 6) {
      toast({ title: "ত্রুটি", description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল!", description: "পাসওয়ার্ড আপডেট হয়েছে" });
    }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><UserCircle className="h-6 w-6 text-primary" />প্রোফাইল</h1></div>

      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "avatar")} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "cover")} />

      <Card className="border-border/50 overflow-hidden">
        <div
          className="h-32 gradient-bg relative cursor-pointer group"
          style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
          onClick={() => coverInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <CardContent className="relative pt-0">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 -mt-12 border-4 border-card cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="gradient-bg text-primary-foreground text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 hover:scale-110 transition-transform">
              <Camera className="h-3 w-3" />
            </button>
          </div>
          {uploading && <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />আপলোড হচ্ছে...</div>}
          <div className="mt-3">
            <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="gradient-bg text-primary-foreground">🥉 Intermediate</Badge>
              <Badge variant="outline">2,450 XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile">
        <TabsList className="bg-secondary">
          <TabsTrigger value="profile">প্রোফাইল</TabsTrigger>
          <TabsTrigger value="settings">সেটিংস</TabsTrigger>
          <TabsTrigger value="certificates">সার্টিফিকেট</TabsTrigger>
          <TabsTrigger value="achievements">অ্যাচিভমেন্ট</TabsTrigger>
          <TabsTrigger value="stats">লার্নিং স্ট্যাটস</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg">ব্যক্তিগত তথ্য</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>পুরো নাম</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} /></div>
                <div className="space-y-2"><Label>ইমেইল</Label><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><Input value={user?.email || ""} disabled /></div></div>
                <div className="space-y-2"><Label>ফোন</Label><div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880" /></div></div>
                <div className="space-y-2"><Label>লোকেশন</Label><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><Input value={location} onChange={e => setLocation(e.target.value)} placeholder="ঢাকা, বাংলাদেশ" /></div></div>
              </div>
              <div className="space-y-2"><Label>বায়ো</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="আপনার সম্পর্কে কিছু লিখুন..." /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="flex items-center gap-1"><Github className="h-4 w-4" />GitHub</Label><Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/username" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-1"><Linkedin className="h-4 w-4" />LinkedIn</Label><Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/username" /></div>
              </div>
              <Button className="gradient-bg text-primary-foreground" onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />সেভ হচ্ছে...</> : "সেভ করুন"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4 space-y-4">
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-lg">সেটিংস</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>নতুন পাসওয়ার্ড</Label><Input id="new-password" type="password" placeholder="নতুন পাসওয়ার্ড" /></div>
              <Button variant="outline" onClick={handlePasswordUpdate}>পাসওয়ার্ড আপডেট</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">কোর্স সম্পন্ন করলে সার্টিফিকেট পাবেন</h3>
              <p className="text-sm text-muted-foreground mt-1">আপনার অগ্রগতি: ৬৭% সম্পন্ন</p>
              <Progress value={67} className="h-2 max-w-xs mx-auto mt-4" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Early Bird 🐦", desc: "প্রথম ১০০ জনের মধ্যে যোগ দিয়েছেন", earned: true },
              { name: "Fast Learner ⚡", desc: "১ সপ্তাহে ৫টি মডিউল শেষ", earned: true },
              { name: "Streak Master 🔥", desc: "৩০ দিনের স্ট্রিক", earned: false },
              { name: "Helper 🤝", desc: "১০টি Q&A উত্তর দিয়েছেন", earned: true },
              { name: "Top Scorer 🏆", desc: "সব অ্যাসাইনমেন্টে ৯০%+", earned: false },
              { name: "Community Star ⭐", desc: "৫০টি পোস্ট তৈরি করেছেন", earned: false },
            ].map((badge, i) => (
              <Card key={i} className={`border-border/50 ${!badge.earned ? "opacity-50" : ""}`}>
                <CardContent className="pt-5 text-center space-y-2">
                  <p className="text-3xl">{badge.name.split(" ").pop()}</p>
                  <h3 className="font-semibold text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  <Badge className={badge.earned ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}>
                    {badge.earned ? "অর্জিত ✅" : "লক করা 🔒"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/50"><CardContent className="pt-5 text-center"><Target className="h-6 w-6 mx-auto text-primary mb-2" /><p className="text-2xl font-bold">67%</p><p className="text-xs text-muted-foreground">সামগ্রিক অগ্রগতি</p></CardContent></Card>
            <Card className="border-border/50"><CardContent className="pt-5 text-center"><Clock className="h-6 w-6 mx-auto text-info mb-2" /><p className="text-2xl font-bold">24.5h</p><p className="text-xs text-muted-foreground">মোট সময়</p></CardContent></Card>
            <Card className="border-border/50"><CardContent className="pt-5 text-center"><Flame className="h-6 w-6 mx-auto text-warning mb-2" /><p className="text-2xl font-bold">7 দিন</p><p className="text-xs text-muted-foreground">স্ট্রিক 🔥</p></CardContent></Card>
            <Card className="border-border/50"><CardContent className="pt-5 text-center"><Trophy className="h-6 w-6 mx-auto text-success mb-2" /><p className="text-2xl font-bold">2,450</p><p className="text-xs text-muted-foreground">XP পয়েন্ট</p></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
