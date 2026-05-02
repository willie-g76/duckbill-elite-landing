import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactOptions from "@/components/ContactOptions";
import SocialLinks from "@/components/SocialLinks";

const Contact = () => {
  return (
    <Layout>
      <Helmet>
        <title>Contact Duckbill Roofing | Call (587) 432-3639 | Calgary Roofers</title>
        <meta name="description" content="Get in touch with Duckbill Roofing. Call, text, WhatsApp, or email us for roofing services in Calgary and surrounding areas. 24/7 emergency response." />
        <link rel="canonical" href="https://duckbillroofing.ca/contact" />
      </Helmet>
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
              Get in Touch
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Contact Duckbill Roofing
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Call, text, WhatsApp, or email us. We're here to help with all your roofing needs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                  Reach Us Anytime
                </h2>
                <ContactOptions />
              </div>

              <div className="space-y-6">
                <a href="tel:+15874323639" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-accent transition-colors">(587) 432-3639</p>
                    <p className="text-sm text-muted-foreground">Call or text anytime</p>
                  </div>
                </a>
                <a href="mailto:info@duckbillroofing.ca" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-accent transition-colors">info@duckbillroofing.ca</p>
                    <p className="text-sm text-muted-foreground">Email us anytime</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Calgary, Alberta</p>
                    <p className="text-sm text-muted-foreground">Serving Calgary & surrounding areas within 1 hour</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Mon–Sat: 7:00 AM – 7:00 PM</p>
                    <p className="text-sm text-muted-foreground">24/7 Emergency Service Available</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">Follow Us</h3>
                <SocialLinks className="[&_a]:bg-accent/10 [&_a]:text-foreground [&_a]:hover:text-accent" />
              </div>
            </motion.div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-secondary rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center min-h-[400px]">
                <MapPin className="h-16 w-16 text-accent mb-6" />
                <h3 className="font-heading text-2xl font-bold text-foreground mb-3">
                  Serving All of Calgary
                </h3>
                <p className="text-muted-foreground max-w-md mb-2">
                  Calgary, Okotoks, Chestermere, Drumheller, Bearspaw, and all communities within 1 hour of Calgary.
                </p>
                <p className="text-sm text-muted-foreground/70 mt-4">
                  Interactive Google Map coming soon
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
