import { Briefcase, Code2, Users, Star, Youtube, Linkedin, Github, Twitter } from "lucide-react";
import GradientText from "./GradientText";

const stats = [
  { icon: Briefcase, value: "5+", label: "Years Experience" },
  { icon: Code2, value: "50+", label: "Projects" },
  { icon: Users, value: "1000+", label: "Students" },
  { icon: Star, value: "4.9/5", label: "Rating ⭐" },
];

const socials = [
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const InstructorSection = () => (
  <section className="py-16 sm:py-20 bg-secondary/50">
    <div className="container mx-auto px-4 max-w-4xl space-y-8">
      <h2 className="text-3xl sm:text-4xl font-bold text-center">
        আপনার <GradientText>ইন্সট্রাক্টর</GradientText>
      </h2>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center">
        {/* Photo placeholder */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl shrink-0 bg-muted border-4 border-transparent gradient-border flex items-center justify-center text-muted-foreground">
          <span className="text-sm">Photo</span>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold gradient-text">Instructor Name</h3>
            <p className="text-brand-orange font-medium">AI Developer & Course Creator</p>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            ৫ বছরের বেশি সময় ধরে ওয়েব ডেভেলপমেন্ট এবং AI কোডিং নিয়ে কাজ করছি। 
            ১০০০+ স্টুডেন্টকে সফলভাবে AI কোডিং শেখানোর অভিজ্ঞতা রয়েছে।
            আমার লক্ষ্য হলো বাংলাদেশের তরুণদের AI দিয়ে স্বনির্ভর করা।
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <GradientText className="text-xl font-bold">{s.value}</GradientText>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center md:justify-start">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:gradient-bg hover:text-primary-foreground hover:border-transparent transition-all"
                aria-label={s.label}
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default InstructorSection;
