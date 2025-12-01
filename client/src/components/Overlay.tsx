import { motion } from "framer-motion";
import {
  ArrowDown,
  Check,
  Mail,
  Users,
  Leaf,
  Heart,
  TrendingUp,
  Shield,
  Sparkles,
  Target,
  Award,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneShowcase from "@/components/PhoneShowcase";

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`w-full py-16 px-8 md:px-20 max-w-screen-2xl mx-auto flex flex-col justify-center ${className}`}
  >
    {children}
  </section>
);

export default function EnhancedLanding() {
  return (
    <div className="w-full min-h-screen  font-sans text-brand-dark bg-gradient-to-b from-white via-brand-light/20 to-white overflow-x-hidden">
      {/* Scene 1: Hero Intro */}
      <Section className="relative min-h-screen">
        <PhoneShowcase className="absolute right-8 top-24 z-0" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl relative z-10"
        >
          <h1 className="font-display text-6xl md:text-8xl font-medium mb-6 text-brand-deep tracking-tight">
            The Lively T{"h"}ree
          </h1>
          <p className="text-2xl md:text-3xl text-brand-deep/90 leading-relaxed max-w-2xl mb-4">
            Only 1 in 10 people hits their daily fiber target. Do you?
          </p>
          <p className="text-xl md:text-2xl text-brand-dark/70 leading-relaxed max-w-xl">
            One simple app for smarter fiber, protein, and micronutrients.
            <br />
            <span className="text-brand-leaf font-medium">
              Naturally! From gut to body to mind.
            </span>
          </p>
          <div className="mt-12 flex gap-4 items-center">
            <Button
              size="lg"
              className="bg-brand-deep text-white hover:bg-brand-dark rounded-full px-8 h-14 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Download App
            </Button>
            <div className="animate-bounce">
              <ArrowDown className="w-8 h-8 text-brand-deep opacity-50" />
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Scene 2: Why It Matters */}
      <Section className="items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl text-brand-deep mb-6">
            Why These Three?
          </h2>
          <p className="text-xl text-brand-dark/70 max-w-2xl mx-auto">
            These aren't just nutrients—they're the foundation of every healthy
            cell, every energized moment, every vibrant day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-brand-leaf/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-brand-leaf/20 rounded-2xl flex items-center justify-center mb-6">
              <Leaf className="w-8 h-8 text-brand-leaf" />
            </div>
            <h3 className="font-display text-3xl text-brand-deep mb-3">
              Fiber
            </h3>
            <p className="text-brand-dark/70 leading-relaxed mb-4">
              Essential for gut health and longevity. Your microbiome thrives on
              fiber, supporting everything from digestion to immunity to mental
              clarity.
            </p>
            <div className="text-sm text-brand-leaf font-medium">
              Target: 25-35g daily
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-brand-leaf/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-brand-leaf/20 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-brand-leaf" />
            </div>
            <h3 className="font-display text-3xl text-brand-deep mb-3">
              Protein
            </h3>
            <p className="text-brand-dark/70 leading-relaxed mb-4">
              Building blocks for repair and strength. Every cell in your body
              depends on protein for structure, function, and renewal.
            </p>
            <div className="text-sm text-brand-leaf font-medium">
              Target: 0.8-1.2g per kg body weight
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-brand-leaf/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-brand-leaf/20 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-brand-leaf" />
            </div>
            <h3 className="font-display text-3xl text-brand-deep mb-3">
              Micronutrients
            </h3>
            <p className="text-brand-dark/70 leading-relaxed mb-4">
              The unseen power of cellular function. Vitamins and minerals
              orchestrate thousands of biochemical reactions that keep you
              thriving.
            </p>
            <div className="text-sm text-brand-leaf font-medium">
              Target: Complete daily spectrum
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Scene 3: The Movement Philosophy */}
      <Section className="bg-gradient-to-br from-brand-light/30 to-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-display text-4xl md:text-5xl text-brand-deep mb-6">
              A Citizen-Science Movement
            </h2>
            <p className="text-lg text-brand-dark/80 leading-relaxed mb-6">
              This isn't just an app—it's a movement. We're building a
              community-centric, data-driven platform where{" "}
              <strong>you own your data</strong> and contribute to collective
              wellness insights.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-leaf/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-brand-leaf" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-deep mb-1">
                    Data Ownership
                  </h4>
                  <p className="text-brand-dark/70">
                    Your health data belongs to you. Grant or revoke access on
                    your terms.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-leaf/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-brand-leaf" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-deep mb-1">
                    Community-Driven
                  </h4>
                  <p className="text-brand-dark/70">
                    Join thousands making mindful choices together, sharing
                    insights, not selling data.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-leaf/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe2 className="w-5 h-5 text-brand-leaf" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-deep mb-1">
                    Sustainability First
                  </h4>
                  <p className="text-brand-dark/70">
                    Track your environmental impact. Better nutrition for you
                    and the planet.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-brand-leaf/30"
          >
            <h3 className="font-display text-2xl text-brand-deep mb-6 text-center">
              Our Core Principles
            </h3>
            <div className="space-y-4">
              {[
                { icon: Target, text: "Citizen-controlled health data" },
                { icon: Heart, text: "Community-centric design" },
                { icon: TrendingUp, text: "Data-driven insights" },
                { icon: Leaf, text: "Sustainability metrics" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-brand-light/50 rounded-xl"
                >
                  <item.icon className="w-6 h-6 text-brand-leaf" />
                  <span className="text-brand-dark font-medium">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Scene 4: App Features & Benefits */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl text-brand-deep mb-6">
            Simple Tracking, Profound Impact
          </h2>
          <p className="text-xl text-brand-dark/70 max-w-2xl mx-auto">
            See your daily progress at a glance. Understand how your choices
            ripple through your health and the environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Daily Tracking",
              desc: "Log meals effortlessly. See fiber, protein, and micronutrients in real-time.",
              icon: Target,
            },
            {
              title: "Personalized Insights",
              desc: "AI-powered recommendations based on your unique health profile and goals.",
              icon: Sparkles,
            },
            {
              title: "Community Challenges",
              desc: "Join nutrition challenges. Share victories. Learn from fellow members.",
              icon: Users,
            },
            {
              title: "Sustainability Score",
              desc: "Track your food's environmental footprint. Make choices that matter.",
              icon: Leaf,
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-brand-leaf/10 hover:shadow-xl transition-all duration-300 hover:border-brand-leaf/30"
            >
              <div className="w-12 h-12 bg-brand-leaf/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-brand-leaf" />
              </div>
              <h4 className="font-display text-xl text-brand-deep mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-brand-dark/70">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Scene 5: The Data Speaks */}
      <Section className="items-center justify-center text-center bg-gradient-to-br from-white via-brand-light/20 to-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/95 backdrop-blur-lg p-12 md:p-16 rounded-3xl shadow-2xl border border-brand-leaf/30 max-w-5xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl text-brand-deep mb-4">
            The Data Speaks
          </h2>
          <p className="text-lg text-brand-dark/70 mb-12 max-w-2xl mx-auto">
            These numbers tell a story—one of gaps we can fill together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div>
              <div className="text-5xl md:text-6xl font-bold text-brand-leaf mb-3">
                1 in 10
              </div>
              <p className="text-brand-dark/80 leading-relaxed">
                People hit their daily fiber target. We're here to change that.
              </p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-brand-leaf mb-3">
                45%
              </div>
              <p className="text-brand-dark/80 leading-relaxed">
                Increase in energy levels reported by users who track
                consistently.
              </p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-brand-leaf mb-3">
                100%
              </div>
              <p className="text-brand-dark/80 leading-relaxed">
                Commitment to natural ingredients and sustainable food systems.
              </p>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Scene 6: Timeline */}
      <Section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-5xl md:text-6xl text-brand-deep mb-6">
            Our Aspirational Timeline
          </h2>
          <p className="text-xl text-brand-dark/70 max-w-2xl mx-auto">
            From foundation to global movement—here's how we're building the
            future of nutrition.
          </p>
        </motion.div>

        <div className="w-full overflow-x-auto pb-8">
          <div className="flex gap-6 min-w-max px-4">
            {[
              {
                icon: "🧭",
                title: "Foundation & Ethics",
                items: [
                  "Initial design",
                  "Establish ethical guidelines",
                  "Implement core tracking, data ownership & sharing principle",
                ],
              },
              {
                icon: "🚀",
                title: "Beta Launch",
                items: [
                  "Launch MVP",
                  "Communicate clear ethical standards",
                  "Launch website & social media",
                  "Start sustainability footprint DB (Innosuisse Grant)",
                ],
                highlight: "June 2025",
              },
              {
                icon: "🤝",
                title: "Trust & Community Building",
                items: [
                  "Personalise risk profiles through AI",
                  "Establish personalised sustainability metrics",
                  "Scale data-sharing network",
                  "Design non-exclusive data fabric",
                ],
              },
              {
                icon: "🌱",
                title: "Personalisation & Sustainability Leadership",
                items: [
                  "Full personalised food recommendations",
                  "Provide analytics for sustainability innovation",
                  "Grow citizen-controlled data environment",
                ],
              },
            ].map((phase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-brand-leaf/20 hover:shadow-xl transition-all duration-300 flex-shrink-0 w-80"
              >
                <div className="flex flex-col gap-4">
                  <div className="text-5xl text-center">{phase.icon}</div>
                  <div className="flex-1">
                    <div className="flex flex-col items-center gap-3 mb-4">
                      <h3 className="font-display text-2xl text-brand-deep text-center">
                        {phase.title}
                      </h3>
                      {phase.highlight && (
                        <span className="px-4 py-1 bg-brand-leaf/20 text-brand-deep text-sm font-medium rounded-full">
                          {phase.highlight}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-brand-leaf flex-shrink-0 mt-0.5" />
                          <span className="text-brand-dark/80 text-sm">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-brand-dark/50">
            ← Scroll horizontally to see the full timeline →
          </p>
        </div>
      </Section>

      {/* Scene 7: Call to Action */}
      <Section className="items-center justify-center text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          className="max-w-3xl"
        >
          <h2 className="font-display text-5xl md:text-6xl text-brand-deep mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-brand-dark/70 mb-12 leading-relaxed">
            This is just the beginning. We will improve. Help us build a value
            community where citizens increasingly regain control of their health
            and data to create sustainable livelihoods.
          </p>
          <div className="bg-white/95 backdrop-blur-lg p-10 md:p-14 rounded-3xl shadow-2xl border border-brand-leaf/20 mb-12">
            <p className="text-lg text-brand-dark/80 mb-8 leading-relaxed">
              With your support, we, as your proxy, will mature into a
              professional platform that truly reshapes how food connects to
              wellness—<strong>one mindful choice at a time</strong>.
            </p>
            <Button
              size="lg"
              className="bg-brand-deep text-white hover:bg-brand-dark rounded-full px-12 h-16 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Download App
            </Button>
          </div>
        </motion.div>
      </Section>

      {/* Scene 8: Newsletter Signup */}
      <Section
        className="justify-center items-center text-center py-20 "
        style={{ paddingBottom: "10vh" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mb-12"
        >
          <div className="p-10 md:p-14 bg-gradient-to-b from-white to-brand-light">
            <Award className="w-16 h-16 text-brand-leaf mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl text-brand-deep mb-4">
              Join the Movement
            </h2>
            <p className="text-brand-dark/70 mb-8 text-lg">
              Be the first to experience the future of personalized nutrition.
              Get early access, exclusive insights, and community updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Input
                placeholder="Enter your email"
                className="h-14 bg-white border-brand-leaf/30 focus:ring-brand-deep text-lg flex-1"
              />
              <Button
                size="lg"
                className="h-14 px-8 bg-brand-deep hover:bg-brand-dark rounded-full"
              >
                Join Now
              </Button>
            </div>
            <p className="text-xs text-brand-dark/40">
              We respect your privacy. Unsubscribe at any time. Your data stays
              yours.
            </p>
          </div>
        </motion.div>

       
      </Section>

      <footer className="w-full text-center text-sm text-brand-dark/40 font-medium py-8 mt-4">
        <p className="mb-2">© 2025 The Lively Three. All rights reserved.</p>
      </footer>
    </div>
  );
}
