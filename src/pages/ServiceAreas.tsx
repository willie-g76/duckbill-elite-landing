import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import calgaryHomes from "@/assets/calgary-homes.jpg";
import { getPublishedNeighbourhoods } from "@/data/neighbourhoods";

const serviceAreas = [
  { name: "Calgary", slug: "calgary", desc: "All neighbourhoods across the city" },
  { name: "Okotoks", slug: "okotoks", desc: "South of Calgary" },
  { name: "Chestermere", slug: "chestermere", desc: "East of Calgary, lakeside community" },
  { name: "Drumheller", slug: "drumheller", desc: "Northeast, in the Badlands" },
  { name: "Bearspaw", slug: "bearspaw", desc: "Northwest of Calgary, acreages & estates" },
  { name: "Airdrie", slug: "airdrie", desc: "North of Calgary" },
  { name: "Cochrane", slug: "cochrane", desc: "West of Calgary" },
  { name: "High River", slug: "high-river", desc: "South of Okotoks" },
  { name: "Strathmore", slug: "strathmore", desc: "East of Calgary" },
  { name: "Langdon", slug: "langdon", desc: "Southeast of Calgary" },
  { name: "Black Diamond", slug: "black-diamond", desc: "Southwest of Calgary" },
  { name: "Crossfield", slug: "crossfield", desc: "North of Airdrie" },
];

const ServiceAreas = () => {
  return (
    <Layout>
      <Helmet>
        <title>Service Areas | Calgary &amp; Surrounding Communities | Duckbill Roofing</title>
        <meta name="description" content="Duckbill Roofing serves Calgary, Airdrie, Okotoks, Cochrane, Chestermere, and surrounding communities. Find your neighbourhood for local roofing services." />
        <link rel="canonical" href="https://duckbillroofing.ca/service-areas" />
      </Helmet>
      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${calgaryHomes})` }}>
          <div className="absolute inset-0 bg-charcoal/90" />
        </div>
        <div className="relative container-max section-padding !py-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
              Service Areas
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Serving Calgary & All Surrounding Communities
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
              Expert roofing services for every community within an hour of Calgary. 
              From downtown high-rises to rural acreages, Duckbill has you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/estimate">
                <Button variant="cta" size="lg">GET ESTIMATE</Button>
              </Link>
              <a href="tel:+15874323639">
                <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  <Phone className="h-4 w-4" />
                  (587) 432-3639
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cities & Towns
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Click on any area to learn more about our services in your community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {serviceAreas.map((area, index) => (
              <motion.div
                key={area.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/service-areas/${area.slug}`}
                  className="block bg-card rounded-xl p-6 shadow-soft border border-border hover:border-accent/50 hover:shadow-strong transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                        {area.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{area.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calgary Neighbourhoods */}
      <section className="section-padding bg-secondary">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Calgary Neighbourhoods
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hyper-local roofing expertise for Calgary communities — hail damage repair, roof replacement, and more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getPublishedNeighbourhoods().map((area, index) => (
              <motion.div
                key={area.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/service-areas/${area.slug}`}
                  className="block bg-card rounded-xl p-6 shadow-soft border border-border hover:border-accent/50 hover:shadow-strong transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                        {area.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{area.quadrant} Calgary</p>
                    </div>
                  </div>
                </Link>
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
              Don't See Your Area?
            </h2>
            <p className="text-accent-foreground/90 text-lg max-w-2xl mx-auto mb-8">
              Contact us! We serve all communities within an hour of Calgary.
            </p>
            <Link to="/estimate">
              <Button size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                Request a Quote
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceAreas;
