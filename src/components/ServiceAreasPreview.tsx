import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import calgaryHomes from "@/assets/calgary-homes.jpg";

const calgaryAreas = [
  "Altadore",
  "Aspen Woods",
  "Auburn Bay",
  "Bankview",
  "Beltline",
  "Bowness",
  "Bridgeland",
  "Bridlewood",
  "Chaparral",
  "Cochrane",
  "Copperfield",
  "Cougar Ridge",
  "Cranston",
  "Currie",
  "Dalhousie",
  "Deer Run",
  "Evanston",
  "Evergreen",
  "Garrison Woods",
  "Hillhurst",
  "Inglewood",
  "Kensington",
  "Killarney",
  "Lake Bonavista",
  "Lakeview",
  "Legacy",
  "Mackenzie Towne",
  "Mahogany",
  "Marda Loop",
  "McKenzie Lake",
  "Mission",
  "Mount Royal",
  "New Brighton",
  "Nolan Hill",
  "Panorama Hills",
  "Parkdale",
  "Ramsay",
  "Richmond",
  "Riverbend",
  "Rocky Ridge",
  "Royal Oak",
  "Sage Hill",
  "Scenic Acres",
  "Seton",
  "Shaganappi",
  "Signal Hill",
  "Silver Springs",
  "Springbank Hill",
  "Sundance",
  "Tuscany",
  "University District",
  "Varsity",
  "West Springs",
  "Willow Park",
  "Woodbine",
];

const ServiceAreasPreview = () => {
  const displayedAreas = calgaryAreas.slice(0, 12);

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${calgaryHomes})` }}
      >
        <div className="absolute inset-0 bg-charcoal/90" />
      </div>

      <div className="relative container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
            Serving All of Calgary
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Your Neighborhood Roofing Experts
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            From Bridgeland to Mackenzie Towne, we proudly serve every community 
            in Calgary and the surrounding areas.
          </p>
        </motion.div>

        {/* Areas Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10"
        >
          {displayedAreas.map((area, index) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-4 py-3 text-center border border-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span className="text-sm font-medium text-primary-foreground">
                  {area}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-primary-foreground/70 mb-6">
            And {calgaryAreas.length - displayedAreas.length}+ more communities across Calgary & area
          </p>
          <Link to="/service-areas">
            <Button variant="cta" size="lg">
              View All Service Areas
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceAreasPreview;
export { calgaryAreas };
