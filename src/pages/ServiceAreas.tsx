import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import calgaryHomes from "@/assets/calgary-homes.jpg";

const allAreas = {
  "Central Calgary": [
    "Beltline",
    "Bridgeland",
    "Chinatown",
    "Cliff Bungalow",
    "Connaught",
    "Downtown Commercial Core",
    "Downtown East Village",
    "Downtown West End",
    "Eau Claire",
    "Erlton",
    "Inglewood",
    "Mission",
    "Ramsay",
    "Sunalta",
    "Victoria Park",
  ],
  "Northwest Calgary": [
    "Arbour Lake",
    "Bowness",
    "Brentwood",
    "Cambrian Heights",
    "Charleswood",
    "Citadel",
    "Collingwood",
    "Cougar Ridge",
    "Crestmont",
    "Dalhousie",
    "Edgemont",
    "Evanston",
    "Greenview",
    "Hamptons",
    "Hawkwood",
    "Hillhurst",
    "Kensington",
    "Nolan Hill",
    "Panorama Hills",
    "Parkdale",
    "Point McKay",
    "Ranchlands",
    "Rocky Ridge",
    "Royal Oak",
    "Sage Hill",
    "Scenic Acres",
    "Sherwood",
    "Silver Springs",
    "St. Andrews Heights",
    "Tuscany",
    "University District",
    "University Heights",
    "Varsity",
    "West Hillhurst",
  ],
  "Northeast Calgary": [
    "Abbeydale",
    "Albert Park",
    "Bridgeland",
    "Castleridge",
    "Cityscape",
    "Coral Springs",
    "Cornerstone",
    "Coventry Hills",
    "Falconridge",
    "Greenview Industrial",
    "Harvest Hills",
    "Highland Park",
    "Huntington Hills",
    "Livingston",
    "Marlborough",
    "Marlborough Park",
    "Martindale",
    "Mayland Heights",
    "Monterey Park",
    "Pineridge",
    "Renfrew",
    "Rundle",
    "Saddle Ridge",
    "Sandstone Valley",
    "Skyview Ranch",
    "Taradale",
    "Temple",
    "Vista Heights",
    "Whitehorn",
  ],
  "Southwest Calgary": [
    "Altadore",
    "Aspen Woods",
    "Bankview",
    "Bayview",
    "Braeside",
    "Britannia",
    "Canyon Meadows",
    "Cedarbrae",
    "CFB Currie",
    "Christie Park",
    "Coach Hill",
    "Discovery Ridge",
    "Eagle Ridge",
    "Elbow Park",
    "Elboya",
    "Garrison Woods",
    "Glamorgan",
    "Glenbrook",
    "Glendale",
    "Haysboro",
    "Kelvin Grove",
    "Killarney",
    "Kingsland",
    "Lakeview",
    "Lincoln Park",
    "Lower Mount Royal",
    "Marda Loop",
    "Mayfair",
    "Meadowlark Park",
    "Mount Royal",
    "North Glenmore Park",
    "Oakridge",
    "Palliser",
    "Patterson",
    "Pump Hill",
    "Richmond",
    "Rideau Park",
    "Rosscarrock",
    "Rutland Park",
    "Scarboro",
    "Shaganappi",
    "Signal Hill",
    "South Calgary",
    "Southwood",
    "Springbank Hill",
    "Spruce Cliff",
    "Strathcona Park",
    "Upper Mount Royal",
    "West Springs",
    "Westgate",
    "Wildwood",
    "Windsor Park",
    "Woodbine",
    "Woodlands",
  ],
  "Southeast Calgary": [
    "Acadia",
    "Auburn Bay",
    "Bonavista Downs",
    "Bridlewood",
    "Chaparral",
    "Copperfield",
    "Cranston",
    "Deer Ridge",
    "Deer Run",
    "Diamond Cove",
    "Douglasdale",
    "Dover",
    "Erin Woods",
    "Fairview",
    "Forest Heights",
    "Forest Lawn",
    "Inglewood",
    "Lake Bonavista",
    "Legacy",
    "Mahogany",
    "Maple Ridge",
    "McKenzie Lake",
    "McKenzie Towne",
    "Midnapore",
    "Millrise",
    "New Brighton",
    "Ogden",
    "Parkland",
    "Queensland",
    "Quarry Park",
    "Riverbend",
    "Seton",
    "Shawnee Slopes",
    "Shawnessy",
    "Shepard Industrial",
    "Silverado",
    "Somerset",
    "Southview",
    "Sundance",
    "Walden",
    "Willow Park",
  ],
  "Surrounding Communities": [
    "Airdrie",
    "Balzac",
    "Bearspaw",
    "Black Diamond",
    "Bragg Creek",
    "Chestermere",
    "Cochrane",
    "Crossfield",
    "De Winton",
    "High River",
    "Irricana",
    "Langdon",
    "Okotoks",
    "Priddis",
    "Springbank",
    "Strathmore",
    "Turner Valley",
  ],
};

const ServiceAreas = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${calgaryHomes})` }}
        >
          <div className="absolute inset-0 bg-charcoal/90" />
        </div>

        <div className="relative container-max section-padding !py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
              Service Areas
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Serving Calgary & All Surrounding Communities
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
              From downtown high-rises to suburban homes, Duckbill Roofing provides 
              expert roofing services across the entire Calgary metropolitan area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/estimate">
                <Button variant="cta" size="lg">
                  GET AN INSTANT ESTIMATE
                </Button>
              </Link>
              <a href="tel:+14032006621">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
                >
                  <Phone className="h-4 w-4" />
                  (403) 200-6621
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Your Neighborhood
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We service over 200 communities in Calgary and the surrounding areas. 
              Find your neighborhood below.
            </p>
          </motion.div>

          <div className="space-y-12">
            {Object.entries(allAreas).map(([region, areas], regionIndex) => (
              <motion.div
                key={region}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: regionIndex * 0.1 }}
                className="bg-secondary rounded-2xl p-8"
              >
                <h3 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-accent" />
                  {region}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {areas.map((area) => (
                    <div
                      key={area}
                      className="bg-card rounded-lg px-4 py-2.5 text-sm text-foreground text-center hover:bg-accent/10 transition-colors border border-border"
                    >
                      {area}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
              Don't See Your Area?
            </h2>
            <p className="text-accent-foreground/90 text-lg max-w-2xl mx-auto mb-8">
              Contact us anyway! We regularly travel to serve customers across Alberta 
              for larger projects.
            </p>
            <Link to="/estimate">
              <Button
                size="xl"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group"
              >
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
