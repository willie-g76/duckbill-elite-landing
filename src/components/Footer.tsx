import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Residential Roofing", href: "/services#residential" },
    { name: "Flat Roof Waterproofing", href: "/services#waterproofing" },
    { name: "Roof Repairs", href: "/services#repairs" },
    { name: "Roof Inspections", href: "/services#inspections" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Service Areas", href: "/service-areas" },
    { name: "Free Estimate", href: "/estimate" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-max section-padding !pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img
                src={logoFull}
                alt="Duckbill Roofing"
                className="h-16 w-16 object-contain rounded-full bg-primary-foreground/10"
              />
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Calgary's trusted roofing experts. Protecting your home from Alberta's harsh climate with quality
              craftsmanship and a 5-year workmanship warranty.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+14035551234"
                className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4 text-accent" />
                (403) 555-1234
              </a>
              <a
                href="mailto:info@duckbillroofing.ca"
                className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 text-accent" />
                info@duckbillroofing.ca
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-accent mt-0.5" />
                <span>Calgary, Alberta & Surrounding Areas</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Badges */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Trusted & Certified</h4>
            <div className="space-y-4">
              <div className="bg-primary-foreground/10 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-heading font-bold text-accent-foreground">
                    A
                  </div>
                  <div>
                    <p className="text-sm font-semibold">BBB A Rating</p>
                    <p className="text-xs text-primary-foreground/60">Better Business Bureau</p>
                  </div>
                </div>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <span className="font-heading font-bold text-accent-foreground text-sm">5Y</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">5-Year Warranty</p>
                    <p className="text-xs text-primary-foreground/60">Workmanship Guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {currentYear} Duckbill Roofing & Waterproofing. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
