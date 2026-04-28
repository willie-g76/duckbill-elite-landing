import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface ScrollLinkProps {
  to: string;
  className?: string;
  children: ReactNode;
}

/**
 * A link that scrolls to the top of the page BEFORE navigating.
 * This guarantees the new page loads at the top.
 */
const ScrollLink = ({ to, className, children }: ScrollLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Scroll to top first
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Then navigate
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default ScrollLink;
