import { ArrowDown, ArrowUpRight, Github, GraduationCap, Linkedin } from "lucide-react";

const linkedinUrl = "https://www.linkedin.com/in/mahmoudzaki-";
const githubUrl = "https://github.com/mahmoudzaki323";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  return (
    <section className="section-shell section-grid relative min-h-[100dvh] overflow-hidden border-b border-line pt-24 md:pt-28">
      <div className="mx-auto grid min-h-[calc(100dvh-6rem)] max-w-site grid-cols-1 gap-12 px-5 pb-14 md:px-8 lg:grid-cols-[0.98fr_0.72fr] lg:items-center">
        <div className="relative z-10 flex flex-col justify-center">
          <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-tertiary">
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em]">
              <span className="h-px w-7 bg-accent" />
              Duke University
            </span>
            <span className="hidden h-px w-8 bg-line sm:block" />
            <span className="font-mono text-xs uppercase tracking-[0.12em]">Selected work</span>
          </div>

          <h1 className="max-w-[8.5ch] text-[clamp(5rem,9.8vw,9.4rem)] font-normal leading-[0.82] tracking-[-0.055em] text-primary">
            <span className="block">Mahmoud</span>
            <span className="hero-last-name block">Zaki</span>
          </h1>

          <p className="mt-7 max-w-[58ch] text-base leading-8 text-secondary md:text-lg">
            Computer science and economics at Duke, building software across
            AI products, internal tools, and finance.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-[auto_auto]">
            <button
              type="button"
              onClick={() => scrollToSection("projects")}
              className="action-primary focus-ring inline-flex items-center justify-center gap-3 px-6 py-3.5 text-sm font-semibold"
            >
              View work
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-secondary focus-ring inline-flex items-center justify-center gap-3 px-6 py-3.5 text-sm"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <aside className="relative z-10 grid gap-4">
          <div className="glass-panel p-5 md:p-6">
            <p className="eyebrow mb-3 text-accent">Things I've built</p>
            <h2 className="text-3xl font-medium leading-tight text-primary md:text-4xl">
              A few software projects I've worked on.
            </h2>
            <p className="mt-4 max-w-[42ch] text-sm leading-7 text-secondary">
              Some were built for work, some came out of school or research,
              and some started as side projects.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            <div className="bg-background/90 p-5">
              <p className="mono-tabular text-2xl text-primary">7</p>
              <p className="mt-2 text-xs text-tertiary">selected projects</p>
            </div>
            <div className="bg-background/90 p-5">
              <p className="mono-tabular text-2xl text-primary">4</p>
              <p className="mt-2 text-xs text-tertiary">featured projects</p>
            </div>
            <div className="bg-background/90 p-5">
              <p className="mono-tabular text-2xl text-primary">Duke</p>
              <p className="mt-2 text-xs text-tertiary">university</p>
            </div>
          </div>

          <div className="glass-panel-soft p-5">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-sm text-primary">Duke University</p>
                  <p className="mt-1 text-xs text-tertiary">Double major and certificate track</p>
                </div>
              </div>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-action focus-ring grid h-10 w-10 shrink-0 place-items-center border border-line"
                aria-label="Open GitHub profile"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-4 grid gap-2 border-t border-line pt-4 text-xs leading-5 text-tertiary">
              <p>
                <span className="text-secondary">B.S.</span> Economics, finance concentration
              </p>
              <p>
                <span className="text-secondary">B.S.</span> Computer Science
              </p>
              <p>
                <span className="text-secondary">Certificate</span> Philosophy, Political Science, and Economics
              </p>
            </div>
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("projects")}
        className="scroll-cue focus-ring group absolute bottom-20 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-tertiary transition-colors hover:text-primary md:inline-flex lg:bottom-24"
      >
        <span>Scroll to explore</span>
        <ArrowDown className="scroll-cue-icon h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
      </button>
    </section>
  );
}
