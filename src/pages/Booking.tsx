import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Phone, Mail, MapPin, Shield, Award, Clock, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const timeSlots = [
  { value: "9am", label: "9:00 AM" },
  { value: "10am", label: "10:00 AM" },
  { value: "11am", label: "11:00 AM" },
  { value: "12pm", label: "12:00 PM" },
  { value: "1pm", label: "1:00 PM" },
  { value: "2pm", label: "2:00 PM" },
  { value: "3pm", label: "3:00 PM" },
  { value: "4pm", label: "4:00 PM" },
  { value: "5pm", label: "5:00 PM" },
];

const Booking = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      toast({
        title: "Please select a date and time",
        description: "Both a preferred date and time slot are required to book a quote visit.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Quote Visit Booked!",
      description: `Your visit is scheduled for ${format(date, "MMMM d, yyyy")} at ${timeSlots.find((t) => t.value === timeSlot)?.label}. We'll confirm by phone shortly.`,
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-max section-padding !py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
              Schedule a Visit
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Book a Quote Visit
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Pick a date and time that works for you. One of our roofing experts will visit your property for a free,
              no-obligation inspection and quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              {isSubmitted ? (
                <div className="bg-secondary rounded-2xl p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-6">
                    <Check className="h-10 w-10 text-accent" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-4">You're Booked!</h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Your quote visit is scheduled for{" "}
                    <strong>{date && format(date, "MMMM d, yyyy")}</strong> at{" "}
                    <strong>{timeSlots.find((t) => t.value === timeSlot)?.label}</strong>. We'll call to confirm shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-soft">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Choose a Date & Time
                  </h2>

                  {/* Date & Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label>Preferred Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(d) => d < new Date() || d.getDay() === 0}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Time *</Label>
                      <Select value={timeSlot} onValueChange={setTimeSlot}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6 mt-10">
                    Your Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="bookingFirstName">Full Name *</Label>
                      <Input id="bookingFirstName" placeholder="John Smith" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bookingPhone">Phone Number *</Label>
                      <Input id="bookingPhone" type="tel" placeholder="(403) 555-1234" required className="h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="bookingEmail">Email Address *</Label>
                      <Input id="bookingEmail" type="email" placeholder="john@example.com" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bookingAddress">Property Address *</Label>
                      <Input id="bookingAddress" placeholder="123 Main St, Calgary" required className="h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="bookingService">Service Type *</Label>
                      <Select required>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential Roofing</SelectItem>
                          <SelectItem value="waterproofing">Flat Roof Waterproofing</SelectItem>
                          <SelectItem value="repair">Roof Repair</SelectItem>
                          <SelectItem value="inspection">Roof Inspection</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-8 space-y-2">
                    <Label htmlFor="bookingNotes">Additional Notes</Label>
                    <Textarea
                      id="bookingNotes"
                      placeholder="Anything else we should know before the visit..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>

                  <Button type="submit" variant="cta" size="xl" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : "BOOK MY QUOTE VISIT"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    We'll call to confirm your appointment. Visits are free with no obligation.
                  </p>
                </form>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Contact Card */}
              <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                <h3 className="font-heading text-xl font-bold mb-6">Prefer to Talk?</h3>
                <div className="space-y-4">
                  <a href="tel:+14032006621" className="flex items-center gap-3 hover:text-accent transition-colors">
                    <Phone className="h-5 w-5 text-accent" />
                    <span>(403) 200-6621</span>
                  </a>
                  <a
                    href="mailto:info@duckbillroofing.com"
                    className="flex items-center gap-3 hover:text-accent transition-colors"
                  >
                    <Mail className="h-5 w-5 text-accent" />
                    <span>info@duckbillroofing.com</span>
                  </a>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-0.5" />
                    <span>Calgary, Alberta & Surrounding Areas</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-secondary rounded-2xl p-8">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">Why Choose Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">BBB A Rating</h4>
                      <p className="text-sm text-muted-foreground">Excellent standing with BBB</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">5-Year Warranty</h4>
                      <p className="text-sm text-muted-foreground">Comprehensive workmanship guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">24/7 Emergency</h4>
                      <p className="text-sm text-muted-foreground">Always here when you need us</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
