import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import GradientText from "./GradientText";

const navLinks = [
  { label: "কোর্স", href: "#course" },
  { label: "মডিউল", href: "#modules" },
  { label: "ফ্রি গিফট", href: "#features", highlight: "ফ্রি" },
  { label: "ফ্রি ক্লাস", href: "#free-class", highlight: "ফ্রি" },
  { label: "রিভিউ", href: "#reviews" },
];

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Navbar = ({ isDark, toggleTheme }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-[1400px]">
        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-1 font-english font-bold text-xl">
          <GradientText className="text-2xl">TECH</GradientText>
          <span className="text-foreground">VIBE</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.highlight ? (
                <>
                  <span className="gradient-text">{link.highlight}</span>
                  {link.label.replace(link.highlight, "")}
                </>
              ) : (
                link.label
              )}
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          <button
            onClick={() => navigate("/auth")}
            className="hidden sm:inline-flex border border-primary text-primary font-semibold text-sm px-5 py-2 rounded-lg hover:bg-primary/10 active:scale-[0.98] transition-all"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden sm:inline-flex gradient-bg text-primary-foreground font-semibold text-sm px-5 py-2 rounded-lg hover:scale-105 active:scale-[0.98] transition-transform"
          >
            Dashboard
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left py-3 px-4 rounded-lg text-foreground hover:bg-accent transition-colors"
              >
                {link.highlight ? (
                  <>
                    <span className="gradient-text">{link.highlight}</span>
                    {link.label.replace(link.highlight, "")}
                  </>
                ) : (
                  link.label
                )}
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); navigate("/auth"); }}
              className="mt-2 border border-primary text-primary font-semibold py-3 rounded-lg"
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMobileOpen(false); navigate("/dashboard"); }}
              className="mt-1 gradient-bg text-primary-foreground font-semibold py-3 rounded-lg"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
