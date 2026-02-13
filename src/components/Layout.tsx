import { ReactNode } from "react";
import DynamicHeader from "./DynamicHeader";
import Header from "./Header";
import DynamicFooter from "./DynamicFooter";
import FloatingCallButton from "./FloatingCallButton";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <DynamicHeader />
      <Header />
      <main className="flex-1 pt-[136px] sm:pt-[144px]">{children}</main>
      <DynamicFooter />
      <FloatingCallButton />
    </div>
  );
};

export default Layout;
