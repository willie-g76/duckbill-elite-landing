import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import ServicesOverview from "@/components/ServicesOverview";
import ServiceAreasPreview from "@/components/ServiceAreasPreview";
import CTASection from "@/components/CTASection";
import FloatingCallButton from "@/components/FloatingCallButton";

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Duckbill Roofing &amp; Waterproofing | Calgary's Trusted Roofers</title>
        <meta name="description" content="Expert roofing and waterproofing in Calgary, Alberta. BBB A rated, Red Seal certified with 5-year workmanship warranty. Get your free estimate today!" />
        <link rel="canonical" href="https://duckbillroofing.ca/" />
      </Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RoofingContractor",
            name: "Duckbill Roofing & Waterproofing",
            url: "https://duckbillroofing.ca",
            logo: "https://duckbillroofing.ca/logo-full.png",
            image: "https://duckbillroofing.ca/og-image.png",
            telephone: "+15874323639",
            email: "info@duckbillroofing.ca",
            description:
              "Expert roofing and waterproofing in Calgary, Alberta. BBB A rated, Red Seal certified with 5-year workmanship warranty.",
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Calgary",
              addressRegion: "AB",
              addressCountry: "CA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 51.0447,
              longitude: -114.0719,
            },
            areaServed: [
              { "@type": "City", name: "Calgary" },
              { "@type": "City", name: "Airdrie" },
              { "@type": "City", name: "Okotoks" },
              { "@type": "City", name: "Cochrane" },
              { "@type": "City", name: "Chestermere" },
              { "@type": "City", name: "Bearspaw" },
              { "@type": "City", name: "High River" },
              { "@type": "City", name: "Strathmore" },
              { "@type": "City", name: "Langdon" },
              { "@type": "City", name: "Drumheller" },
              { "@type": "City", name: "Black Diamond" },
              { "@type": "City", name: "Crossfield" },
            ],
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                opens: "07:00",
                closes: "19:00",
              },
            ],
            sameAs: [
              "https://facebook.com/duckbillroofing",
              "https://instagram.com/duckbillroofing",
              "https://g.page/duckbillroofing",
              "https://tiktok.com/@duckbillroofing",
              "https://youtube.com/@duckbillroofing",
            ],
          }),
        }}
      />
      <Hero />
      <TrustSection />
      <ServicesOverview />
      <ServiceAreasPreview />
      <CTASection />
      <FloatingCallButton />
    </Layout>
  );
};

export default Index;
