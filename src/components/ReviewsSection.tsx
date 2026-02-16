import { Star, Play, Quote } from "lucide-react";
import GradientText from "./GradientText";
import { useState } from "react";
import reviewImg1 from "@/assets/review-screenshot-1.jpg";
import reviewImg2 from "@/assets/review-screenshot-2.jpg";

interface Review {
  name: string;
  role: string;
  text: string;
  rating: number;
  type: "video" | "screenshot";
  media: string;
}

const reviews: Review[] = [
  {
    name: "তানিয়া আক্তার",
    role: "ওয়েব ডেভেলপার",
    text: "সবচেয়ে ভালো লেগেছে প্র্যাক্টিক্যাল প্রজেক্টগুলো। রিয়েল ওয়ার্ল্ড প্রজেক্ট দিয়ে শেখানো হয়েছে।",
    rating: 5,
    type: "video",
    media: "https://www.youtube.com/embed/VVlJyvggI9Y",
  },
  {
    name: "কামরুল হাসান",
    role: "ডিজিটাল মার্কেটার",
    text: "পেমেন্ট গেটওয়ে আর ফেসবুক পিক্সেল মডিউলটা আমার জন্য গেম চেঞ্জার ছিল।",
    rating: 5,
    type: "screenshot",
    media: reviewImg1,
  },
  {
    name: "আরিফ মাহমুদ",
    role: "SaaS ফাউন্ডার",
    text: "কোর্স শেষ করে নিজের SaaS প্রোডাক্ট লঞ্চ করেছি। মেন্টরশিপ অসাধারণ ছিল।",
    rating: 5,
    type: "screenshot",
    media: reviewImg2,
  },
  {
    name: "নাফিসা রহমান",
    role: "ফ্রিল্যান্সার",
    text: "৩ মাসের মধ্যে ফাইভারে প্রথম অর্ডার পেয়েছি। কোর্সের ফ্রিল্যান্সিং মডিউল খুবই হেল্পফুল।",
    rating: 5,
    type: "video",
    media: "https://www.youtube.com/embed/VVlJyvggI9Y",
  },
];

const VideoModal = ({ url, onClose }: { url: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-3xl mx-4 aspect-video rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <iframe src={url} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
    </div>
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-brand-red/30 transition-colors duration-300">
        {/* Media */}
        {review.type === "video" && (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted">
            <iframe
              src={review.media}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        {review.type === "screenshot" && (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted">
            <img src={review.media} alt="Student review" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Quote */}
        <div className="relative">
          <Quote className="h-5 w-5 text-brand-orange/40 absolute -top-1 -left-1" />
          <p className="text-sm leading-relaxed pl-5">{review.text}</p>
        </div>

        {/* Stars */}
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-brand-orange text-brand-orange" />
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm">{review.name}</p>
            <p className="text-xs text-muted-foreground">{review.role}</p>
          </div>
        </div>
      </div>

      {showVideo && (
        <VideoModal url={review.media} onClose={() => setShowVideo(false)} />
      )}
    </>
  );
};

const ReviewsSection = () => (
  <section id="reviews" className="py-16 sm:py-20">
    <div className="container mx-auto px-4 max-w-[1400px] space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold">
          স্টুডেন্টদের <GradientText>রিভিউ</GradientText>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          আমাদের স্টুডেন্টরা কি বলছে তাদের অভিজ্ঞতা সম্পর্কে
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
