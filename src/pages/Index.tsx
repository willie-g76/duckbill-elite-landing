import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import ServicesOverview from "@/components/ServicesOverview";
import ServiceAreasPreview from "@/components/ServiceAreasPreview";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <TrustSection />
      <ServicesOverview />
      <ServiceAreasPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
