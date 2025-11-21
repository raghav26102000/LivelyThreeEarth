import { motion } from "framer-motion";
import { ArrowDown, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`h-screen w-full p-8 md:p-20 max-w-screen-2xl mx-auto flex flex-col justify-center ${className}`}>
    {children}
  </section>
);

export default function Overlay() {
  return (
    <div className="w-full font-sans text-brand-dark">
      {/* Scene 1: Intro */}
      <Section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-6xl md:text-8xl font-medium mb-6 text-brand-deep tracking-tight">
            The Lively Three
          </h1>
          <p className="text-xl md:text-2xl text-brand-dark/80 leading-relaxed max-w-xl">
            Discover the foundation of true vitality. 
            <br />
            Fibre. Protein. Micronutrients.
          </p>
          <div className="mt-12 flex gap-4">
             <div className="animate-bounce">
                <ArrowDown className="w-8 h-8 text-brand-deep opacity-50" />
             </div>
          </div>
        </motion.div>
      </Section>

      {/* Scene 2: Three Panels */}
      <Section className="items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-20">
          {/* Left - Globe Placeholder */}
          <div className="hidden md:block" /> 
          
          {/* Middle - Infographic */}
          <div className="flex flex-col gap-6 justify-center items-center md:items-start pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-brand-leaf/20 w-full max-w-sm"
            >
              <h3 className="font-display text-2xl text-brand-deep mb-2">Fibre</h3>
              <p className="text-sm text-brand-dark/70">Essential for gut health and longevity.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-brand-leaf/20 w-full max-w-sm"
            >
              <h3 className="font-display text-2xl text-brand-deep mb-2">Protein</h3>
              <p className="text-sm text-brand-dark/70">Building blocks for repair and strength.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-brand-leaf/20 w-full max-w-sm"
            >
              <h3 className="font-display text-2xl text-brand-deep mb-2">Micronutrients</h3>
              <p className="text-sm text-brand-dark/70">The unseen power of cellular function.</p>
            </motion.div>
          </div>

          {/* Right - Connection Text */}
          <div className="flex items-center justify-center md:justify-start">
            <p className="text-lg md:text-xl text-brand-deep/80 font-medium max-w-xs">
              Interconnected systems working in harmony for your health.
            </p>
          </div>
        </div>
      </Section>

      {/* Scene 3: App Mockup */}
      <Section className="items-center md:items-end text-right pointer-events-none">
        <div className="max-w-xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-6xl text-brand-deep mb-6">
              Track Your Balance
            </h2>
            <p className="text-lg text-brand-dark/80 mb-8">
              Our app simplifies the complexity of nutrition into three actionable metrics.
              See your daily progress at a glance.
            </p>
            <Button size="lg" className="bg-brand-deep text-white hover:bg-brand-dark rounded-full px-8 h-14 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Join the Movement
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Scene 4: Parallax / Data */}
      <Section className="items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/90 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-brand-leaf/30 max-w-3xl mx-auto pointer-events-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl text-brand-deep mb-8">
            The Data Speaks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="text-4xl font-bold text-brand-leaf mb-2">1 in 10</div>
              <p className="text-sm text-brand-dark/70">People hit their daily fibre target.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-leaf mb-2">45%</div>
              <p className="text-sm text-brand-dark/70">Increase in energy levels reported.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-leaf mb-2">100%</div>
              <p className="text-sm text-brand-dark/70">Natural ingredients sourced.</p>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Scene 5: Footer */}
      <Section className="justify-center items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
        >
          <div className="p-8 md:p-12 bg-gradient-to-b from-white to-brand-light">
            <h2 className="font-display text-3xl md:text-4xl text-brand-deep mb-4">
              Get notified when we launch
            </h2>
            <p className="text-brand-dark/60 mb-8">
              Be the first to experience the future of personalized nutrition.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                className="h-12 bg-white border-brand-leaf/30 focus:ring-brand-deep text-lg" 
              />
              <Button size="lg" className="h-12 px-6 bg-brand-deep hover:bg-brand-dark">
                <Check className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-brand-dark/40 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </motion.div>
        
        <footer className="absolute bottom-8 text-sm text-brand-dark/30 font-medium">
          © 2024 The Lively Three. All rights reserved.
        </footer>
      </Section>
    </div>
  );
}
