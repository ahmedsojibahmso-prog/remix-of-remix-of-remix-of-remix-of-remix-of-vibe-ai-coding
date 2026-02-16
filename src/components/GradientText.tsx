import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const GradientText = ({ children, className, as: Tag = "span" }: GradientTextProps) => (
  <Tag className={cn("gradient-text font-bold", className)}>{children}</Tag>
);

export default GradientText;
