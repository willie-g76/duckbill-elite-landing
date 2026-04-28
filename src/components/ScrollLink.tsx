import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface ScrollLinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

const scrollToTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  // Also try scrolling the #root element in case it's the scroll container
  const root = document.getElementById("root");
  if (root) root.scrollTop = 0;
};

const ScrollLink = ({ to, className, children }: ScrollLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll before navigation
    scrollToTop();
    // Navigate
    navigate(to);
    // Scroll again after navigation in case React re-render moved scroll
    requestAnimationFrame(() => {
      scrollToTop();
    });
    // And one more time with a delay as a final safety net
    setTimeout(() => {
      scrollToTop();
    }, 50);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default ScrollLink;
