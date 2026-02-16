import GradientText from "./GradientText";
import CountdownTimer from "./CountdownTimer";

const OfferBanner = () => (
  <div className="bg-destructive/5 dark:bg-destructive/10 border-2 border-brand-red/30 rounded-xl p-5 sm:p-6 text-center space-y-4">
    <p className="text-base sm:text-lg leading-relaxed">
      নতুন বছর উপলক্ষে <span className="text-brand-orange font-semibold">বিশেষ ছাড়ে</span>{" "}
      <GradientText className="text-xl sm:text-2xl">৳999 টাকায়!</GradientText>{" "}
      অফার চলবে জানুয়ারি পর্যন্ত। এর পর প্রাইস বেড়ে হবে{" "}
      <span className="line-through text-muted-foreground">৳4999</span> টাকা
    </p>
    <CountdownTimer />
  </div>
);

export default OfferBanner;
