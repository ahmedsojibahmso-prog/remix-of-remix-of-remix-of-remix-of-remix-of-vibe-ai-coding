import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import GradientText from "./GradientText";
import { CheckCircle2 } from "lucide-react";

const modules = [
  { title: "AI কোডিং ফান্ডামেন্টালস", desc: "AI টুলস পরিচিতি ও সেটআপ", lessons: ["AI কোডিং কি?", "টুলস সেটআপ", "প্রথম প্রজেক্ট", "বেসিক প্রম্পটিং"] },
  { title: "Lovable দিয়ে ওয়েবসাইট তৈরি", desc: "Lovable মাস্টার করুন", lessons: ["Lovable পরিচিতি", "কম্পোনেন্ট ডিজাইন", "রেসপনসিভ লেআউট", "ডেপ্লয়মেন্ট"] },
  { title: "Bolt.new দিয়ে ফুলস্ট্যাক অ্যাপ", desc: "Bolt.new মাস্টারি", lessons: ["Bolt পরিচিতি", "ডাটাবেস সেটআপ", "API ইন্টিগ্রেশন", "অথেনটিকেশন"] },
  { title: "Cursor IDE মাস্টারি", desc: "প্রফেশনাল কোডিং এনভায়রনমেন্ট", lessons: ["Cursor সেটআপ", "AI কোড জেনারেশন", "ডিবাগিং", "কাস্টমাইজেশন"] },
  { title: "SaaS প্রোডাক্ট বিল্ডিং", desc: "নিজের SaaS তৈরি করুন", lessons: ["SaaS আইডিয়া ভ্যালিডেশন", "MVP তৈরি", "ইউজার অনবোর্ডিং", "স্কেলিং"] },
  { title: "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন", desc: "পেমেন্ট সিস্টেম সেটআপ", lessons: ["Stripe সেটআপ", "বাংলাদেশি পেমেন্ট", "সাবস্ক্রিপশন মডেল", "ইনভয়েসিং"] },
  { title: "ফেসবুক পিক্সেল ও অ্যানালিটিক্স", desc: "ট্র্যাকিং মাস্টারি", lessons: ["পিক্সেল সেটআপ", "ইভেন্ট ট্র্যাকিং", "কনভার্সন অপটিমাইজেশন", "রিপোর্টিং"] },
  { title: "ফ্রিল্যান্সিং ব্লুপ্রিন্ট", desc: "ক্লায়েন্ট পাওয়ার কমপ্লিট গাইড", lessons: ["প্রোফাইল তৈরি", "প্রপোজাল রাইটিং", "প্রাইসিং স্ট্র্যাটেজি", "ক্লায়েন্ট ম্যানেজমেন্ট"] },
  { title: "লোকাল ক্লায়েন্ট হান্টিং", desc: "বাংলাদেশে ক্লায়েন্ট পান", lessons: ["মার্কেট রিসার্চ", "নেটওয়ার্কিং", "পিচিং", "লং-টার্ম রিলেশন"] },
  { title: "প্যাসিভ ইনকাম সোর্স", desc: "অটোমেটেড ইনকাম তৈরি", lessons: ["টেমপ্লেট সেলিং", "অ্যাফিলিয়েট মার্কেটিং", "ডিজিটাল প্রোডাক্ট", "অটোমেশন"] },
  { title: "হোস্টিং ও ডেপ্লয়মেন্ট", desc: "প্রজেক্ট লাইভ করুন", lessons: ["ডোমেইন সেটআপ", "হোস্টিং অপশন", "SSL সেটআপ", "CI/CD"] },
  { title: "ফাইনাল প্রজেক্ট ও সার্টিফিকেট", desc: "কোর্স কমপ্লিশন", lessons: ["প্রজেক্ট প্ল্যানিং", "বিল্ডিং", "কোড রিভিউ", "সার্টিফিকেট"] },
];

const ModulesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="modules" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">
            <GradientText>মাস্টারমাইন্ড</GradientText> কোর্সের মডিউল
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            এই কোর্সে আমরা ফোকাস করেছি লার্নিং এর পাশাপাশি <span className="text-brand-orange">একটিভ ও প্যাসিভ আর্নিং</span>।
            প্রতিটা প্রোজেক্ট একেবারে <span className="text-brand-orange">প্রোডাকশন গ্রেড</span>।
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {modules.map((m, i) => (
            <AccordionItem key={i} value={`module-${i}`} className="border border-border rounded-xl px-5 data-[state=open]:border-brand-red/40 transition-colors">
              <AccordionTrigger className="hover:no-underline gap-4">
                <div className="flex items-center gap-4 text-left">
                  <span className="gradient-bg text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-semibold text-base">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {m.lessons.map((lesson, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0" />
                      <span>{lesson}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">{m.lessons.length} টি লেসন</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center">
          <button
            onClick={() => navigate("/enroll")}
            className="px-10 py-3.5 rounded-lg gradient-bg text-primary-foreground font-semibold text-lg shadow-lg hover:scale-105 active:scale-[0.98] transition-transform animate-pulse"
          >
            এখনই এনরোল করুন
          </button>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
