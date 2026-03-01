import { type AnalysisResponse } from "@shared/schema";
import { motion } from "framer-motion";
import { ScoreGauge } from "./ScoreGauge";
import { 
  FolderGit2, Star, Code, Activity, 
  CheckCircle2, TrendingUp, Target 
} from "lucide-react";

// Determine the qualitative stage based on the raw score
function getStage(score: number) {
  if (score <= 40) return { label: "Building Foundations", color: "text-amber-600", bg: "bg-amber-100/50" };
  if (score <= 70) return { label: "Emerging Developer", color: "text-primary", bg: "bg-primary/10" };
  return { label: "Strong Career Signal", color: "text-emerald-600", bg: "bg-emerald-100/50" };
}

// Generate dynamic textual insights
function getInsights(data: AnalysisResponse) {
  const positives = [];
  const improvements = [];

  if (data.totalStars > 10) positives.push(`Great community engagement with ${data.totalStars} total stars.`);
  if (data.languages.length >= 3) positives.push(`Versatile skill set spanning ${data.languages.length} programming languages.`);
  if (data.repoCount >= 10) positives.push(`Strong portfolio breadth with ${data.repoCount} active repositories.`);
  if (data.consistencyScore >= 70) positives.push("Excellent coding consistency over time.");
  
  if (positives.length === 0) positives.push("Good start on building your foundational GitHub presence.");

  if (data.repoCount < 5) improvements.push("Build more diverse projects to showcase depth of skills.");
  if (data.consistencyScore < 50) improvements.push("Try coding more consistently to build a stronger signal.");
  if (data.languages.length <= 1) improvements.push("Consider exploring another language to broaden your expertise.");
  
  // Safe date parsing to determine if the profile is dormant
  try {
    const daysSinceUpdate = (new Date().getTime() - new Date(data.lastUpdated).getTime()) / (1000 * 3600 * 24);
    if (daysSinceUpdate > 90) improvements.push("Your profile hasn't been updated recently. Make some fresh commits!");
  } catch (e) {
    // Ignore date parsing errors
  }

  if (improvements.length === 0) improvements.push("Keep maintaining your high standards and consider contributing to open-source.");

  return { positives, improvements };
}

function StatBox({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: string | number, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-secondary/40 rounded-3xl p-5 border border-border/40 hover:bg-secondary/70 transition-colors flex flex-col justify-between"
    >
      <div className="w-10 h-10 bg-card rounded-xl shadow-sm text-primary flex items-center justify-center mb-4 border border-border/50">
        {icon}
      </div>
      <div>
        <div className="text-3xl font-display font-bold text-foreground mb-1">{value}</div>
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

function PlanStep({ week, title, desc }: { week: string, title: string, desc: string }) {
  return (
    <div className="relative pl-6 border-l-2 border-primary/20 pb-6 last:pb-0">
      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-card" />
      <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">{week}</div>
      <div className="font-semibold text-foreground text-sm mb-1.5">{title}</div>
      <div className="text-sm text-muted-foreground leading-relaxed">{desc}</div>
    </div>
  );
}

export function ResultsDashboard({ data }: { data: AnalysisResponse }) {
  const stage = getStage(data.overallScore);
  const { positives, improvements } = getInsights(data);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full"
    >
      {/* Score Card */}
      <motion.div variants={itemVariants} className="lg:col-span-1 bg-card rounded-3xl p-8 border border-border shadow-[0_2px_20px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
        <h3 className="text-sm font-display font-bold mb-6 text-muted-foreground uppercase tracking-widest">Career Signal</h3>
        <ScoreGauge score={data.overallScore} />
        <div className={`mt-8 px-5 py-2 rounded-full text-sm font-semibold ${stage.bg} ${stage.color} inline-flex items-center gap-2 ring-1 ring-inset ring-current/10`}>
          <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
          {stage.label}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="lg:col-span-2 bg-card rounded-3xl p-6 border border-border shadow-[0_2px_20px_rgb(0,0,0,0.02)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
          <StatBox delay={0.2} icon={<FolderGit2 className="w-5 h-5" />} label="Repositories" value={data.repoCount} />
          <StatBox delay={0.3} icon={<Star className="w-5 h-5" />} label="Total Stars" value={data.totalStars} />
          <StatBox delay={0.4} icon={<Code className="w-5 h-5" />} label="Languages" value={data.languages.length} />
          <StatBox delay={0.5} icon={<Activity className="w-5 h-5" />} label="Consistency" value={`${data.consistencyScore}%`} />
        </div>
      </motion.div>

      {/* Insights Section */}
      <motion.div variants={itemVariants} className="lg:col-span-2 bg-card rounded-3xl p-8 lg:p-10 border border-border shadow-[0_2px_20px_rgb(0,0,0,0.02)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-lg font-display font-semibold mb-6 flex items-center gap-3 text-emerald-600">
              <span className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle2 className="w-5 h-5" /></span>
              What You're Doing Well
            </h4>
            <ul className="space-y-5">
              {positives.map((p, i) => (
                <li key={i} className="flex gap-4 text-sm text-muted-foreground leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-display font-semibold mb-6 flex items-center gap-3 text-amber-600">
              <span className="p-1.5 bg-amber-100 rounded-lg text-amber-600"><TrendingUp className="w-5 h-5" /></span>
              Room to Improve
            </h4>
            <ul className="space-y-5">
              {improvements.map((p, i) => (
                <li key={i} className="flex gap-4 text-sm text-muted-foreground leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Action Plan */}
      <motion.div variants={itemVariants} className="lg:col-span-1 bg-card rounded-3xl p-8 lg:p-10 border border-border shadow-[0_2px_20px_rgb(0,0,0,0.02)]">
        <h4 className="text-lg font-display font-semibold mb-8 flex items-center gap-3 text-foreground">
          <span className="p-1.5 bg-primary/10 rounded-lg text-primary"><Target className="w-5 h-5" /></span>
          30-Day Upgrade Plan
        </h4>
        <div className="pl-2 mt-4">
          <PlanStep 
            week="Week 1-2" 
            title="Deepen a Project" 
            desc="Select your best repository and implement significant new features to show architectural depth." 
          />
          <PlanStep 
            week="Week 3" 
            title="Docs & Deployment" 
            desc="Write a stellar README with screenshots and deploy the app live." 
          />
          <PlanStep 
            week="Week 4" 
            title="Refactor & Polish" 
            desc="Clean up the codebase, add a test suite, and optimize performance." 
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
