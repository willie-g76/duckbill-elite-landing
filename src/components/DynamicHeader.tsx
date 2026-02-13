import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Wind, CloudRain, CloudSnow, Cloud } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

const DynamicHeader = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

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
    const interval = setInterval(fetchWeather, 15 * 60 * 1000); // refresh every 15 min
    return () => clearInterval(interval);
  }, []);

  const getWeatherAlert = () => {
    if (!weather) return null;
    if (weather.snow > 0) return { icon: <CloudSnow className="h-4 w-4" />, label: `Snow: ${weather.snow}mm` };
    if (weather.rain > 0) return { icon: <CloudRain className="h-4 w-4" />, label: `Rain: ${weather.rain}mm` };
    if (weather.wind_speed > 40) return { icon: <Wind className="h-4 w-4" />, label: `Wind: ${weather.wind_speed}km/h` };
    return null;
  };

  const alert = getWeatherAlert();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary/95 backdrop-blur-md shadow-strong" : "bg-primary"
      }`}
    >
      <div className="container-max px-4 sm:px-6 lg:px-8">
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

          {/* Weather */}
          {weather && (
            <div className="hidden md:flex items-center gap-3 text-primary-foreground/90 text-sm">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                alt={weather.description}
                className="h-8 w-8"
              />
              <div className="flex items-center gap-2">
                <span className="font-semibold">{weather.temp}°C</span>
                <span className="text-primary-foreground/60 capitalize hidden lg:inline">
                  {weather.description}
                </span>
              </div>
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

          {/* Phone */}
          <a
            href="tel:+14032006621"
            className="flex items-center gap-2 text-primary-foreground font-bold text-base sm:text-lg hover:text-accent transition-colors shrink-0"
          >
            <Phone className="h-5 w-5 text-accent" />
            <span className="hidden sm:inline">(403) 200-6621</span>
            <span className="sm:hidden text-sm">CALL</span>
          </a>
        </div>

        {/* Mobile weather bar */}
        {weather && (
          <div className="md:hidden flex items-center justify-center gap-3 text-primary-foreground/80 text-xs pb-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
              alt={weather.description}
              className="h-6 w-6"
            />
            <span className="font-semibold">{weather.temp}°C</span>
            <span className="capitalize">{weather.description}</span>
            <span className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              {weather.wind_speed}km/h
            </span>
            {alert && (
              <span className="text-accent font-medium flex items-center gap-1">
                {alert.icon}
                {alert.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicHeader;
