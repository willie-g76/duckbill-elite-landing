import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wind, CloudRain, CloudSnow, CloudLightning, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getHailHistory, defaultHailInfo } from "@/data/hailHistory";
import logoFull from "@/assets/logo-full.png";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  icon: string;
  wind_speed: number;
  rain: number;
  snow: number;
}

const DynamicHeader = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Extract community slug from URL
  const getCommunitySlug = () => {
    const match = location.pathname.match(/\/service-areas\/([^/]+)/);
    return match ? match[1] : null;
  };

  const communitySlug = getCommunitySlug();
  const hailData = communitySlug ? getHailHistory(communitySlug) : defaultHailInfo;

  const isStormAlert =
    weather &&
    (weather.description.toLowerCase().includes("thunderstorm") ||
      weather.description.toLowerCase().includes("hail"));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const getWeatherAlert = () => {
    if (!weather) return null;
    if (weather.snow > 0)
      return { icon: <CloudSnow className="h-4 w-4" />, label: `Snow: ${weather.snow}mm` };
    if (weather.rain > 0)
      return { icon: <CloudRain className="h-4 w-4" />, label: `Rain: ${weather.rain}mm` };
    if (weather.wind_speed > 40)
      return { icon: <Wind className="h-4 w-4" />, label: `Wind: ${weather.wind_speed}km/h` };
    return null;
  };

  const alert = getWeatherAlert();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isStormAlert
          ? "bg-destructive/95 backdrop-blur-md shadow-strong"
          : isScrolled
          ? "bg-primary/95 backdrop-blur-md shadow-strong"
          : "bg-primary"
      }`}
    >
      {/* Storm Warning Banner */}
      <AnimatePresence>
        {isStormAlert && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-destructive text-destructive-foreground overflow-hidden"
          >
            <div className="container-max px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <AlertTriangle className="h-4 w-4" />
              </motion.div>
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="font-heading font-bold text-sm tracking-wider"
              >
                LIVE STORM WARNING
              </motion.span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <CloudLightning className="h-4 w-4" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-max px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img
              src={logoFull}
              alt="Duckbill Roofing & Waterproofing"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
            />
            <div className="hidden xs:block">
              <span className="font-heading font-bold text-primary-foreground tracking-wide text-lg sm:text-xl leading-tight">
                DUCKBILL
              </span>
              <span className="block text-primary-foreground/70 font-medium tracking-widest text-[10px] sm:text-xs leading-tight">
                ROOFING + WATERPROOFING
              </span>
            </div>
          </Link>

          {/* Desktop: Weather + Hail History */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Live Weather */}
            {weather && (
              <div className="flex items-center gap-2 text-primary-foreground/90 text-sm">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                  alt={weather.description}
                  className="h-8 w-8"
                />
                <span className="font-semibold">{weather.temp}°C</span>
                <span className="text-primary-foreground/60 capitalize hidden lg:inline">
                  {weather.description}
                </span>
                <div className="flex items-center gap-1 text-primary-foreground/60">
                  <Wind className="h-3.5 w-3.5" />
                  <span>{weather.wind_speed}km/h</span>
                </div>
                {alert && (
                  <div className="flex items-center gap-1 text-accent font-medium">
                    {alert.icon}
                    <span>{alert.label}</span>
                  </div>
                )}
              </div>
            )}

            {/* Hail History Divider */}
            <div className="w-px h-8 bg-primary-foreground/20" />

            {/* Hail History */}
            {hailData && (
              <div className="flex items-center gap-2 text-sm">
                <CloudLightning className="h-4 w-4 text-accent shrink-0" />
                <div className="text-primary-foreground/80 leading-tight">
                  <span className="font-semibold text-primary-foreground">
                    {communitySlug ? `${hailData.community} Risk` : "Local Risk"}:
                  </span>{" "}
                  <span className="hidden xl:inline">
                    {hailData.maxHailSize} recorded on {hailData.date}
                  </span>
                  <span className="xl:hidden">{hailData.maxHailSize}</span>
                </div>
              </div>
            )}
          </div>

          {/* Call Now Button */}
          <a
            href="tel:+15874323639"
            className="flex items-center gap-2 bg-accent text-accent-foreground font-heading font-bold text-sm px-4 py-2 rounded-md hover:bg-accent/90 transition-all shrink-0"
          >
            CALL NOW
          </a>
        </div>

        {/* Mobile: Weather + Hail Row */}
        <div className="md:hidden flex items-center justify-center gap-3 text-primary-foreground/80 text-xs pb-2 flex-wrap">
          {weather && (
            <>
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                alt={weather.description}
                className="h-6 w-6"
              />
              <span className="font-semibold">{weather.temp}°C</span>
              <span className="capitalize">{weather.description}</span>
              {alert && (
                <span className="text-accent font-medium flex items-center gap-1">
                  {alert.icon}
                  {alert.label}
                </span>
              )}
            </>
          )}
          {hailData && (
            <>
              <span className="w-px h-4 bg-primary-foreground/30" />
              <span className="flex items-center gap-1">
                <CloudLightning className="h-3 w-3 text-accent" />
                <span className="font-semibold">{hailData.maxHailSize}</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicHeader;
