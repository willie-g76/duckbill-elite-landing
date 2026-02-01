import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Award, Clock } from "lucide-react";
import heroImage from "@/assets/hero-roofing.jpg";
import redSealBadge from "@/assets/red-seal-badge.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative container-max section-padding">
        <div className="max-w-3xl">
          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <div className="badge-trust">
              <Shield className="h-4 w-4 text-accent" />
              <span>BBB A Rated</span>
            </div>
            <div className="badge-trust">
              <Award className="h-4 w-4 text-accent" />
              <span>5-Year Warranty</span>
            </div>
            <div className="badge-trust">
              <Clock className="h-4 w-4 text-accent" />
              <span>24/7 Emergency Service</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            Protecting Calgary Homes
            <span className="block text-accent">From Alberta's Climate</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl leading-relaxed"
          >
            Expert roofing and waterproofing solutions backed by Red Seal certified craftsmen. From hailstorms to heavy
            snow, trust Duckbill to keep your home safe and dry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/estimate">
              <Button variant="cta" size="xl" className="w-full sm:w-auto">
                GET AN ESTIMATE
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="ctaOutline"
                size="xl"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                View Our Services
              </Button>
            </Link>
          </motion.div>

          {/* Red Seal Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex items-center gap-4"
          >
            <img
              src={redSealBadge}
              alt="Interprovincial Standard Canada Red Seal"
              className="h-16 w-16 object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-primary-foreground">Red Seal Certified</p>
              <p className="text-xs text-primary-foreground/70">Interprovincial Standard</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
