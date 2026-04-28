import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceAreas from "./pages/ServiceAreas";
import ServiceAreaLanding from "./pages/ServiceAreaLanding";
import Estimate from "./pages/Estimate";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import QRLanding from "./pages/QRLanding";
import BookOnline from "./pages/BookOnline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  // useLayoutEffect fires BEFORE the browser paints — this is critical
  // useEffect fires too late and the browser may have already scrolled
  useLayoutEffect(() => {
    if (hash) {
      // Delay hash scroll so the target element has time to render
      requestAnimationFrame(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

// Disable the browser's automatic scroll restoration so React controls it
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/service-areas/:areaSlug" element={<ServiceAreaLanding />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/book" element={<BookOnline />} />
          <Route path="/booking" element={<Navigate to="/book" replace />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/go/:slug" element={<QRLanding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
