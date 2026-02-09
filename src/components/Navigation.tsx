import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Menu, X, Camera, Code2, Home } from "lucide-react";
import { cn } from "../lib/utils";

gsap.registerPlugin(ScrollToPlugin);

const navItems = [
  { id: "hero", label: "Home", icon: Home },
  { id: "projects", label: "Projects", icon: Code2 },
  { id: "photography", label: "Photography", icon: Camera },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
      setIsVisible(scrollY > 300);

      // Determine active section
      const sections = navItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 0 },
        ease: "power3.inOut",
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div
          className={cn(
            "mx-4 mt-4 rounded-2xl transition-all duration-500",
            isScrolled
              ? "bg-background/80 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20"
              : "bg-transparent"
          )}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("hero")}
              className="text-lg font-display font-bold tracking-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Portfolio
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                    activeSection === item.id
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  )}
                >
                  {activeSection === item.id && (
                    <span className="absolute inset-0 bg-white/10 rounded-full" />
                  )}
                  <span className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <a
                href="mailto:hello@example.com"
                className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105"
              >
                Get in Touch
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden mx-4 mt-2 rounded-2xl bg-background/95 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300",
                  activeSection === item.id
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-mono text-sm uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
            <div className="pt-2 border-t border-white/10">
              <a
                href="mailto:hello@example.com"
                className="block w-full text-center px-4 py-3 rounded-xl bg-white text-black font-mono text-sm uppercase tracking-wider"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating side navigation */}
      <div
        className={cn(
          "fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3 transition-all duration-500",
          activeSection === "photography" && isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-10 pointer-events-none"
        )}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={cn(
              "group relative p-3 rounded-full transition-all duration-300",
              activeSection === item.id
                ? "bg-white text-black"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            )}
            title={item.label}
          >
            <item.icon className="w-4 h-4" />
            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-background/90 border border-white/10 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Progress indicator */}
      <div
        className={cn(
          "fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 transition-all duration-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="w-px h-24 bg-white/10 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-cyan-300 transition-all duration-300"
            style={{
              height: `${
                (navItems.findIndex((i) => i.id === activeSection) /
                  Math.max(navItems.length - 1, 1)) *
                100
              }%`,
            }}
          />
        </div>
        <span 
          className="text-xs font-mono text-white/40"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {String(navItems.findIndex((i) => i.id === activeSection) + 1).padStart(2, "0")}
          <span className="text-white/20 mx-1">/</span>
          {String(navItems.length).padStart(2, "0")}
        </span>
      </div>
    </>
  );
}
