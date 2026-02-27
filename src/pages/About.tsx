import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Shield, Award, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import redSealBadge from "@/assets/red-seal-badge.png";
import ContactOptions from "@/components/ContactOptions";

const About = () => {
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
              About Duckbill Roofing
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Calgary's Trusted Roofing Experts
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              With a combined 30 years of experience, our Red Seal certified team has been 
              protecting Calgary homes from Alberta's harshest weather.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built on Quality & Trust
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Duckbill Roofing & Waterproofing was founded with a simple mission: provide Calgary 
                  homeowners with honest, high-quality roofing services they can trust. We saw too many 
                  homeowners getting subpar work from fly-by-night contractors, especially after hailstorms.
                </p>
                <p>
                  Our team is built on Red Seal certified craftsmen — Canada's highest recognition for 
                  skilled trades. Every roof we install meets the strictest national standards for quality and safety.
                </p>
                <p>
                  We're proud to hold a BBB A Rating and back every project with our comprehensive 5-year 
                  workmanship warranty. When we say we stand behind our work, we mean it.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="bg-secondary rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <img src={redSealBadge} alt="Red Seal Certification" className="h-20 w-20 object-contain" />
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">Red Seal Certified</h3>
                    <p className="text-sm text-muted-foreground">Interprovincial Standard</p>
                  </div>
                </div>
                {[
                  { icon: Shield, label: "BBB A Rating", desc: "Accredited business" },
                  { icon: Award, label: "5-Year Warranty", desc: "Workmanship guarantee" },
                  { icon: Users, label: "30 Years Combined", desc: "Industry experience" },
                  { icon: Clock, label: "24/7 Emergency", desc: "Always available" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Honesty First", desc: "Transparent pricing, no hidden fees, and honest assessments. We'll tell you if your roof needs replacing — or if a simple repair will do." },
              { title: "Quality Craftsmanship", desc: "Every project is completed by Red Seal certified professionals using premium materials designed for Alberta's climate." },
              { title: "Customer Focused", desc: "100% satisfaction guarantee. We don't stop until you're happy with the result. That's our promise to every homeowner." },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-8 shadow-soft"
              >
                <CheckCircle className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container-max text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Work With Calgary's Best?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            Get a free estimate or book an in-person inspection today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/estimate">
              <Button variant="cta" size="xl">GET FREE ESTIMATE</Button>
            </Link>
            <a href="tel:+15874323639">
              <Button variant="ctaOutline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                CALL NOW
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
