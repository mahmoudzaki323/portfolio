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
    <footer id="contact" className="section-shell min-h-[100svh] border-t border-line md:min-h-[100dvh]">
      <div className="mx-auto flex min-h-[100svh] max-w-site items-start px-5 pb-10 pt-28 md:min-h-[100dvh] md:items-center md:px-8 md:py-24">
        <div className="grid w-full gap-8 md:gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow mb-3 text-accent md:mb-5">Contact</p>
            <h2 className="max-w-[11ch] text-4xl font-medium leading-[0.9] text-primary md:text-7xl">
              Mahmoud Zaki
            </h2>
            <p className="mt-4 max-w-[58ch] text-sm leading-7 text-secondary md:mt-7 md:text-base md:leading-8">
              Products, internal tools, and research systems.
            </p>
          </div>

          <div className="grid content-between gap-7 border-l-0 border-line md:gap-10 lg:border-l lg:pl-10">
            <div className="grid gap-px overflow-hidden border border-line bg-line">
              <a
                href="https://www.linkedin.com/in/mahmoudzaki-"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-background/90 p-4 transition-colors hover:bg-background-soft md:p-5"
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
                className="group flex items-center justify-between bg-background/90 p-4 transition-colors hover:bg-background-soft md:p-5"
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
                  className="focus-ring flex items-center justify-between border-b border-line py-2.5 text-left text-sm text-secondary transition-colors hover:text-primary md:py-3"
                >
                  {item.label}
                  <MoveUpRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-line pt-5 text-sm text-tertiary md:mt-16 md:flex-row md:items-center md:gap-4 md:pt-6">
          <p className="font-mono">&copy; {new Date().getFullYear()} Mahmoud Zaki</p>
          <p>Software work, research, and photography.</p>
        </div>
      </div>
    </footer>
  );
}
