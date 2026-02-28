import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <Layout>
      <Helmet>
        <title>Terms of Service | Duckbill Roofing &amp; Waterproofing</title>
        <meta name="description" content="Terms of service for Duckbill Roofing & Waterproofing services in Calgary, Alberta." />
        <link rel="canonical" href="https://duckbillroofing.ca/terms" />
      </Helmet>
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-max section-padding !py-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-max max-w-3xl prose prose-lg text-muted-foreground">
          <h2 className="font-heading text-foreground">Agreement to Terms</h2>
          <p>By accessing our website, you agree to these terms of service. If you do not agree, please do not use our site.</p>
          <h2 className="font-heading text-foreground">Services</h2>
          <p>Duckbill Roofing & Waterproofing provides roofing installation, repair, waterproofing, and inspection services in Calgary, Alberta, and surrounding communities.</p>
          <h2 className="font-heading text-foreground">Estimates & Quotes</h2>
          <p>All estimates provided through our website are preliminary and subject to change after an in-person inspection. Final pricing will be confirmed before any work begins.</p>
          <h2 className="font-heading text-foreground">Warranty</h2>
          <p>All completed projects include our 5-year workmanship warranty. Manufacturer material warranties are separate and vary by product selected.</p>
          <h2 className="font-heading text-foreground">Limitation of Liability</h2>
          <p>Duckbill Roofing & Waterproofing is not liable for any indirect or consequential damages arising from the use of our website or services.</p>
          <h2 className="font-heading text-foreground">Contact</h2>
          <p>Questions about these terms? Contact us at info@duckbillroofing.com or (587) 432-3639.</p>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
