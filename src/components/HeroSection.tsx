import { Users, ArrowRight } from "lucide-react";
import GradientText from "./GradientText";
import OfferBanner from "./OfferBanner";

const HeroSection = () => {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-[1400px] space-y-8 text-center">
        {/* Enrollment counter */}
        <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm">
          <Users className="h-4 w-4 text-brand-orange" />
          <span><GradientText>1000+</GradientText> students enrolled</span>
        </div>

        {/* Headline */}
        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
            AI এর যুগে হার্ড ওয়ার্ক করে নয়, <GradientText>স্মার্ট স্কিল</GradientText> দিয়েই আর্নিং ও ক্যারিয়ার সেভ করতে হয়।
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            কোড না জেনেও Vibe Coding দিয়ে মাত্র ৩০ মিনিটে প্রফেশনাল ওয়েবসাইট, অ্যাপ ও সফটওয়্যার বিল্ড করুন।
          </p>
        </div>

        {/* YouTube Video */}
        <div className="max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden shadow-xl border border-border">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/f8gOToTxai4?si=MR-fCzf9zcWz5CYp"
            title="Course Introduction"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollTo("#modules")}
            className="px-8 py-3 rounded-lg border-2 border-brand-red text-foreground font-semibold hover:gradient-bg hover:text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
          >
            কোর্স মডিউল দেখুন
          </button>
          <button
            onClick={() => scrollTo("#enroll")}
            className="px-8 py-3 rounded-lg gradient-bg text-primary-foreground font-semibold shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            এখনই এনরোল করুন <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Offer Banner */}
        <div className="max-w-2xl mx-auto">
          <OfferBanner />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
