import {
  Rocket, Zap, Gift, Globe, CreditCard, Wallet, BarChart3,
  Users, Headphones, Box, DollarSign, TrendingUp, Search, Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradientText from "./GradientText";

const features = [
  { icon: Rocket, title: "লিমিটলেস প্রজেক্ট", desc: "অসীম প্রজেক্ট তৈরি করুন" },
  { icon: Zap, title: "5+ পাওয়ারফুল টুলস", desc: "শক্তিশালী AI টুলস" },
  { icon: Gift, title: "৫৮ হাজার টাকার গিফট", desc: "বোনাস প্যাকেজ" },
  { icon: Globe, title: "Lifetime Free Hosting", desc: "প্রজেক্ট লাইভ করুন ফ্রীতে" },
  { icon: CreditCard, title: "Unlimited Credit Method", desc: "আনলিমিটেড ক্রেডিট মেথড" },
  { icon: Wallet, title: "পেমেন্ট গেটওয়ে", desc: "পেমেন্ট সিস্টেম সেটআপ" },
  { icon: BarChart3, title: "ফেসবুক পিক্সেল", desc: "ট্র্যাকিং ও অ্যানালিটিক্স" },
  { icon: Users, title: "কমিউনিটি গ্রুপ", desc: "এক্সক্লুসিভ গ্রুপে যোগ দিন" },
  { icon: Headphones, title: "লাইভ 1:1 সাপোর্ট", desc: "সরাসরি সাপোর্ট পাবেন" },
  { icon: Box, title: "SaaS প্রোডাক্ট বিল্ডিং", desc: "Lovable, Bolt, Cursor" },
  { icon: DollarSign, title: "ইনকাম গাইড", desc: "লোকাল ক্লায়েন্ট ও ইনকাম গাইডলাইন" },
  { icon: TrendingUp, title: "প্যাসিভ আর্নিং মাস্টারি", desc: "প্যাসিভ ইনকাম সোর্স তৈরি" },
  { icon: Search, title: "ক্লায়েন্ট হান্টিং", desc: "ফ্রিল্যান্সিং ব্লুপ্রিন্ট পাচ্ছেন" },
  { icon: Briefcase, title: "রিয়েল ওয়ার্ল্ড প্রজেক্ট", desc: "প্রোডাকশন গ্রেড প্রজেক্ট" },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-[1400px] space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">
            এই <GradientText>নেক্সট লেভেল</GradientText> কোর্সে কি কি থাকছে?
          </h2>
          <p className="text-lg text-muted-foreground">
            একটি কোর্সে সব কিছু পাচ্ছেন — <span className="text-brand-orange font-semibold">কোনো হিডেন কস্ট নেই</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative bg-card border border-border rounded-2xl p-5 text-center hover:border-brand-red/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              const el = document.querySelector("#comparison");
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}
            className="px-8 py-3 rounded-lg border-2 border-brand-red text-foreground font-semibold hover:gradient-bg hover:text-primary-foreground transition-all"
          >
            স্টুডেন্ট রিভিউ দেখুন
          </button>
          <button
            onClick={() => navigate("/enroll")}
            className="px-8 py-3.5 rounded-lg gradient-bg text-primary-foreground font-semibold text-lg shadow-lg hover:scale-105 active:scale-[0.98] transition-transform"
          >
            অফারে এনরোল করুন
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
