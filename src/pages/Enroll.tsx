import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, Shield, Gift, ArrowLeft, CreditCard, Users, Clock, Heart,
} from "lucide-react";
import GradientText from "@/components/GradientText";
import CountdownTimer from "@/components/CountdownTimer";

const included = [
  "Discord কমিউনিটি",
  "১:১ লাইভ সাপোর্ট",
  "কমপ্লিট Vibe Coding গাইডলাইন",
  "রিয়েল ওয়ার্ল্ড প্রজেক্টস",
  "Lovable Lite Plan + আনলিমিটেড একাউন্ট মেথড",
  "লোকাল ক্লায়েন্ট ও ইনকাম গাইড",
  "সাপোর্ট কমিউনিটি অ্যাক্সেস",
  "১০০% মানি ব্যাক গ্যারান্টি",
  "১,০০,০০০+ টাকার 'মানি মেকিং SaaS বান্ডেল'",
];

const Enroll = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Payment integration will be added later
    alert("পেমেন্ট সিস্টেম শীঘ্রই যুক্ত হচ্ছে!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="gradient-bg">
        <div className="container mx-auto px-4 max-w-5xl py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary-foreground text-sm hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4" />
            হোমে ফিরে যান
          </button>
          <div className="flex items-center gap-2 text-primary-foreground text-sm">
            <Shield className="h-4 w-4" />
            সিকিউর পেমেন্ট
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-10 sm:py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left - Order Summary (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                <GradientText>AI Vibe Coding</GradientText> মাস্টারমাইন্ড
              </h1>
              <p className="text-muted-foreground mt-2">একবার পেমেন্ট, লাইফটাইম অ্যাক্সেস</p>
            </div>

            {/* Price card */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">প্রোগ্রাম ফি</p>
                  <div className="flex items-end gap-3 mt-1">
                    <span className="text-4xl font-bold gradient-text font-english">৳999</span>
                    <span className="text-lg text-muted-foreground line-through font-english">৳4999</span>
                  </div>
                </div>
                <div className="gradient-bg text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                  -৳4000 অফার
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-success/10 text-success px-3 py-2 rounded-lg w-fit">
                <Users className="h-3.5 w-3.5" />
                <span className="font-english font-bold">1,989</span> শিক্ষার্থী ইতিমধ্যে এনরোল করেছেন
              </div>
            </div>

            {/* What's included */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">কি কি পাচ্ছেন</h3>
              <div className="space-y-3">
                {included.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gift */}
            <div className="bg-gradient-to-r from-brand-red/10 to-brand-orange/10 border border-brand-orange/20 rounded-2xl p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-brand-orange" />
                <span className="font-bold">ফ্রি গিফট</span>
              </div>
              <p className="text-sm font-semibold gradient-text">১,০০,০০০+ টাকার 'মানি মেকিং SaaS বান্ডেল'</p>
              <p className="text-xs text-muted-foreground">
                ই-কমার্স, ল্যান্ডিং পেজ, কোর্স ওয়েবসাইট ও প্রজেক্ট ম্যানেজমেন্ট অ্যাপ সহ ক্লায়েন্ট রেডি টেমপ্লেট
              </p>
            </div>
          </div>

          {/* Right - Payment Form (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 lg:sticky lg:top-8">
              <h3 className="font-semibold text-lg text-center">পেমেন্ট ইনফরমেশন</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">আপনার নাম</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jarif Ahmed"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-red/40 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">ইমেইল অ্যাড্রেস</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmedsojibahm49@gmail.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-red/40 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl gradient-bg text-primary-foreground font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-5 w-5" />
                  পেমেন্ট করুন - ৳999
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                সম্পূর্ণ নিরাপদ পেমেন্ট
                <Heart className="h-3.5 w-3.5 text-brand-red ml-1" />
                মানি ব্যাক গ্যারান্টি
              </div>

              {/* Countdown */}
              <div className="border-t border-border pt-5 space-y-3">
                <p className="text-center text-sm font-semibold text-brand-orange">অফার শেষ হচ্ছে</p>
                <CountdownTimer />
                <p className="text-center text-xs text-muted-foreground">জানুয়ারি মাস শেষ হওয়ার আগে এনরোল করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
