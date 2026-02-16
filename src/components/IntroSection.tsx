import { useState } from "react";
import GradientText from "./GradientText";

const IntroSection = () => {
  const [expanded, setExpanded] = useState(false);

  const shortText = "AI কোডিং হলো ভবিষ্যতের ডেভেলপমেন্ট। আর্টিফিশিয়াল ইন্টেলিজেন্স ব্যবহার করে আপনি এখন অনেক দ্রুত এবং দক্ষতার সাথে ওয়েবসাইট, অ্যাপ এবং SaaS প্রোডাক্ট তৈরি করতে পারবেন।";
  const fullText = "AI কোডিং হলো ভবিষ্যতের ডেভেলপমেন্ট। আর্টিফিশিয়াল ইন্টেলিজেন্স ব্যবহার করে আপনি এখন অনেক দ্রুত এবং দক্ষতার সাথে ওয়েবসাইট, অ্যাপ এবং SaaS প্রোডাক্ট তৈরি করতে পারবেন। এই কোর্সে আমরা আপনাকে শেখাবো কিভাবে Lovable, Bolt, Cursor এর মতো শক্তিশালী AI টুলস ব্যবহার করে প্রোডাকশন-গ্রেড প্রজেক্ট তৈরি করবেন। আপনি শিখবেন পেমেন্ট গেটওয়ে ইন্টিগ্রেশন, ফেসবুক পিক্সেল সেটআপ, ফ্রিল্যান্সিং ব্লুপ্রিন্ট, এবং প্যাসিভ ইনকামের উপায়। কোনো পূর্ব অভিজ্ঞতা ছাড়াই আপনি একজন দক্ষ AI ডেভেলপার হয়ে উঠতে পারবেন।";

  return (
    <section id="course" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold">
          <GradientText>AI কোডিং</GradientText> - ভবিষ্যতের ডেভেলপমেন্ট
        </h2>
        <div className="relative">
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
            {expanded ? fullText : shortText}
          </p>
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="gradient-text font-semibold text-sm hover:opacity-80 transition-opacity"
        >
          {expanded ? "কম দেখুন ↑" : "সম্পূর্ণ পড়ুন ↓"}
        </button>
      </div>
    </section>
  );
};

export default IntroSection;
