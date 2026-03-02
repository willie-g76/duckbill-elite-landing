import { motion } from "framer-motion";
import { Shield, Award, Users, ThumbsUp } from "lucide-react";
import redSealBadge from "@/assets/red-seal-badge.png";

const TrustSection = () => {
  const trustItems = [
    {
      icon: Shield,
      title: "BBB A Rating",
      description: "Accredited business with excellent standing",
    },
    {
      icon: Award,
      title: "5-Year Warranty",
      description: "Comprehensive workmanship guarantee",
    },
    {
      icon: Users,
      title: "Combined 30 Years Experience",
      description: "Seasoned experts protecting Calgary homes",
    },
    {
      icon: ThumbsUp,
      title: "100% Satisfaction",
      description: "We don't stop until you're happy",
    },
  ];

  return (
    <section className="bg-secondary section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Calgary Homeowners Trust Duckbill
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            With over a decade of experience protecting homes from Alberta's harsh weather, 
            we've built a reputation for quality and reliability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 text-center shadow-soft card-hover"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 rounded-full mb-4">
                <item.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Red Seal Certification Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-card rounded-2xl p-8 shadow-soft flex flex-col md:flex-row items-center gap-6"
        >
          <img
            src={redSealBadge}
            alt="Red Seal Certification"
            className="h-24 w-24 object-contain"
          />
          <div className="text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
              Our Team
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              Led by a Red Seal certified journeyman—Canada's highest recognition for
              skilled trades—our team delivers quality workmanship that meets
              the strictest national standards for quality and safety.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
