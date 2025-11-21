import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles = [
  {
    id: 1,
    title: "The Fibre Gap: Why 90% of us are missing out",
    category: "Nutrition Science",
    readTime: "5 min read",
    image: "bg-emerald-100"
  },
  {
    id: 2,
    title: "Plant Protein vs. Whey: The definitive guide",
    category: "Comparison",
    readTime: "7 min read",
    image: "bg-emerald-200"
  },
  {
    id: 3,
    title: "Micronutrients and Mental Clarity",
    category: "Wellness",
    readTime: "4 min read",
    image: "bg-emerald-50"
  }
];

export default function Blog() {
  return (
    <div className="w-full min-h-screen bg-brand-light pt-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="font-display text-5xl text-brand-deep mb-4">Insights</h1>
          <p className="text-brand-dark/60 text-xl">Latest research and updates from the team.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className={`aspect-[4/3] rounded-2xl mb-6 ${article.image} transition-transform duration-500 group-hover:scale-[1.02]`} />
              <div className="flex items-center gap-3 text-xs font-medium text-brand-deep/50 mb-3 uppercase tracking-wide">
                <span>{article.category}</span>
                <span className="w-1 h-1 bg-brand-deep/30 rounded-full" />
                <span>{article.readTime}</span>
              </div>
              <h3 className="font-display text-2xl text-brand-deep mb-3 group-hover:text-brand-leaf transition-colors">
                {article.title}
              </h3>
              <Button variant="link" className="p-0 text-brand-deep group-hover:translate-x-2 transition-transform">
                Read Article <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
