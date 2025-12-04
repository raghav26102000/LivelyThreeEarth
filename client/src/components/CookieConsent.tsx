import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCookieConsent();
  }, []);

  const checkCookieConsent = () => {
    try {
      // Check localStorage for consent
      const localConsent = localStorage.getItem("cookie-consent");
      
      if (!localConsent) {
        // No consent stored, show banner
        setShowBanner(true);
      }
    } catch (error) {
      console.error("Error checking cookie consent:", error);
      // If localStorage is blocked, still show the banner
      setShowBanner(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    try {
      localStorage.setItem("cookie-consent", "accepted");
      setShowBanner(false);
      console.log("Cookies accepted");
    } catch (error) {
      console.error("Error saving cookie consent:", error);
      // Even if storage fails, hide the banner
      setShowBanner(false);
    }
  };

  const handleReject = () => {
    try {
      localStorage.setItem("cookie-consent", "rejected");
      setShowBanner(false);
      console.log("Cookies rejected");
    } catch (error) {
      console.error("Error saving cookie consent:", error);
      // Even if storage fails, hide the banner
      setShowBanner(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-brand-leaf/20 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icon */}
                <div className="w-12 h-12 bg-brand-leaf/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-brand-leaf" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-xl md:text-2xl text-brand-deep mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-brand-dark/70 text-sm md:text-base leading-relaxed">
                    We use cookies to enhance your experience, analyze site usage, and
                    remember your preferences. Your data stays yours—we're committed to
                    transparency and your control.{" "}
                    <a
                      href="/privacy"
                      className="text-brand-leaf hover:text-brand-deep underline transition-colors"
                    >
                      Learn more
                    </a>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="rounded-full border-brand-leaf/30 text-brand-dark hover:bg-brand-light hover:text-brand-deep transition-all duration-300"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="bg-brand-deep text-white hover:bg-brand-dark rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Accept Cookies
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}