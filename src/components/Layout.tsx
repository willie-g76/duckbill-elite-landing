import { ReactNode, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import DynamicFooter from "./DynamicFooter";
import FloatingCallButton from "./FloatingCallButton";

interface LayoutProps {
  children: ReactNode;
}

const scrollToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const root = document.getElementById("root");
  if (root) root.scrollTop = 0;
};

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();

  // useLayoutEffect fires BEFORE browser paint
  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);

  // useEffect fires AFTER browser paint — backup scroll
  useEffect(() => {
    scrollToTop();
    // One more scroll after a brief delay to catch any late layout shifts
    const timer = setTimeout(scrollToTop, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <DynamicFooter />
      <FloatingCallButton />
    </div>
  );
};

export default Layout;
