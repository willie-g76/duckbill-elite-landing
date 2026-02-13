import { ReactNode } from "react";
import Header from "./Header";
import DynamicFooter from "./DynamicFooter";
import FloatingCallButton from "./FloatingCallButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
