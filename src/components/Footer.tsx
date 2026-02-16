import { Facebook, Youtube, Linkedin, Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import GradientText from "./GradientText";

const quickLinks = ["কোর্স", "মডিউল", "ফ্রি ক্লাস", "রিভিউ", "FAQ", "যোগাযোগ"];
const legalLinks = ["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"];
const socials = [
  { icon: Facebook, href: "#" },
  { icon: Youtube, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Instagram, href: "#" },
];

const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="container mx-auto px-4 max-w-[1400px] py-12 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <div className="font-english font-bold text-xl">
            <span className="gradient-text">TECH</span> VIBE
          </div>
          <p className="text-sm text-muted-foreground">AI কোডিং শিখুন, ভবিষ্যৎ গড়ুন</p>
          <div className="flex gap-3">
            {socials.map((s, i) => (
              <a key={i} href={s.href} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:gradient-bg hover:text-primary-foreground transition-all" aria-label="social">
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-semibold gradient-text">কুইক লিংক</h4>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground hover:gradient-text transition-all">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h4 className="font-semibold gradient-text">সাপোর্ট</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <a href="mailto:support@techvibe.com" className="flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" /> support@techvibe.com
            </a>
            <a href="tel:+8801XXXXXXXXX" className="flex items-center gap-2 hover:text-foreground">
              <Phone className="h-4 w-4" /> +880 1XXX XXXXXX
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-foreground">
              <MessageCircle className="h-4 w-4" /> WhatsApp Support
            </a>
            <p>সকাল ৯টা - রাত ৯টা</p>
          </div>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h4 className="font-semibold gradient-text">লিগাল</h4>
          <ul className="space-y-2">
            {legalLinks.map((l) => (
              <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-border">
      <div className="container mx-auto px-4 max-w-[1400px] py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>© 2026 TECH VIBE. All rights reserved.</p>
        <p>Made with <span className="gradient-text">❤️</span> in Bangladesh</p>
      </div>
    </div>
  </footer>
);

export default Footer;
