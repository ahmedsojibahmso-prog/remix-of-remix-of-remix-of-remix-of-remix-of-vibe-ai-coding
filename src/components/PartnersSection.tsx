import GradientText from "./GradientText";

const partners = [
  { name: "Vercel", emoji: "▲" },
  { name: "Stripe", emoji: "💳" },
  { name: "OpenAI", emoji: "🤖" },
  { name: "Figma", emoji: "🎨" },
  { name: "GitHub", emoji: "🐙" },
  { name: "Notion", emoji: "📝" },
  { name: "Lovable", emoji: "💜" },
  { name: "Supabase", emoji: "⚡" },
];

const PartnersSection = () => (
  <section className="py-16 sm:py-20 overflow-hidden bg-background">
    <div className="container mx-auto px-4 max-w-[1400px] space-y-10">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">
          আমরা যাদের সাথে <GradientText>কাজ করি</GradientText>
        </h2>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex gap-8 items-center"
          style={{
            animation: "scroll-left 30s linear infinite",
            width: "max-content",
          }}
        >
          {[...partners, ...partners, ...partners].map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 justify-center min-w-[160px] h-[65px] bg-card border border-border rounded-xl px-5 hover:border-brand-red/40 hover:scale-110 hover:shadow-lg transition-all duration-300 shrink-0 cursor-pointer"
            >
              <span className="text-2xl">{p.emoji}</span>
              <span className="font-english font-semibold text-sm text-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PartnersSection;
