import { Github, Linkedin, Twitter, Mail, ArrowUpRight, Heart } from "lucide-react";

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com" },
  { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
  { name: "Twitter", icon: Twitter, url: "https://twitter.com" },
  { name: "Email", icon: Mail, url: "mailto:hello@example.com" },
];

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "#hero" },
      { label: "Photography", href: "#photography" },
      { label: "Projects", href: "#projects" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Twitter", href: "https://twitter.com" },
    ],
  },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/10 bg-background">
      {/* Main footer content */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                Let&apos;s Connect
              </span>
            </h3>
            <p className="text-white/40 max-w-md mb-8 leading-relaxed">
              Always interested in hearing about new projects, creative ideas,
              or opportunities to be part of your vision.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-white/30 mb-5">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/30 flex items-center gap-1.5 font-mono">
              Crafted with <Heart className="w-3.5 h-3.5 text-red-400 inline" /> using
              <span className="text-white/50">React</span>, 
              <span className="text-white/50">Three.js</span> & 
              <span className="text-white/50">Tailwind</span>
            </p>

            <div className="flex items-center gap-6">
              <span className="text-xs text-white/20 font-mono">
                &copy; {new Date().getFullYear()} All rights reserved
              </span>
              <button
                onClick={scrollToTop}
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all duration-300 hover:scale-105"
                aria-label="Scroll to top"
              >
                <ArrowUpRight className="w-4 h-4 -rotate-45" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[150px] pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, #1e3a5f 0%, transparent 70%)" }}
      />
    </footer>
  );
}
