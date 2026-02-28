import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { getNeighbourhoodBySlug } from "@/data/neighbourhoods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Check, Phone, MapPin, Shield, Hammer, CloudRain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoFull from "@/assets/logo-full.png";

type QuoteType = "in-person" | "virtual" | null;

const timeSlots = [
  { value: "8:00", label: "8:00 AM – 9:30 AM" },
  { value: "9:30", label: "9:30 AM – 11:00 AM" },
  { value: "11:00", label: "11:00 AM – 12:30 PM" },
  { value: "12:30", label: "12:30 PM – 2:00 PM" },
  { value: "2:00", label: "2:00 PM – 3:30 PM" },
  { value: "3:30", label: "3:30 PM – 5:00 PM" },
  { value: "4:30", label: "4:30 PM – 6:00 PM" },
];

const QRLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const neighbourhood = slug ? getNeighbourhoodBySlug(slug) : undefined;

  const { toast } = useToast();
  const [selectedQuote, setSelectedQuote] = useState<QuoteType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");

  // Add noindex for unpublished neighbourhood QR pages
  const isUnpublished = neighbourhood && !neighbourhood.published;

  if (!neighbourhood) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-background text-center">
        <img src={logoFull} alt="Duckbill Roofing" className="h-12 mb-8" />
        <h1 className="font-heading text-2xl font-bold text-foreground mb-3">
          Neighbourhood Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the page you're looking for.
        </p>
        <Link to="/service-areas">
          <Button variant="cta" size="lg">
            View All Service Areas
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fullName = (formData.get("name") as string) || "";
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const displayName = firstName || "there";

    setIsSubmitting(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const body = {
        firstName,
        lastName,
        email: (formData.get("email") as string) || "",
        phone: (formData.get("phone") as string) || "",
        address: (formData.get("address") as string) || "",
        city: neighbourhood.name,
        serviceType: selectedQuote === "in-person" ? "inspection" : "residential",
        preferredDate: date ? format(date, "yyyy-MM-dd") : undefined,
        preferredTime: timeSlot
          ? timeSlots.find((t) => t.value === timeSlot)?.label
          : undefined,
        source: "qr-landing" as const,
        community: neighbourhood.name,
      };

      const res = await fetch(`${supabaseUrl}/functions/v1/submit-lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Request failed (${res.status})`);
      }

      setSubmittedName(displayName);
      setIsSubmitted(true);
    } catch (error) {
      console.error("QR landing submission error:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't send your request. Please try again or call us at (587) 432-3639.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuoteSelect = (type: QuoteType) => {
    setSelectedQuote(type);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Helmet>
        <title>{`Roofing in ${neighbourhood.name} | Free Quote | Duckbill Roofing`}</title>
        <meta name="description" content={`Get a free roofing quote in ${neighbourhood.name}, Calgary. Book an in-person or virtual estimate with Duckbill Roofing.`} />
        {isUnpublished && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <div className="flex-1 w-full max-w-md mx-auto px-5 py-8 flex flex-col">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <img src={logoFull} alt="Duckbill Roofing" className="h-10 mx-auto" />
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Hey, {neighbourhood.name}!
          </h1>
          <p className="text-muted-foreground text-sm">
            Calgary's Roofing Specialists — Free Quote
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            /* ── Thank-you state ── */
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                >
                  <Check className="h-8 w-8 text-green-600" />
                </motion.div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Thanks, {submittedName}!
                </h2>
                <p className="text-muted-foreground">
                  We'll be in touch within 24 hours.
                </p>
              </div>

              {/* Explore links */}
              <div className="space-y-3 mb-8">
                <Link
                  to={`/service-areas/${slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    Learn about roofing in {neighbourhood.name}
                  </span>
                </Link>
                <Link
                  to="/services"
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Hammer className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    Our Services
                  </span>
                </Link>
                <Link
                  to="/faq"
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <CloudRain className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    Hail Damage & Insurance
                  </span>
                </Link>
              </div>

              {/* Call Now */}
              <Button variant="cta" size="xl" className="w-full mt-auto text-base" asChild>
                <a href="tel:+15874323639">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </a>
              </Button>
            </motion.div>
          ) : !selectedQuote ? (
            /* ── Initial CTA buttons ── */
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="space-y-4 mb-8">
                <Button
                  variant="cta"
                  size="xl"
                  className="w-full text-base"
                  onClick={() => handleQuoteSelect("in-person")}
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Schedule an In-Person Quote
                </Button>
                <Button
                  variant="ctaOutline"
                  size="xl"
                  className="w-full text-base"
                  onClick={() => handleQuoteSelect("virtual")}
                >
                  Get an Online Quote
                </Button>
              </div>

              {/* Call Now */}
              <Button variant="cta" size="xl" className="w-full mt-auto text-base" asChild>
                <a href="tel:+15874323639">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </a>
              </Button>
            </motion.div>
          ) : (
            /* ── Form state ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col"
            >
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-sm text-muted-foreground hover:text-foreground mb-4 self-start transition-colors"
              >
                &larr; Back
              </button>

              <h2 className="font-heading text-xl font-bold text-foreground mb-5">
                {selectedQuote === "in-person"
                  ? "Schedule an In-Person Quote"
                  : "Get an Online Quote"}
              </h2>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-4 mb-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="qr-name">Name</Label>
                    <Input
                      id="qr-name"
                      name="name"
                      placeholder="John Smith"
                      autoComplete="name"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="qr-phone">Phone</Label>
                    <Input
                      id="qr-phone"
                      name="phone"
                      type="tel"
                      placeholder="(403) 555-1234"
                      autoComplete="tel"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="qr-email">Email</Label>
                    <Input
                      id="qr-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      autoComplete="email"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="qr-address">Address</Label>
                    <Input
                      id="qr-address"
                      name="address"
                      placeholder="123 Main St, Calgary"
                      autoComplete="street-address"
                      required
                      className="h-12"
                    />
                  </div>

                  {selectedQuote === "in-person" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="space-y-1.5">
                        <Label>Preferred Date</Label>
                        <div className="border rounded-lg overflow-hidden">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => { setDate(d); setTimeSlot(""); }}
                            disabled={(d) => d < new Date() || d.getDay() === 0}
                            className="mx-auto"
                          />
                        </div>
                      </div>

                      {date && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-1.5"
                        >
                          <Label>Preferred Time — {format(date, "MMM d")}</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot.value}
                                type="button"
                                onClick={() => setTimeSlot(slot.value)}
                                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                                  timeSlot === slot.value
                                    ? "border-duckbill-duck bg-duckbill-duck text-white"
                                    : "border-input bg-background text-foreground hover:bg-secondary"
                                }`}
                              >
                                {slot.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  size="xl"
                  className="w-full mt-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "SEND MY REQUEST"}
                </Button>
              </form>

              {/* Call Now */}
              <Button variant="cta" size="xl" className="w-full text-base mt-4" asChild>
                <a href="tel:+15874323639">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </a>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QRLanding;
