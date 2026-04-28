import { ArrowUpRight, Github, Linkedin, MoveUpRight } from "lucide-react";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const footerNav = [
  { label: "Work", id: "projects" },
  { label: "Photography", id: "photography" },
  { label: "Top", id: "hero" },
];

export function Footer() {
  return (
    <footer id="contact" className="section-shell border-t border-line">
      <div className="mx-auto max-w-site px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow mb-5 text-accent">Contact</p>
            <h2 className="max-w-[11ch] text-5xl font-semibold leading-[0.96] text-primary md:text-7xl">
              Mahmoud Zaki.
            </h2>
            <p className="mt-7 max-w-[58ch] text-base leading-8 text-secondary">
              Products, internal tools, and research systems.
            </p>
          </div>

          <div className="grid content-between gap-10 border-l-0 border-line lg:border-l lg:pl-10">
            <div className="grid gap-px overflow-hidden border border-line bg-line">
              <a
                href="https://www.linkedin.com/in/mahmoudzaki-"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-background p-5 transition-colors hover:bg-background-soft"
              >
                <span className="inline-flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-accent" />
                  LinkedIn
                </span>
                <ArrowUpRight className="h-4 w-4 text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </a>
              <a
                href="https://github.com/mahmoudzaki323"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-background p-5 transition-colors hover:bg-background-soft"
              >
                <span className="inline-flex items-center gap-3">
                  <Github className="h-5 w-5 text-accent" />
                  GitHub
                </span>
                <ArrowUpRight className="h-4 w-4 text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </a>
            </div>

            <div className="grid gap-3">
              {footerNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="focus-ring flex items-center justify-between border-b border-line py-3 text-left text-sm text-secondary transition-colors hover:text-primary"
                >
                  {item.label}
                  <MoveUpRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-line pt-6 text-sm text-tertiary md:flex-row md:items-center">
          <p className="font-mono">&copy; {new Date().getFullYear()} Mahmoud Zaki</p>
          <p>Software work, research, and photography.</p>
        </div>
      </div>
    </footer>
  );
}
