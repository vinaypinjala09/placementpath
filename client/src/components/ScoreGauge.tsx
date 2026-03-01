import { motion } from "framer-motion";

export function ScoreGauge({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Calculate stroke offset based on percentage
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center py-4">
      <svg className="transform -rotate-90 w-40 h-40 drop-shadow-sm">
        {/* Background Track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-secondary"
        />
        {/* Animated Progress Track */}
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-primary"
          strokeLinecap="round"
        />
      </svg>
      {/* Score Text Overlay */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-display font-bold text-foreground tracking-tighter">
          {score}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
          / 100
        </span>
      </div>
    </div>
  );
}
