import { ReactNode, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import DynamicFooter from "./DynamicFooter";
import FloatingCallButton from "./FloatingCallButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll the page to the very top when the route changes
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Also scroll the main container just in case
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main ref={mainRef} className="flex-1 pt-20">{children}</main>
      <DynamicFooter />
      <FloatingCallButton />
    </div>
  );
};

export default Layout;
