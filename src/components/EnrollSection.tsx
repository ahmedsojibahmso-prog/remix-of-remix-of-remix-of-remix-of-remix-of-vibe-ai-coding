import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, Users, Clock, Gift, Shield, Sparkles,
  Disc, Headphones, BookOpen, FolderOpen, CreditCard, Award, Heart,
} from "lucide-react";
import GradientText from "./GradientText";
import CountdownTimer from "./CountdownTimer";

const benefits = [
  { icon: Disc, text: "Discord কমিউনিটি" },
  { icon: Headphones, text: "১:১ লাইভ সাপোর্ট" },
  { icon: BookOpen, text: "কমপ্লিট Vibe Coding গাইডলাইন" },
  { icon: FolderOpen, text: "রিয়েল ওয়ার্ল্ড প্রজেক্টস" },
  { icon: CreditCard, text: "Lovable Lite Plan + আনলিমিটেড একাউন্ট মেথড" },
  { icon: Award, text: "লোকাল ক্লায়েন্ট ও ইনকাম গাইড" },
  { icon: Users, text: "সাপোর্ট কমিউনিটি অ্যাক্সেস" },
  { icon: Shield, text: "১০০% মানি ব্যাক গ্যারান্টি" },
];

const EnrollSection = () => {
  const navigate = useNavigate();

  return (
    <section id="enroll" className="py-16 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            নিউ ইয়ার অফার!
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            আজই <GradientText>প্রোগ্রামে</GradientText> যোগ দিন
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            শুধুমাত্র জানুয়ারি মাসের জন্য এই স্পেশাল অফার
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left - Pricing Card */}
          <div className="bg-card border-2 border-brand-red/30 rounded-3xl overflow-hidden shadow-xl">
            {/* Top badge */}
            <div className="gradient-bg px-6 py-3 text-center">
              <p className="text-primary-foreground font-semibold text-sm">🎉 নিউ ইয়ার অফার! শুধুমাত্র জানুয়ারি মাসের জন্য</p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Student count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-orange" />
                  <div>
                    <span className="font-bold text-lg font-english">1,989</span>
                    <span className="text-sm text-muted-foreground ml-1">শিক্ষার্থী</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs bg-success/10 text-success px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  গত ২৪ ঘন্টায় <span className="font-bold font-english ml-0.5">45+</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-secondary/50 rounded-2xl p-5 space-y-2">
                <p className="text-sm text-muted-foreground">প্রোগ্রাম ফি</p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl sm:text-5xl font-bold gradient-text font-english">৳999</span>
                  <span className="text-xl text-muted-foreground line-through font-english mb-1">৳4999</span>
                </div>
                <div className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-semibold px-3 py-1 rounded-full">
                  নিউ ইয়ার অফার -৳4000
                </div>
                <p className="text-xs text-muted-foreground pt-1">একবার পেমেন্ট, লাইফটাইম অ্যাক্সেস</p>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                      <b.icon className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-sm">{b.text}</span>
                  </div>
                ))}
              </div>

              {/* Gift banner */}
              <div className="relative bg-gradient-to-r from-brand-red/10 to-brand-orange/10 border border-brand-orange/20 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-brand-orange" />
                  <span className="font-bold text-sm">১,০০,০০০+ টাকার</span>
                  <span className="gradient-bg text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">ফ্রি গিফট</span>
                </div>
                <p className="text-sm gradient-text font-semibold">'মানি মেকিং SaaS বান্ডেল'</p>
                <p className="text-xs text-muted-foreground">
                  ই-কমার্স, ল্যান্ডিং পেজ, কোর্স ওয়েবসাইট ও প্রজেক্ট ম্যানেজমেন্ট অ্যাপ সহ ক্লায়েন্ট রেডি টেমপ্লেট
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate("/enroll")}
                className="w-full py-4 rounded-xl gradient-bg text-primary-foreground font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                পেমেন্ট করুন - ৳999
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                <span>সম্পূর্ণ নিরাপদ পেমেন্ট</span>
                <Heart className="h-3.5 w-3.5 text-brand-red ml-2" />
                <span>১০০% মানি ব্যাক</span>
              </div>
            </div>
          </div>

          {/* Right - Countdown & Info */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-brand-orange">অফার শেষ হচ্ছে</p>
                <p className="text-muted-foreground text-sm">জানুয়ারি মাস শেষ হওয়ার আগে এনরোল করুন</p>
              </div>
              <CountdownTimer />
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "1000+", label: "সফল শিক্ষার্থী", icon: Users },
                { value: "৫০+", label: "ভিডিও লেসন", icon: BookOpen },
                { value: "১:১", label: "মেন্টরশিপ", icon: Headphones },
                { value: "১০০%", label: "মানি ব্যাক", icon: Shield },
              ].map((t, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
                  <t.icon className="h-6 w-6 mx-auto mb-2 text-brand-orange" />
                  <p className="font-bold text-lg font-english">{t.value}</p>
                  <p className="text-xs text-muted-foreground">{t.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnrollSection;
