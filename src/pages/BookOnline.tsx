import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useScheduler } from "@/hooks/use-scheduler";
import BookingSteps from "@/components/scheduler/BookingSteps";
import ContactForm from "@/components/scheduler/ContactForm";
import SlotPicker from "@/components/scheduler/SlotPicker";
import BookingConfirmStep from "@/components/scheduler/BookingConfirmStep";
import BookingSuccess from "@/components/scheduler/BookingSuccess";
import { Phone, Clock, MapPin } from "lucide-react";

const BookOnline = () => {
  const scheduler = useScheduler();

  // Member name is internal only — not shown to homeowner

  return (
    <Layout>
      <Helmet>
        <title>Book a Free Roofing Estimate Online | Duckbill Roofing Calgary</title>
        <meta
          name="description"
          content="Book your free roofing estimate online. Pick a time that works for you and get instant confirmation. No waiting for a callback."
        />
        <link rel="canonical" href="https://duckbillroofing.ca/book" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-12 bg-secondary">
        <div className="container-max section-padding !py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">
              Online Booking
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Book Your Free Estimate
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Pick a time that works for you. We'll confirm instantly — no waiting for a callback.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Flow */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div ref={scheduler.stepRef} className="bg-card rounded-2xl p-6 md:p-8 shadow-soft">
                <BookingSteps current={scheduler.step} />

                {scheduler.step === 1 && (
                  <ContactForm
                    onSubmit={scheduler.submitContact}
                    defaultValues={scheduler.contact}
                  />
                )}

                {scheduler.step === 2 && (
                  <SlotPicker
                    slots={scheduler.slots}
                    loading={scheduler.slotsLoading}
                    timezone={scheduler.slotsTimezone}
                    viewMonth={scheduler.viewMonth}
                    onViewMonthChange={scheduler.setViewMonth}
                    onSelect={scheduler.selectSlot}
                    onBack={scheduler.goBack}
                  />
                )}

                {scheduler.step === 3 && scheduler.contact && scheduler.selectedSlot && (
                  <BookingConfirmStep
                    contact={scheduler.contact}
                    slot={scheduler.selectedSlot}
                    timezone={scheduler.slotsTimezone}
                    loading={scheduler.bookingLoading}
                    error={scheduler.bookingError}
                    onConfirm={scheduler.confirmBooking}
                    onBack={scheduler.goBack}
                  />
                )}

                {scheduler.step === 4 && scheduler.bookingResult && (
                  <BookingSuccess
                    result={scheduler.bookingResult}
                    address={scheduler.contact?.address}
                    timezone={scheduler.slotsTimezone}
                  />
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* How it works */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Enter Your Info</h4>
                      <p className="text-sm text-muted-foreground">
                        Name, phone, and address so we know where to go
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Pick a Time</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose from real-time available slots
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Instant Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        Get a calendar invite right away — no waiting
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact fallback */}
              <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                <h3 className="font-heading text-xl font-bold mb-6">
                  Prefer to Talk?
                </h3>
                <div className="space-y-4">
                  <a
                    href="tel:+15874323639"
                    className="flex items-center gap-3 hover:text-accent transition-colors"
                  >
                    <Phone className="h-5 w-5 text-accent" />
                    <span>(587) 432-3639</span>
                  </a>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-accent mt-0.5" />
                    <span>7 Days a Week, 8 AM – 6 PM</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent mt-0.5" />
                    <span>Calgary, AB & Surrounding Areas</span>
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

export default BookOnline;
