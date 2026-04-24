import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { id: "projects", label: "Work" },
  { id: "photography", label: "Photography" },
  { id: "contact", label: "Contact" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateNavigation = () => {
      setIsScrolled(window.scrollY > 24);

      const checkpoint = window.innerHeight * 0.42;
      const sectionIds = ["hero", ...navItems.map((item) => item.id)];
      let nextActive = "hero";

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();

        if (rect.top <= checkpoint && rect.bottom > checkpoint) {
          nextActive = id;
          break;
        }
      }

      setActiveSection(nextActive);
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        updateNavigation();
      });
    };

    updateNavigation();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav
        className={cn(
          "mx-auto flex max-w-site items-center justify-between border px-4 py-3 transition-colors duration-300 md:px-5",
          isScrolled
            ? "glass-panel border-line bg-background/82 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
        aria-label="Primary navigation"
      >
        <button
          type="button"
          onClick={() => handleNavClick("hero")}
          className="focus-ring flex items-center gap-3 text-left"
          aria-label="Back to top"
        >
          <span className="grid h-10 w-10 place-items-center border border-line font-display text-lg font-semibold text-primary">
            MZ
          </span>
          <span className="hidden font-mono text-xs uppercase text-secondary sm:block">
            Mahmoud Zaki
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "focus-ring relative px-4 py-2 text-sm transition-colors duration-200",
                activeSection === item.id ? "text-primary" : "text-tertiary hover:text-primary"
              )}
            >
              <span>{item.label}</span>
              {activeSection === item.id && (
                <span className="absolute inset-x-4 -bottom-px h-px bg-accent" />
              )}
            </button>
          ))}
        </div>

        <a
          href="https://www.linkedin.com/in/mahmoudzaki-"
          target="_blank"
          rel="noopener noreferrer"
          className="action-secondary focus-ring hidden items-center gap-2 px-4 py-2 text-sm md:inline-flex"
        >
          Get in touch
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          className="icon-action focus-ring grid h-10 w-10 place-items-center border border-line md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "mx-auto mt-2 max-w-site overflow-hidden border border-line bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          isMobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "focus-ring flex w-full items-center justify-between border-b border-line px-3 py-4 text-left text-sm",
                activeSection === item.id ? "text-primary" : "text-secondary"
              )}
            >
              {item.label}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          ))}
          <a
            href="https://www.linkedin.com/in/mahmoudzaki-"
            target="_blank"
            rel="noopener noreferrer"
            className="action-primary focus-ring mt-3 flex items-center justify-between px-4 py-3 text-sm font-medium"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
