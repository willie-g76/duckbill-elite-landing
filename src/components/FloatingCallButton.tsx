import { Phone } from "lucide-react";
import { motion } from "framer-motion";

const FloatingCallButton = () => {
  return (
    <motion.a
      href="tel:+14032006621"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-duckbill-duck text-white font-semibold px-5 py-3 rounded-full shadow-strong hover:bg-duckbill-textPrimary hover:-translate-y-0.5 active:translate-y-0 transition-all"
    >
      <Phone className="h-5 w-5" />
      CALL NOW
    </motion.a>
  );
};

export default FloatingCallButton;
