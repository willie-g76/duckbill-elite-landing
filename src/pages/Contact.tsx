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
                        <title>Contact Duckbill Roofing | Call (587) 432-3639 | Calgary Roofers</title>title>
                        <meta name="description" content="Get in touch with Duckbill Roofing. Call, text, WhatsApp, or email us for roofing services in Calgary and surrounding areas. 24/7 emergency response." />
                        <link rel="canonical" href="https://duckbillroofing.ca/contact" />
                </Helmet>Helmet>
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
                                              </span>span>
                                              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                                                            Contact Duckbill Roofing
                                              </h1>h1>
                                              <p className="text-muted-foreground text-lg leading-relaxed">
                                                            Call, text, WhatsApp, or email us. We're here to help with all your roofing needs.
                                              </p>p>
                                                          </motion.div>motion.div>
                        </div>div>
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
                  </h2>h2>
                                                                    <ContactOptions />
                                                    </div>div>
                                                    <div className="space-y-6">
                                                                    <a href="tel:+15874323639" className="flex items-center gap-4 group">
                                                                                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                                                                                          <Phone className="h-5 w-5 text-accent" />
                                                                                        </div>div>
                                                                                      <div>
                                                                                                          <p className="font-semibold text-foreground group-hover:text-accent transition-colors">(587) 432-3639</p>p>
                                                                                                          <p className="text-sm text-muted-foreground">Call or text anytime</p>p>
                                                                                        </div>div>
                                                                    </a>a>
                                                                    <a href="mailto:info@duckbillroofing.com" className="flex items-center gap-4 group">
                                                                                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                                                                                          <Mail className="h-5 w-5 text-accent" />
                                                                                        </div>div>
                                                                                      <div>
                                                                                                          <p className="font-semibold text-foreground group-hover:text-accent transition-colors">info@duckbillroofing.com</p>p>
                                                                                                          <p className="text-sm text-muted-foreground">Email us anytime</p>p>
                                                                                        </div>div>
                                                                    </a>a>
                                                                    <div className="flex items-center gap-4">
                                                                                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                                                                                          <MapPin className="h-5 w-5 text-accent" />
                                                                                        </div>div>
                                                                                      <div>
                                                                                                          <p className="font-semibold text-foreground">Calgary, Alberta</p>p>
                                                                                                          <p className="text-sm text-muted-foreground">Serving Calgary & surrounding areas within 1 hour</p>p>
                                                                                        </div>div>
                                                                    </div>div>
                                                                    <div className="flex items-center gap-4">
                                                                                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                                                                                          <Clock className="h-5 w-5 text-accent" />
                                                                                        </div>div>
                                                                                      <div>
                                                                                                          <p className="font-semibold text-foreground">Business Hours</p>p>
                                                                                                          <p className="text-sm text-muted-foreground">Mon–Sat: 7:00 AM – 7:00 PM</p>p>
                                                                                                          <p className="text-sm text-muted-foreground">24/7 Emergency Service Available</p>p>
                                                                                        </div>div>
                                                                    </div>div>
                                                    </div>div>
                                                    <div>
                                                                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">Follow Us</h3>h3>
                                                                    <SocialLinks className="[&_a]:bg-accent/10 [&_a]:text-foreground [&_a]:hover:text-accent" />
                                                    </div>div>
                                      </motion.div>motion.div>
                            {/* Google Map */}
                                      <motion.div
                                                      initial={{ opacity: 0, y: 30 }}
                                                      animate={{ opacity: 1, y: 0 }}
                                                      transition={{ duration: 0.6, delay: 0.2 }}
                                                    >
                                                    <div className="rounded-2xl overflow-hidden h-full min-h-[400px] shadow-soft">
                                                                    <iframe
                                                                                        title="Duckbill Roofing Location"
                                                                                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=100+Rivercrest+Close+SE,+Calgary,+AB"
                                                                                        width="100%"
                                                                                        height="100%"
                                                                                        style={{ border: 0, minHeight: "400px" }}
                                                                                        allowFullScreen
                                                                                        loading="lazy"
                                                                                        referrerPolicy="no-referrer-when-downgrade"
                                                                                      />
                                                    </div>div>
                                      </motion.div>motion.div>
                          </div>div>
                        </div>div>
                </section>section>
          </Layout>Layout>
        );
};

export default Contact;</Layout>
