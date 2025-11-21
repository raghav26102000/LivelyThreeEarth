import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="w-full min-h-screen bg-white pt-32 px-6">
      <div className="max-w-screen-md mx-auto">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-display text-4xl md:text-5xl text-brand-deep mb-12"
        >
          Privacy Policy
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-emerald lg:prose-lg"
        >
          <p className="text-brand-dark/70">Last updated: November 21, 2024</p>
          <div className="h-px w-full bg-brand-leaf/20 my-8" />
          
          <h3>1. Introduction</h3>
          <p>
            The Lively Three respects your privacy and is committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you 
            visit our website and tell you about your privacy rights.
          </p>

          <h3>2. Data We Collect</h3>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul>
            <li>Identity Data includes first name, last name, username or similar identifier.</li>
            <li>Contact Data includes email address and telephone number.</li>
            <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
          </ul>

          <h3>3. How We Use Your Data</h3>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party).</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
