import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Phone, Mail, MapPin, Shield, Award, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const Estimate = () => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: "Estimate Request Submitted!",
      description: "We'll get back to you within 24 hours with your free estimate."
    });
  };
  return <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-max section-padding !py-0">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="max-w-3xl">
            <span className="inline-block text-accent font-semibold text-sm tracking-wider uppercase mb-4">Fill out the form below and receive a detailed estimate within 24 hours. No obligation, no pressure—just honest pricing from Calgary's trusted roofers.</span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Get Your Estimate
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Fill out the form below and receive a detailed estimate within 24 hours. 
              No obligation, no pressure—just honest pricing from Calgary's trusted roofers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="lg:col-span-2">
              {isSubmitted ? <div className="bg-secondary rounded-2xl p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-6">
                    <Check className="h-10 w-10 text-accent" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                    Thank You!
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Your estimate request has been submitted. Our team will review your 
                    information and contact you within 24 hours.
                  </p>
                </div> : <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-soft">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Tell Us About Your Project
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="John" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Smith" required className="h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="(403) 555-1234" required className="h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" placeholder="123 Main Street" required className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City/Community *</Label>
                      <Input id="city" placeholder="Calgary" required className="h-12" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="serviceType">Service Type *</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="urgency">How Soon Do You Need Service?</Label>
                      <Select>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency (ASAP)</SelectItem>
                          <SelectItem value="week">Within a Week</SelectItem>
                          <SelectItem value="month">Within a Month</SelectItem>
                          <SelectItem value="planning">Just Planning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-8 space-y-2">
                    <Label htmlFor="details">Project Details</Label>
                    <Textarea id="details" placeholder="Please describe your roofing needs, any damage you've noticed, or questions you have..." className="min-h-[120px] resize-none" />
                  </div>

                  <Button type="submit" variant="cta" size="xl" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "GET MY FREE ESTIMATE"}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mt-4">
                    By submitting, you agree to receive communications from Duckbill Roofing. 
                    We respect your privacy and will never share your information.
                  </p>
                </form>}
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }} className="space-y-6">
              {/* Contact Card */}
              <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                <h3 className="font-heading text-xl font-bold mb-6">
                  Prefer to Talk?
                </h3>
                <div className="space-y-4">
                  <a href="tel:+14032006621" className="flex items-center gap-3 hover:text-accent transition-colors">
                    <Phone className="h-5 w-5 text-accent" />
                    <span>(403) 200-6621</span>
                  </a>
                  <a href="mailto:info@duckbillroofing.com" className="flex items-center gap-3 hover:text-accent transition-colors">
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
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  Why Choose Us
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">BBB A Rating</h4>
                      <p className="text-sm text-muted-foreground">
                        Excellent standing with BBB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">5-Year Warranty</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive workmanship guarantee
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">24/7 Emergency</h4>
                      <p className="text-sm text-muted-foreground">
                        Always here when you need us
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Steps */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  What Happens Next?
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">We Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Our team reviews your request within hours
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">We Call</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll call to discuss your needs and schedule a visit
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">We Inspect</h4>
                      <p className="text-sm text-muted-foreground">
                        Free on-site inspection and detailed estimate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Estimate;