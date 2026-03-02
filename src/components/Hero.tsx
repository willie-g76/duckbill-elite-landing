import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CloudLightning, Wind, CloudRain, CloudSnow, Thermometer, Search, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-roofing.jpg";
import redSealBadge from "@/assets/red-seal-badge.png";
import { supabase } from "@/integrations/supabase/client";
import hailHistory, { getHailHistory, defaultHailInfo, type HailEvent } from "@/data/hailHistory";

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  wind_speed: number;
  rain: number;
  snow: number;
}

const Hero = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [showWeather, setShowWeather] = useState(false);
  const [showHail, setShowHail] = useState(false);
  const [hailSearch, setHailSearch] = useState("");
  const location = useLocation();

  // Get unique hail events for the searchable list
  const allHailEvents = useMemo(() => {
    const seen = new Set<string>();
    return Object.values(hailHistory).filter((event) => {
      if (seen.has(event.community)) return false;
      seen.add(event.community);
      return true;
    }).sort((a, b) => a.community.localeCompare(b.community));
  }, []);

  const filteredHailEvents = useMemo(() => {
    if (!hailSearch.trim()) return allHailEvents;
    const q = hailSearch.toLowerCase();
    return allHailEvents.filter(
      (e) => e.community.toLowerCase().includes(q) || e.date.toLowerCase().includes(q)
    );
  }, [hailSearch, allHailEvents]);

  const getCommunitySlug = () => {
    const match = location.pathname.match(/\/service-areas\/([^/]+)/);
    return match ? match[1] : null;
  };

  const communitySlug = getCommunitySlug();
  const hailData = communitySlug ? getHailHistory(communitySlug) : defaultHailInfo;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-weather");
        if (error) throw error;
        setWeather(data);
      } catch (e) {
        console.error("Failed to fetch weather:", e);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center -mt-20 pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative container-max section-padding">
        <div className="max-w-3xl">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            Protecting Calgary Homes
            <span className="block text-accent">From Alberta's Climate</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-2xl leading-relaxed"
          >
            Expert roofing and waterproofing solutions backed by a Red Seal certified craftsman. From hailstorms to heavy
            snow, trust Duckbill to keep your home safe and dry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/estimate">
              <Button variant="cta" size="xl" className="w-full sm:w-auto">
                GET FREE ESTIMATE
              </Button>
            </Link>
            <a href="tel:+15874323639">
              <Button
                variant="ctaOutline"
                size="xl"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                CALL NOW
              </Button>
            </a>
          </motion.div>

          {/* Red Seal Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex items-center gap-4"
          >
            <img
              src={redSealBadge}
              alt="Interprovincial Standard Canada Red Seal"
              className="h-16 w-16 object-contain"
            />
            <div>
              <p className="text-sm font-semibold text-primary-foreground">Red Seal Certified</p>
              <p className="text-xs text-primary-foreground/70">Interprovincial Standard</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent rounded-full"
          />
        </div>
      </motion.div>

      {/* Weather Dialog */}
      <Dialog open={showWeather} onOpenChange={setShowWeather}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-accent" />
              Calgary Live Weather
            </DialogTitle>
            <DialogDescription>Current conditions in Calgary, AB</DialogDescription>
          </DialogHeader>
          {weather ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="h-16 w-16"
                />
                <div>
                  <p className="text-3xl font-bold font-heading">{weather.temp}°C</p>
                  <p className="text-muted-foreground capitalize">{weather.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Feels Like</p>
                  <p className="font-semibold">{weather.feels_like}°C</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Wind className="h-3 w-3" /> Wind
                  </div>
                  <p className="font-semibold">{weather.wind_speed} km/h</p>
                </div>
                {weather.rain > 0 && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CloudRain className="h-3 w-3" /> Rain
                    </div>
                    <p className="font-semibold">{weather.rain} mm</p>
                  </div>
                )}
                {weather.snow > 0 && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CloudSnow className="h-3 w-3" /> Snow
                    </div>
                    <p className="font-semibold">{weather.snow} mm</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-4">Loading weather data...</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Hail History Dialog */}
      <Dialog open={showHail} onOpenChange={setShowHail}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <CloudLightning className="h-5 w-5 text-accent" />
              Calgary Hail History
            </DialogTitle>
            <DialogDescription>Search historical hail events by community or year</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search community or year..."
              value={hailSearch}
              onChange={(e) => setHailSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="overflow-y-auto flex-1 space-y-2 pr-1 -mr-1">
            {filteredHailEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No matching events found.</p>
            ) : (
              filteredHailEvents.map((event) => (
                <div key={event.community} className="bg-muted rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{event.community}</p>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <p className="text-xs font-medium text-destructive">Max: {event.maxHailSize}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
              ))
            )}
          </div>
          <Link to="/estimate" onClick={() => setShowHail(false)} className="block mt-2">
            <Button variant="cta" className="w-full">
              Get a Free Hail Damage Estimate
            </Button>
          </Link>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
