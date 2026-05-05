import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const ServiceAreas = lazy(() => import("./pages/ServiceAreas"));
const ServiceAreaLanding = lazy(() => import("./pages/ServiceAreaLanding"));
const Estimate = lazy(() => import("./pages/Estimate"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const QRLanding = lazy(() => import("./pages/QRLanding"));
const BookOnline = lazy(() => import("./pages/BookOnline"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Disable the browser's automatic scroll restoration so React controls it
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const RouteFallback = () => (
  <div className="min-h-dvh flex items-center justify-center bg-background">
    <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
