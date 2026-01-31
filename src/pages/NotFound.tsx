import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center pt-20">
        <div className="container-max section-padding text-center">
          <h1 className="font-heading text-8xl md:text-9xl font-bold text-accent mb-4">
            404
          </h1>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            Looks like this page has gone missing. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button variant="cta" size="lg">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/estimate">
              <Button variant="outline" size="lg">
                Get an Estimate
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
