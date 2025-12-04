import { motion } from "framer-motion";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function Blog() {
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleReload = () => {
    setLoading(true);
    setKey(prev => prev + 1);
  };

  return (
    <div className="w-full min-h-screen bg-emerald-50 pt-24 px-6">
      <div className="max-w-screen-xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="font-display text-5xl text-emerald-900 mb-4">Insights</h1>
            <p className="text-emerald-800/60 text-xl">Latest research and updates from the team.</p>
          </div>
          <button
            onClick={handleReload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-white rounded-2xl shadow-lg overflow-hidden relative"
          style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-emerald-900">Loading blog content...</div>
            </div>
          )}
          <iframe 
            key={key}
            src="http://thelivelythree.earth:8080"
            className="w-full h-full border-0"
            title="Blog Content"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => setLoading(false)}
          />
        </motion.div>
      </div>
    </div>
  );
}