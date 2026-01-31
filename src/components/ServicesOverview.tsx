import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import residentialRoofing from "@/assets/residential-roofing.jpg";
import waterproofing from "@/assets/waterproofing.jpg";
import roofRepair from "@/assets/roof-repair.jpg";

const services = [
  {
    id: "residential",
    title: "Residential Roofing",
    description:
      "Complete roof installations using premium materials designed to withstand Calgary's extreme weather. From asphalt shingles to metal roofing, we've got you covered.",
    image: residentialRoofing,
    features: ["Asphalt Shingles", "Metal Roofing", "Cedar Shakes", "Roof Replacement"],
  },
  {
    id: "waterproofing",
    title: "Flat Roof Waterproofing",
    description:
      "Specialized waterproofing solutions for flat and low-slope roofs. We use industry-leading membranes and coatings to protect commercial and residential properties.",
    image: waterproofing,
    features: ["TPO Membranes", "EPDM Rubber", "Liquid Coatings", "Drainage Systems"],
  },
  {
    id: "repairs",
    title: "Roof Repairs",
    description:
      "Fast, reliable repair services for storm damage, leaks, and general wear. Our 24/7 emergency response ensures your home stays protected year-round.",
    image: roofRepair,
    features: ["Leak Repair", "Storm Damage", "Shingle Replacement", "Emergency Service"],
  },
];

const ServicesOverview = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
            Our Expertise
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Complete Roofing Solutions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From new installations to emergency repairs, our Red Seal certified team 
            delivers exceptional results on every project.
          </p>
        </motion.div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className={`order-1 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-strong aspect-[4/3]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className={`order-2 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link to={`/services#${service.id}`}>
                  <Button variant="default" size="lg" className="group">
                    Learn More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link to="/services">
            <Button variant="cta" size="xl">
              View All Services
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOverview;
