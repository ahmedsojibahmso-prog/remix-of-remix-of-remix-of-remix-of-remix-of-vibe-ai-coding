import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradientText from "./GradientText";
import OfferBanner from "./OfferBanner";

const features = [
  "১:১ মেন্টরশিপ সাপোর্ট",
  "লাইফটাইম ফ্রি হোস্টিং",
  "৫৮ হাজার টাকার বোনাস গিফট",
  "আনলিমিটেড ক্রেডিট মেথড",
  "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন",
  "SaaS প্রোডাক্ট বিল্ডিং",
  "প্যাসিভ ইনকাম ট্রেনিং",
  "প্রোডাকশন গ্রেড প্রজেক্ট",
  "এক্সক্লুসিভ কমিউনিটি",
  "লোকাল ক্লায়েন্ট হান্টিং গাইড",
];

const ComparisonSection = () => {
  const navigate = useNavigate();

  return (
    <section id="comparison" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">
            আমরা যা দিচ্ছি <GradientText>vs</GradientText> অন্যরা
          </h2>
          <p className="text-muted-foreground">
            কেন আমাদের প্রোগ্রাম <span className="text-brand-orange font-semibold">ইউনিক</span>?
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-hidden rounded-2xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="bg-card">
                <th className="text-left p-4 font-semibold">ফিচার</th>
                <th className="text-center p-4 font-semibold gradient-text">আমরা</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">অন্যরা</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-card/50"}>
                  <td className="p-4 font-medium">{f}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-success/20">
                      <Check className="h-4 w-4 text-success" />
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {features.map((f, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-medium flex-1">{f}</span>
              <div className="flex gap-4 shrink-0">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-success/20">
                  <Check className="h-3.5 w-3.5 text-success" />
                </span>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <OfferBanner />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              const el = document.querySelector("#modules");
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
            }}
            className="px-8 py-3 rounded-lg border-2 border-brand-red text-foreground font-semibold hover:gradient-bg hover:text-primary-foreground transition-all"
          >
            কোর্স মডিউল দেখুন
          </button>
          <button
            onClick={() => navigate("/enroll")}
            className="px-8 py-3 rounded-lg gradient-bg text-primary-foreground font-semibold shadow-lg hover:scale-105 active:scale-[0.98] transition-transform"
          >
            এখনই এনরোল করুন
          </button>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
