import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getNeighbourhoodBySlug } from "@/data/neighbourhoods";
import WeatherForecastPopover from "@/components/WeatherForecastPopover";
import logoFull from "@/assets/logo-full.png";

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  wind_speed: number;
  rain: number;
  snow: number;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const location = useLocation();

  const community = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "service-areas" && parts[1]) {
      return getNeighbourhoodBySlug(parts[1]) || null;
    }
    return null;
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const qs = community
          ? `?lat=${community.lat}&lon=${community.lng}`
          : "";
        const res = await fetch(
          `${supabaseUrl}/functions/v1/get-weather${qs}`,
          { headers: { Authorization: `Bearer ${anonKey}`, apikey: anonKey } }
        );
        if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
        setWeather(await res.json());
      } catch (e) {
        console.error("Failed to fetch weather:", e);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [community]);
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/service-areas", label: "Service Areas" },
    { href: "/faq", label: "Hail FAQ" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/estimate", label: "Free Estimate" },
  ];
  const isActive = (path: string) => location.pathname === path;
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-card/95 backdrop-blur-md shadow-soft" : "bg-card/90 backdrop-blur-sm"}`}
    >
      <div className="flex items-center h-20">
          {/* Weather Widget — far left, flush to edge */}
          {weather && (
            <WeatherForecastPopover
              weather={weather}
              communityName={community?.name}
              communityLat={community?.lat}
              communityLng={community?.lng}
            />
          )}

        <div className="flex-1 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoFull} alt="Duckbill Roofing & Waterproofing" className="h-14 w-14 object-contain" />
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-foreground tracking-wide mx-0 text-2xl">DUCKBILL</span>
              <span className="block text-muted-foreground font-medium tracking-widest text-sm">
                ROOFING + WATERPROOFING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${isActive(link.href) ? "text-accent" : "text-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <a href="tel:+15874323639">
              <Button variant="cta" size="lg">
                CALL NOW
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="lg:hidden bg-card border-t border-border"
          >
            <nav className="container-max section-padding !py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium py-2 transition-colors ${isActive(link.href) ? "text-accent" : "text-foreground"}`}
                >
                  {link.label}
                </Link>
              ))}
              <a href="tel:+15874323639" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="cta" size="lg" className="w-full mt-2">
                  CALL NOW
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Header;
