import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowLeft, ShieldCheck, Clock, XCircle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ThemeToggle";

type AuthView = "login" | "signup" | "forgot-password" | "reset-password" | "pending-approval" | "rejected";

const Auth = () => {
  const [view, setView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    if (isDark) toggle();
  }, []);

  // Check for password reset flow from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setView("reset-password");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check admin_status
      const { data: profile } = await supabase
        .from("profiles")
        .select("admin_status")
        .eq("user_id", data.user.id)
        .single();

      if (profile?.admin_status === "pending") {
        await supabase.auth.signOut();
        setView("pending-approval");
        return;
      }
      if (profile?.admin_status === "rejected") {
        await supabase.auth.signOut();
        setView("rejected");
        return;
      }

      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "লগইন ব্যর্থ", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password.length < 8) {
        toast({ title: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast({
        title: "একাউন্ট তৈরি হয়েছে! ✅",
        description: "আপনার ইমেইল ভেরিফাই করুন। ভেরিফিকেশনের পর Admin Approval এর জন্য অপেক্ষা করুন।",
      });
      setView("pending-approval");
    } catch (error: any) {
      toast({ title: "সাইনআপ ব্যর্থ", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth#type=recovery`,
      });
      if (error) throw error;
      toast({
        title: "ইমেইল পাঠানো হয়েছে! 📧",
        description: "আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "পাসওয়ার্ড মিলছে না", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "পাসওয়ার্ড পরিবর্তন হয়েছে! ✅" });
      setView("login");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Google Sign-in Error", description: String(error), variant: "destructive" });
    }
  };

  const renderPendingApproval = () => (
    <Card className="w-full max-w-md border-border/50 shadow-xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>
        <CardTitle className="text-2xl font-bold">অপেক্ষমান অনুমোদন ⏳</CardTitle>
        <CardDescription className="text-base">
          আপনার একাউন্ট তৈরি হয়েছে। Admin অনুমোদনের জন্য অপেক্ষা করুন। অনুমোদিত হলে আপনি লগইন করতে পারবেন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={() => setView("login")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> লগইন পেজে ফিরে যান
        </Button>
      </CardContent>
    </Card>
  );

  const renderRejected = () => (
    <Card className="w-full max-w-md border-destructive/30 shadow-xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold">একাউন্ট প্রত্যাখ্যাত ❌</CardTitle>
        <CardDescription className="text-base">
          দুঃখিত, আপনার একাউন্ট Admin দ্বারা প্রত্যাখ্যাত হয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={() => setView("login")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> লগইন পেজে ফিরে যান
        </Button>
      </CardContent>
    </Card>
  );

  const renderForgotPassword = () => (
    <Card className="w-full max-w-md border-border/50 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">পাসওয়ার্ড ভুলে গেছেন? 🔐</CardTitle>
        <CardDescription>আপনার ইমেইল দিন, রিসেট লিংক পাঠানো হবে</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resetEmail">ইমেইল</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="resetEmail"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 gradient-bg text-primary-foreground hover:opacity-90" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            রিসেট লিংক পাঠান
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          <button onClick={() => setView("login")} className="text-primary hover:underline font-medium">
            <ArrowLeft className="inline h-3 w-3 mr-1" />লগইন পেজে ফিরে যান
          </button>
        </p>
      </CardContent>
    </Card>
  );

  const renderResetPassword = () => (
    <Card className="w-full max-w-md border-border/50 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">নতুন পাসওয়ার্ড সেট করুন 🔑</CardTitle>
        <CardDescription>আপনার নতুন পাসওয়ার্ড দিন</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">নতুন পাসওয়ার্ড</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={8}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
                minLength={8}
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 gradient-bg text-primary-foreground hover:opacity-90" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            পাসওয়ার্ড পরিবর্তন করুন
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderLoginSignup = () => (
    <Card className="w-full max-w-md border-border/50 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-2">
          <span className="text-xl font-bold text-primary-foreground">TV</span>
        </div>
        <CardTitle className="text-2xl font-bold">
          {view === "login" ? "Welcome Back! 👋" : "Create Account 🚀"}
        </CardTitle>
        <CardDescription>
          {view === "login" ? "TECH VIBE তে লগইন করুন" : "TECH VIBE তে একাউন্ট খুলুন"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full h-11 gap-2 border-border hover:bg-accent" onClick={handleGoogleSignIn}>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">অথবা</span>
          </div>
        </div>

        <form onSubmit={view === "login" ? handleLogin : handleSignup} className="space-y-4">
          {view === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">পুরো নাম</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="fullName" placeholder="আপনার নাম লিখুন" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">ইমেইল</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              {view === "login" && (
                <button type="button" onClick={() => setView("forgot-password")} className="text-xs text-primary hover:underline">
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required minLength={8} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 gradient-bg text-primary-foreground hover:opacity-90" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {view === "login" ? "লগইন করুন" : "একাউন্ট তৈরি করুন"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {view === "login" ? "একাউন্ট নেই?" : "আগে থেকেই একাউন্ট আছে?"}{" "}
          <button onClick={() => setView(view === "login" ? "signup" : "login")} className="text-primary hover:underline font-medium">
            {view === "login" ? "একাউন্ট খুলুন" : "লগইন করুন"}
          </button>
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle isDark={isDark} toggle={toggle} />
      </div>

      {view === "pending-approval" && renderPendingApproval()}
      {view === "rejected" && renderRejected()}
      {view === "forgot-password" && renderForgotPassword()}
      {view === "reset-password" && renderResetPassword()}
      {(view === "login" || view === "signup") && renderLoginSignup()}
    </div>
  );
};

export default Auth;
