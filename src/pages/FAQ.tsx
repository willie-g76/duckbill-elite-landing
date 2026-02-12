import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import ContactOptions from "@/components/ContactOptions";

const faqCategories = [
  {
    title: "Hail Damage & Insurance Claims",
    faqs: [
      {
        q: "Does my homeowner's insurance cover hail damage to my roof?",
        a: "Yes, most Alberta homeowner's insurance policies cover hail damage as it's classified as a sudden and accidental event. Coverage typically includes the cost to repair or replace your roof, minus your deductible. We recommend reviewing your policy or calling your insurer to confirm your specific coverage limits.",
      },
      {
        q: "How do I file an insurance claim for hail damage?",
        a: "First, document any visible damage with photos. Then contact your insurance company to open a claim — they'll assign an adjuster. We recommend getting a professional inspection from us before or alongside the adjuster's visit, so you have an independent assessment. We can meet with your adjuster on-site to ensure nothing is missed.",
      },
      {
        q: "Will Duckbill Roofing work directly with my insurance company?",
        a: "Absolutely. We regularly work with all major insurers in Alberta (Intact, Aviva, Wawanesa, Co-operators, TD Insurance, and more). We'll provide detailed documentation, meet with your adjuster, and ensure the full scope of damage is captured so you receive fair compensation.",
      },
      {
        q: "How long do I have to file a hail damage claim?",
        a: "Most Alberta insurance policies require you to report damage promptly — typically within 1 year of the event. However, we strongly recommend filing as soon as possible after a hailstorm. Delays can lead to secondary damage (leaks, mould) and may complicate your claim.",
      },
      {
        q: "What does the insurance claims process look like from start to finish?",
        a: "1) We inspect your roof and document all hail damage. 2) You file a claim with your insurer. 3) An insurance adjuster inspects the damage (we can attend this meeting). 4) Your insurer approves the claim and issues payment. 5) We complete the roof repair or replacement. 6) If there's a recoverable depreciation holdback, we help you claim it after the work is done.",
      },
      {
        q: "What is recoverable depreciation and how do I get it?",
        a: "Many insurance policies pay out in two stages: the initial payment (Actual Cash Value = replacement cost minus depreciation) and the recoverable depreciation (the withheld amount). Once we complete the roof work, you submit the invoice to your insurer and they release the remaining funds. We'll guide you through this process.",
      },
      {
        q: "Do I have to pay my deductible?",
        a: "Yes, your deductible is your responsibility. It's illegal in Alberta for a contractor to offer to pay or waive your deductible. Be wary of any roofing company that offers this — it's a red flag. Typical hail deductibles in Calgary range from $1,000 to $5,000.",
      },
      {
        q: "Can I choose my own roofing contractor or does the insurance company choose?",
        a: "You always have the right to choose your own contractor in Alberta. Your insurance company may suggest preferred vendors, but you are not obligated to use them. Choose a contractor you trust — like Duckbill — who will advocate for you during the claims process.",
      },
      {
        q: "How can I tell if my roof has hail damage?",
        a: "Hail damage signs include: dented or bruised shingles, granule loss (check gutters and downspouts), cracked or missing shingles, dents in metal flashing, vents, or gutters, and damaged siding or window screens. We offer free hail damage inspections — don't climb on your roof yourself, let our experts assess safely.",
      },
      {
        q: "What if my insurance claim is denied?",
        a: "Don't panic. Claims can be denied for various reasons. We can help by providing additional documentation, photos, and expert opinions. You can also request a re-inspection, file an appeal, or consult a public adjuster. In Alberta, you have the right to dispute the decision through your insurer's complaints process or the Alberta Insurance Council.",
      },
    ],
  },
  {
    title: "General Roofing Questions",
    faqs: [
      {
        q: "How long does a typical roof replacement take?",
        a: "Most residential roof replacements in Calgary take 1–3 days depending on the size and complexity of your roof. We'll provide a clear timeline during your quote visit.",
      },
      {
        q: "What roofing materials do you recommend for Calgary's climate?",
        a: "We typically recommend impact-resistant (Class 4) asphalt shingles for Calgary homes, as they offer the best protection against hail. Metal roofing is another excellent option for durability. We'll discuss the best options for your specific situation and budget.",
      },
      {
        q: "Do you offer financing?",
        a: "We can discuss payment options during your quote visit. For insurance claims, you typically only pay your deductible upfront and the insurance covers the rest.",
      },
      {
        q: "What is your warranty?",
        a: "We provide a 5-year workmanship warranty on all installations, plus you'll receive the manufacturer's material warranty (typically 25–50 years depending on the product chosen).",
      },
    ],
  },
];

const FAQ = () => {
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
              Frequently Asked Questions
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Hail Damage & Insurance Claims FAQ
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Everything Calgary homeowners need to know about hail damage, insurance claims, 
              and getting your roof repaired or replaced.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {faqCategories.map((category, catIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                >
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {category.title}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${catIndex}-${index}`}
                        className="bg-card rounded-xl border border-border px-6"
                      >
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
                <h3 className="font-heading text-xl font-bold mb-4">
                  Need Help With a Claim?
                </h3>
                <p className="text-primary-foreground/80 text-sm mb-6">
                  Our team has handled hundreds of insurance claims for Calgary homeowners. 
                  Let us take the stress out of the process.
                </p>
                <ContactOptions />
              </div>

              <div className="bg-accent rounded-2xl p-8">
                <h3 className="font-heading text-xl font-bold text-accent-foreground mb-4">
                  Free Hail Damage Inspection
                </h3>
                <p className="text-accent-foreground/90 text-sm mb-6">
                  Not sure if your roof has hail damage? We'll inspect it for free and provide 
                  a detailed report you can use for your insurance claim.
                </p>
                <Link to="/estimate">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full group">
                    Book Free Inspection
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqCategories.flatMap((cat) =>
              cat.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              }))
            ),
          }),
        }}
      />
    </Layout>
  );
};

export default FAQ;
