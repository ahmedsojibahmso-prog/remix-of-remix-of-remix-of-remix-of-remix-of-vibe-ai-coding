import { UserCheck, Users, Clock, Video } from "lucide-react";
import GradientText from "./GradientText";
import OfferBanner from "./OfferBanner";

const metrics = [
  { icon: UserCheck, value: "১:১", label: "মেন্টরশিপ" },
  { icon: Users, value: "1000+", label: "স্টুডেন্টস" },
  { icon: Clock, value: "১০+", label: "ঘন্টা কোর্স" },
  { icon: Video, value: "৫০+", label: "ভিডিও লেসন" },
];

const CourseHighlights = () => (
  <section className="py-16 sm:py-20 bg-secondary/50">
    <div className="container mx-auto px-4 max-w-[1400px] space-y-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card border border-border rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300">
            <m.icon className="h-10 w-10 mx-auto mb-3 text-brand-orange" />
            <GradientText className="text-3xl sm:text-4xl block">{m.value}</GradientText>
            <p className="text-sm text-muted-foreground mt-2">{m.label}</p>
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
        <button className="px-8 py-3 rounded-lg gradient-bg text-primary-foreground font-semibold shadow-lg hover:scale-105 active:scale-[0.98] transition-transform">
          এখনই এনরোল করুন
        </button>
      </div>
    </div>
  </section>
);

export default CourseHighlights;
