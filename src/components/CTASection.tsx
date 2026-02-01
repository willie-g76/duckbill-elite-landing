import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-accent to-orange-500">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-accent-foreground mb-4">
            Ready to Protect Your Home?
          </h2>
          <p className="text-accent-foreground/90 text-lg max-w-2xl mx-auto mb-10">
            Get a free, no-obligation estimate in minutes. Our roofing experts are ready to help you find the perfect
            solution for your home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/estimate">
              <Button
                size="xl"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto group"
              >
                GET AN ESTIMATE
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+14035551234">
              <Button
                variant="outline"
                size="xl"
                className="border-accent-foreground/30 text-accent-foreground bg-transparent hover:bg-accent-foreground/10 w-full sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                (403) 555-1234
              </Button>
            </a>
          </div>

          <p className="mt-8 text-sm text-accent-foreground/70">Available 24/7 for emergency roofing services</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
