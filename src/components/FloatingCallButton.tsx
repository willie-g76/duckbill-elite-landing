import { Phone } from "lucide-react";
import { motion } from "framer-motion";

const FloatingCallButton = () => {
  return (
    <motion.a
      href="tel:+14032006621"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-accent text-accent-foreground font-heading font-bold text-base px-6 py-4 rounded-full shadow-strong hover:bg-accent/90 hover:-translate-y-1 active:translate-y-0 transition-all"
    >
      <Phone className="h-5 w-5" />
      <span className="hidden sm:inline">CALL NOW</span>
      <span className="sm:hidden">CALL</span>
    </motion.a>
  );
};

export default FloatingCallButton;
