import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ArrowRight, Shield, Award, Clock, CheckCircle } from "lucide-react";
import ContactOptions from "@/components/ContactOptions";
import calgaryHomes from "@/assets/calgary-homes.jpg";

interface AreaData {
  name: string;
  slug: string;
  description: string;
  highlights: string[];
}

const areaData: Record<string, AreaData> = {
  calgary: {
    name: "Calgary",
    slug: "calgary",
    description:
      "As Calgary's trusted roofing experts, we provide comprehensive roofing services across every neighbourhood in the city. From downtown condos to suburban homes, our Red Seal certified team delivers quality workmanship backed by our 5-year warranty.",
    highlights: [
      "Serving all Calgary neighbourhoods from NW to SE",
      "24/7 emergency storm damage response",
      "Insurance claim specialists for hail damage",
      "Free on-site inspections and estimates",
    ],
  },
  okotoks: {
    name: "Okotoks",
    slug: "okotoks",
    description:
      "Duckbill Roofing proudly serves Okotoks homeowners with expert roofing installations, repairs, and waterproofing solutions. Located just south of Calgary, Okotoks properties face the same challenging Alberta weather and deserve the same quality protection.",
    highlights: [
      "Serving all Okotoks neighbourhoods and rural properties",
      "Experienced with Okotoks-area building codes",
      "Quick response times from our Calgary base",
      "Hail damage repair and insurance claim support",
    ],
  },
  chestermere: {
    name: "Chestermere",
    slug: "chestermere",
    description:
      "Chestermere homes face unique challenges with lakeside weather exposure. Our team provides specialized roofing solutions designed to protect your home from wind, hail, and moisture — the trifecta of Alberta roof threats.",
    highlights: [
      "Wind-resistant roofing systems for lakeside homes",
      "Waterproofing solutions for increased moisture exposure",
      "Serving Chestermere, Kinniburgh, and surrounding areas",
      "Fast emergency response from Calgary",
    ],
  },
  drumheller: {
    name: "Drumheller",
    slug: "drumheller",
    description:
      "Even in the heart of the Badlands, your roof deserves top-quality protection. Duckbill Roofing serves Drumheller and the surrounding valley communities with the same Red Seal certified craftsmanship we bring to every job.",
    highlights: [
      "Serving Drumheller and surrounding valley communities",
      "Materials rated for extreme temperature swings",
      "Full insurance claim support for storm damage",
      "Comprehensive inspections and free estimates",
    ],
  },
  bearspaw: {
    name: "Bearspaw",
    slug: "bearspaw",
    description:
      "Bearspaw's acreages and estate homes demand premium roofing solutions. Our team specializes in large-scale residential projects and custom roofing systems designed for the unique needs of rural properties northwest of Calgary.",
    highlights: [
      "Experienced with large acreage and estate roofing",
      "Custom solutions for unique architectural designs",
      "Metal roofing and premium shingle options",
      "Close proximity for fast service from Calgary",
    ],
  },
};

const ServiceAreaLanding = () => {
  const { areaSlug } = useParams<{ areaSlug: string }>();
  const area = areaData[areaSlug || ""];

  if (!area) {
    return (
      <Layout>
        <section className="pt-32 pb-16 section-padding">
          <div className="container-max text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">Area Not Found</h1>
            <p className="text-muted-foreground mb-8">Sorry, we couldn't find information about this service area.</p>
            <Link to="/service-areas">
              <Button variant="cta" size="lg">View All Service Areas</Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const services = [
    { title: "Residential Roofing", desc: "Complete roof installations using premium, impact-resistant materials." },
    { title: "Flat Roof Waterproofing", desc: "Specialized membrane and coating systems for flat and low-slope roofs." },
    { title: "Roof Repairs", desc: "Fast, reliable repairs for leaks, storm damage, and general wear." },
    { title: "Roof Inspections", desc: "Thorough inspections with detailed reports for insurance claims." },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${calgaryHomes})` }}>
          <div className="absolute inset-0 bg-charcoal/90" />
        </div>
        <div className="relative container-max section-padding !py-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
              {area.name} Roofing Services
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Expert Roofing in {area.name}
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
              {area.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/estimate">
                <Button variant="cta" size="lg">GET ESTIMATE</Button>
              </Link>
              <a href="tel:+14032006621">
                <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  <Phone className="h-4 w-4" />
                  (403) 200-6621
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Us for this area */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why {area.name} Homeowners Choose Duckbill
              </h2>
              <div className="space-y-4 mb-8">
                {area.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{h}</p>
                  </div>
                ))}
              </div>
              <ContactOptions />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="bg-secondary rounded-2xl p-8 space-y-6">
                {[
                  { icon: Shield, label: "BBB A Rating", desc: "Accredited business with excellent standing" },
                  { icon: Award, label: "5-Year Warranty", desc: "Comprehensive workmanship guarantee" },
                  { icon: Clock, label: "24/7 Emergency", desc: "Always here when storms hit" },
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

      {/* Services */}
      <section className="section-padding bg-secondary">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services in {area.name}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-soft"
              >
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="container-max text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
              Get a Free Roofing Quote in {area.name}
            </h2>
            <p className="text-accent-foreground/90 text-lg max-w-2xl mx-auto mb-8">
              Contact us today for a free, no-obligation estimate on your roofing project.
            </p>
            <Link to="/estimate">
              <Button size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                GET ESTIMATE
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RoofingContractor",
            name: `Duckbill Roofing - ${area.name}`,
            url: `https://duckbill-elite-landing.lovable.app/service-areas/${area.slug}`,
            telephone: "+14032006621",
            email: "info@duckbillroofing.com",
            areaServed: { "@type": "City", name: area.name },
            address: { "@type": "PostalAddress", addressLocality: "Calgary", addressRegion: "AB", addressCountry: "CA" },
          }),
        }}
      />
    </Layout>
  );
};

export default ServiceAreaLanding;
