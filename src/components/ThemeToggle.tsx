import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

const ThemeToggle = ({ isDark, toggle }: ThemeToggleProps) => (
  <button
    onClick={toggle}
    className="p-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
    aria-label="Toggle theme"
  >
    {isDark ? <Moon className="h-4 w-4 text-foreground" /> : <Sun className="h-4 w-4 text-foreground" />}
  </button>
);

export default ThemeToggle;
