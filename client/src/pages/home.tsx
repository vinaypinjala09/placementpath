import { useState, useEffect } from "react";
import { useAnalyze } from "@/hooks/use-analyze";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { Github, Loader2, Target, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  // Trigger query automatically when searchQuery updates
  const { data, isLoading, error } = useAnalyze(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSearchQuery(username.trim());
    }
  };

  const hasResults = !!data;

  // Clear the search if the user entirely clears out the input box manually
  useEffect(() => {
    if (username === "" && searchQuery) {
      setSearchQuery(null);
    }
  }, [username, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main 
        className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col items-center
        ${hasResults ? 'py-12 lg:py-16' : 'min-h-[90vh] justify-center py-20'}`}
      >
        
        {/* Header Section */}
        <motion.div 
          layout
          className="text-center w-full max-w-3xl mx-auto"
        >
          <motion.div layoutId="logo" className="inline-flex items-center justify-center p-3 bg-card rounded-2xl mb-8 text-primary shadow-sm border border-border">
            <Target className="w-8 h-8" />
          </motion.div>
          
          <motion.h1 layoutId="title" className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-foreground mb-6">
            PlacementPath
          </motion.h1>
          
          <AnimatePresence>
            {!hasResults && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-lg md:text-xl text-muted-foreground mb-12 overflow-hidden px-4"
              >
                AI-powered career signal analysis for tech students. <br className="hidden md:block"/>
                Discover how recruiters view your GitHub profile.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Search Form */}
          <motion.form 
            layoutId="search-form"
            onSubmit={handleSubmit} 
            className="relative w-full max-w-2xl mx-auto flex items-center z-10 mb-8"
          >
            <div className="absolute left-5 text-muted-foreground pointer-events-none">
              <Github className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="w-full h-16 pl-14 pr-36 rounded-2xl border border-border bg-card text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-lg shadow-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="absolute right-2 top-2 bottom-2 px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
            </button>
          </motion.form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center gap-3 text-sm max-w-xl mx-auto border border-destructive/20 font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error.message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Dashboard Component */}
        <AnimatePresence mode="wait">
          {data && !isLoading && !error && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="w-full mt-10"
            >
              <ResultsDashboard data={data} />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
