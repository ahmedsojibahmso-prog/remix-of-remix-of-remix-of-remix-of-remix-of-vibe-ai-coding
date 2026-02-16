import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import GradientText from "./GradientText";

const faqs = [
  { q: "কোর্সটি কাদের জন্য?", a: "এই কোর্সটি সকলের জন্য - স্টুডেন্ট, ফ্রিল্যান্সার, উদ্যোক্তা, যে কেউ AI কোডিং শিখতে চান। কোনো পূর্ব অভিজ্ঞতা লাগবে না।" },
  { q: "কোর্সটি শুরু করতে কি কোনো পূর্ব অভিজ্ঞতা লাগবে?", a: "না, কোনো পূর্ব অভিজ্ঞতা লাগবে না। আমরা একেবারে বেসিক থেকে শুরু করব।" },
  { q: "কোর্স কমপ্লিট করতে কত সময় লাগবে?", a: "আপনার নিজের গতিতে শিখতে পারবেন। সাধারণত ২-৩ মাসে কমপ্লিট করা সম্ভব।" },
  { q: "পেমেন্ট করার কি কি পদ্ধতি আছে?", a: "bKash, Nagad, Rocket সহ কার্ড পেমেন্ট সাপোর্ট করা হয়।" },
  { q: "রিফান্ড পলিসি কি?", a: "কোর্স শুরুর ৭ দিনের মধ্যে সম্পূর্ণ রিফান্ড পাবেন, কোনো প্রশ্ন ছাড়াই।" },
  { q: "সার্টিফিকেট পাব কি?", a: "হ্যাঁ, কোর্স সম্পূর্ণ করলে সার্টিফিকেট পাবেন যা LinkedIn এ শেয়ার করতে পারবেন।" },
  { q: "সাপোর্ট কিভাবে পাব?", a: "1:1 মেন্টরশিপ, এক্সক্লুসিভ কমিউনিটি গ্রুপ, এবং লাইভ সাপোর্ট পাবেন।" },
  { q: "লাইফটাইম অ্যাক্সেস মানে কি?", a: "একবার পেমেন্ট করলে সবসময় কোর্স কন্টেন্ট অ্যাক্সেস করতে পারবেন, সব আপডেট সহ।" },
  { q: "কোর্স কন্টেন্ট কি আপডেট হয়?", a: "হ্যাঁ, নিয়মিত নতুন কন্টেন্ট ও আপডেট যোগ করা হয়।" },
  { q: "মোবাইল থেকে কি কোর্স করা যাবে?", a: "হ্যাঁ, মোবাইল, ট্যাবলেট, ও ডেস্কটপ — সব ডিভাইস থেকে করতে পারবেন।" },
];

const FAQSection = () => (
  <section id="faq" className="py-16 sm:py-20">
    <div className="container mx-auto px-4 max-w-3xl space-y-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center">
        <GradientText>সচরাচর</GradientText> জিজ্ঞাসিত প্রশ্ন
      </h2>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-5 data-[state=open]:border-brand-red/40 transition-colors">
            <AccordionTrigger className="hover:no-underline text-left font-semibold">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-8 py-3 rounded-lg border-2 border-brand-red text-foreground font-semibold hover:gradient-bg hover:text-primary-foreground transition-all">
          এখনও প্রশ্ন আছে? যোগাযোগ করুন
        </button>
        <button className="px-8 py-3 rounded-lg gradient-bg text-primary-foreground font-semibold shadow-lg hover:scale-105 active:scale-[0.98] transition-transform">
          এখনই এনরোল করুন
        </button>
      </div>
    </div>
  </section>
);

export default FAQSection;
