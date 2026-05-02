import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | Duckbill Roofing &amp; Waterproofing</title>
        <meta name="description" content="Privacy policy for Duckbill Roofing & Waterproofing. Learn how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://duckbillroofing.ca/privacy" />
      </Helmet>
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-max section-padding !py-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-max max-w-3xl prose prose-lg text-muted-foreground">
          <h2 className="font-heading text-foreground">Information We Collect</h2>
          <p>When you use our website or request an estimate, we may collect your name, email, phone number, and property address to provide our roofing services.</p>
          <h2 className="font-heading text-foreground">How We Use Your Information</h2>
          <p>We use your information to respond to inquiries, provide estimates, schedule appointments, and deliver our roofing services. We do not sell your personal information to third parties.</p>
          <h2 className="font-heading text-foreground">Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          <h2 className="font-heading text-foreground">Cookies</h2>
          <p>Our website may use cookies to improve your browsing experience. You can disable cookies in your browser settings.</p>
          <h2 className="font-heading text-foreground">Contact Us</h2>
          <p>If you have questions about this privacy policy, contact us at info@duckbillroofing.ca or (587) 432-3639.</p>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
