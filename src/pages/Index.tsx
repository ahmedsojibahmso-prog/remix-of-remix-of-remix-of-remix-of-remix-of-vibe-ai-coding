import { useTheme } from "@/hooks/useTheme";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import CourseHighlights from "@/components/CourseHighlights";
import FeaturesSection from "@/components/FeaturesSection";
import ModulesSection from "@/components/ModulesSection";
import FreeClassSection from "@/components/FreeClassSection";
import ComparisonSection from "@/components/ComparisonSection";
import InstructorSection from "@/components/InstructorSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import EnrollSection from "@/components/EnrollSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar isDark={isDark} toggleTheme={toggle} />
      <main>
        <HeroSection />
        <IntroSection />
        <CourseHighlights />
        <FeaturesSection />
        <ModulesSection />
        <FreeClassSection />
        <ComparisonSection />
        <InstructorSection />
        <ReviewsSection />
        <FAQSection />
        <EnrollSection />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
