import { useState } from "react";
import { Play, X } from "lucide-react";
import GradientText from "./GradientText";

const videos = [
  { id: "dQw4w9WgXcQ", title: "AI কোডিং কি এবং কেন শিখবেন?", desc: "AI কোডিং এর ভবিষ্যৎ এবং সম্ভাবনা নিয়ে আলোচনা" },
  { id: "dQw4w9WgXcQ", title: "Lovable দিয়ে প্রথম ওয়েবসাইট", desc: "হাতে কলমে শিখুন কিভাবে Lovable দিয়ে সাইট তৈরি করবেন" },
  { id: "dQw4w9WgXcQ", title: "ফ্রিল্যান্সিং শুরু করার গাইড", desc: "AI কোডিং দিয়ে কিভাবে ফ্রিল্যান্সিং শুরু করবেন" },
];

const FreeClassSection = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="free-class" className="py-16 sm:py-20 bg-secondary/50">
      <div className="container mx-auto px-4 max-w-[1400px] space-y-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          <GradientText>ফ্রি</GradientText> ক্লাস দেখুন
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <button
              key={i}
              onClick={() => setActiveVideo(v.id)}
              className="bg-card border border-border rounded-2xl overflow-hidden text-left hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative aspect-video bg-muted">
                <img
                  src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                  alt={v.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center group-hover:bg-foreground/30 transition-colors">
                  <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-semibold line-clamp-2">{v.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{v.desc}</p>
                <p className="text-sm font-medium">
                  <GradientText>ফ্রি</GradientText> দেখুন
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button className="px-10 py-3.5 rounded-lg gradient-bg text-primary-foreground font-semibold text-lg shadow-lg hover:scale-105 active:scale-[0.98] transition-transform">
            এখনই এনরোল করুন
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[60] bg-foreground/80 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-primary-foreground hover:text-brand-orange transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default FreeClassSection;
