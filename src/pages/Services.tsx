import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Phone } from "lucide-react";
import residentialRoofing from "@/assets/residential-roofing.jpg";
import waterproofing from "@/assets/waterproofing.jpg";
import roofRepair from "@/assets/roof-repair.jpg";
import heroImage from "@/assets/hero-roofing.jpg";

const services = [
  {
    id: "residential",
    title: "Residential Roofing",
    subtitle: "Complete Home Roofing Solutions",
    description:
      "Your home deserves the best protection against Calgary's unpredictable weather. Our residential roofing services cover everything from new installations to complete replacements, using only premium materials designed for Alberta's climate.",
    image: residentialRoofing,
    features: [
      "Asphalt shingle installation & replacement",
      "Metal roofing systems",
      "Cedar shake roofing",
      "Synthetic slate & tile options",
      "Full tear-off and re-roofing",
      "Ventilation system optimization",
      "Ice dam prevention solutions",
      "5-year workmanship warranty",
    ],
    benefits: [
      "Materials rated for extreme temperature swings",
      "Hail-resistant options available",
      "Energy-efficient underlayment",
      "Manufacturer warranties up to 50 years",
    ],
  },
  {
    id: "waterproofing",
    title: "Flat Roof Waterproofing",
    subtitle: "Commercial & Residential Flat Roof Experts",
    description:
      "Flat roofs require specialized expertise to prevent water pooling and leakage. Our waterproofing solutions use industry-leading materials and techniques to keep your property dry for decades.",
    image: waterproofing,
    features: [
      "TPO membrane installation",
      "EPDM rubber roofing",
      "Modified bitumen systems",
      "Liquid-applied coatings",
      "Drainage system design",
      "Parapet and coping repair",
      "Skylights and curb sealing",
      "Reflective cool-roof coatings",
    ],
    benefits: [
      "Seamless waterproof protection",
      "Energy-saving reflective options",
      "Minimal maintenance required",
      "20+ year lifespan",
    ],
  },
  {
    id: "repairs",
    title: "Roof Repairs",
    subtitle: "Fast Response, Lasting Solutions",
    description:
      "When your roof is damaged, you need fast, reliable repairs. Our team provides 24/7 emergency service and permanent solutions for all types of roofing problems.",
    image: roofRepair,
    features: [
      "Emergency leak repair",
      "Storm and hail damage assessment",
      "Shingle replacement",
      "Flashing and vent repairs",
      "Gutter repair and replacement",
      "Soffit and fascia repair",
      "Chimney flashing",
      "Insurance claim assistance",
    ],
    benefits: [
      "24/7 emergency response",
      "Same-day service available",
      "Comprehensive damage assessment",
      "Direct insurance billing",
    ],
  },
  {
    id: "inspections",
    title: "Roof Inspections",
    subtitle: "Preventive Care & Peace of Mind",
    description:
      "Regular roof inspections can save you thousands by catching problems early. Our certified inspectors provide detailed reports and honest recommendations.",
    image: heroImage,
    features: [
      "Comprehensive visual inspection",
      "Thermal imaging analysis",
      "Moisture detection testing",
      "Detailed photo documentation",
      "Written condition report",
      "Maintenance recommendations",
      "Lifespan estimation",
      "Pre-purchase inspections",
    ],
    benefits: [
      "Catch problems before they're expensive",
      "Extend your roof's lifespan",
      "Insurance documentation",
      "Real estate transaction support",
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-max section-padding !py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
              Our Services
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Expert Roofing Services for Calgary Homes
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From new installations to emergency repairs, our Red Seal certified team 
              delivers exceptional results backed by our 5-year workmanship warranty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding">
        <div className="container-max">
          <div className="space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${
                  index % 2 === 1 ? "" : ""
                }`}
              >
                {/* Image */}
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden shadow-strong aspect-[4/3]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-2">
                    {service.subtitle}
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-4">
                      What's Included:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-secondary rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-foreground mb-3">
                      Why Choose Duckbill:
                    </h3>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to="/estimate">
                    <Button variant="cta" size="lg" className="group">
                      Get a Free Estimate
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Contact us today for a free, no-obligation estimate. Our team is ready 
              to help protect your home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/estimate">
                <Button variant="cta" size="xl">
                  GET AN INSTANT ESTIMATE
                </Button>
              </Link>
              <a href="tel:+14035551234">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
                >
                  <Phone className="h-5 w-5" />
                  (403) 555-1234
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
