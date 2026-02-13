import { ReactNode } from "react";
import DynamicHeader from "./DynamicHeader";
import Header from "./Header";
import DynamicFooter from "./DynamicFooter";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <DynamicHeader />
      <Header />
      <main className="flex-1 pt-14 sm:pt-16">{children}</main>
      <DynamicFooter />
    </div>
  );
};

export default Layout;
