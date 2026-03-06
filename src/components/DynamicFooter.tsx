import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useMemo } from "react";
import logoFull from "@/assets/logo-full.png";
import SocialLinks from "@/components/SocialLinks";
import { getPublishedNeighbourhoods } from "@/data/neighbourhoods";

const communities = getPublishedNeighbourhoods().map((n) => ({ name: n.name, slug: n.slug }));

const DynamicFooter = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const detectedCommunity = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    // Look for community in path like /services/varsity or /service-areas/varsity
    const lastSegment = parts[parts.length - 1];
    if (!lastSegment) return null;
    const match = communities.find((c) => c.slug === lastSegment);
    if (match) return match.name;
    // Try to prettify slug
    const pretty = lastSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    // Only return if it looks like a community name (not a generic page)
    const genericPages = ["services", "service-areas", "about", "contact", "faq", "booking", "estimate", "privacy", "terms"];
    if (genericPages.includes(lastSegment)) return null;
    return pretty;
  }, [location.pathname]);

  const mapCommunity = detectedCommunity
    ? `${detectedCommunity}, Calgary, AB`
    : "Calgary, AB";

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapSrc = mapsApiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(mapCommunity)}&zoom=13&size=400x200&scale=2&maptype=roadmap&markers=color:red%7C${encodeURIComponent(mapCommunity)}&key=${mapsApiKey}`
    : "";

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Service Areas", href: "/service-areas" },
    { name: "Hail FAQ", href: "/faq" },
    { name: "Free Estimate", href: "/estimate" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-max section-padding !pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
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
            <div className="flex flex-col gap-3 mb-6">
              <a
                href="tel:+15874323639"
                className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4 text-accent" />
                (587) 432-3639
              </a>
              <a
                href="mailto:info@duckbillroofing.com"
                className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 text-accent" />
                info@duckbillroofing.com
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-accent mt-0.5" />
                <span>Calgary, Alberta & Surrounding Areas</span>
              </div>
            </div>
            <SocialLinks />
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

          {/* Community Links for SEO */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Calgary Communities</h4>
            <ul className="space-y-3">
              {communities.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/service-areas/${c.slug}`}
                    className={`text-sm transition-colors ${
                      detectedCommunity === c.name
                        ? "text-accent font-semibold"
                        : "text-primary-foreground/80 hover:text-accent"
                    }`}
                  >
                    Roofing in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">
              {detectedCommunity ? `Serving ${detectedCommunity}` : "Serving Calgary"}
            </h4>
            {mapSrc && (
              <div className="rounded-lg overflow-hidden border border-primary-foreground/20">
                <img
                  src={mapSrc}
                  alt={`Map of ${mapCommunity}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <p className="text-xs text-primary-foreground/50 mt-2">
              {detectedCommunity
                ? `Duckbill Roofing proudly serves ${detectedCommunity} and surrounding areas.`
                : "Serving all of Calgary and surrounding communities."}
            </p>
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

export default DynamicFooter;
