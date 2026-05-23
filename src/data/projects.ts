import nimbusDashboard from "../assets/nimbus-dashboard.jpg";
import nimbusFrame13 from "../assets/nimbus-frame-13.jpg";
import digitalCairoResearchImage from "../assets/projects/digital-cairo-research.png";
import investorPortalImage from "../assets/projects/investor-portal.png";
import scholarAiImage from "../assets/projects/scholar-ai.png";
import securityQaAgentImage from "../assets/projects/security-qa-agent.png";
import trueMarginHeroImage from "../assets/projects/true-margin-hero-demo.png";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  images: string[];
  imageFit?: "cover" | "contain";
  hideTechStack?: boolean;
  hideTags?: boolean;
  tags: string[];
  links: {
    demo?: string;
    github?: string;
    productHunt?: string;
    caseStudy?: string;
    research?: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  color: string;
  year: string;
  featured: boolean;
}

export const projects: Project[] = [
  // === FEATURED PROJECTS ===
  {
    id: "caresecurity-qa-agent",
    title: "CareQA",
    description: "WhatsApp-connected QA workspace for attendance, identity, and uniform verification",
    longDescription: "CareQA is a WhatsApp-connected QA workspace for security operations. Guards and supervisors submit field photos; the app matches identities, checks uniforms, and logs attendance and compliance records for review.",
    thumbnail: securityQaAgentImage,
    images: [
      securityQaAgentImage
    ],
    tags: ["Node.js", "Express", "React", "Supabase", "PostgreSQL", "AWS Rekognition", "Google Gemini", "WhatsApp API", "TypeScript"],
    links: {
      demo: "https://moshref.pro",
      caseStudy: "#case-study-security-qa"
    },
    stats: [
      { label: "Pilot Sites", value: "2" },
      { label: "Planned Rollout", value: "20+" },
      { label: "Guards Supervised", value: "150+" }
    ],
    color: "#3b82f6",
    year: "2025",
    featured: true
  },
  {
    id: "true-margin",
    title: "True Margin",
    description: "Live pre-close margin app for restaurant operators",
    longDescription: "True Margin helps restaurant operators find margin issues before close. It combines invoices, POS, inventory, recipes, labor, bank feeds, and manager notes into forecasts, action items, and weekly owner and bookkeeper summaries.",
    thumbnail: trueMarginHeroImage,
    images: [
      trueMarginHeroImage
    ],
    tags: ["Next.js", "TypeScript", "Supabase", "Clerk", "Anthropic Claude", "Resend", "Vercel", "Tailwind CSS"],
    links: {
      demo: "https://www.truemargin.us"
    },
    stats: [
      { label: "Custom forecasting", value: "Daily" },
      { label: "Operating signals", value: "9 inputs" },
      { label: "Owner workflow", value: "Action cards" }
    ],
    color: "#065f46",
    year: "2026",
    featured: true
  },
  {
    id: "nimbus",
    title: "Nimbus",
    description: "macOS app for turning workflow history into AI context",
    longDescription: "Nimbus is a macOS app that records workflow history and turns it into searchable context for MCP-compatible AI agents. It helps agents navigate internal tools using prior examples of how work was done.",
    thumbnail: nimbusFrame13,
    images: [
      nimbusFrame13,
      nimbusDashboard
    ],
    hideTechStack: true,
    hideTags: true,
    tags: [],
    links: {
      demo: "https://nimbusai.cloud",
      productHunt: "https://www.producthunt.com/products/nimbus-9?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-nimbus-1c165f5e-63f2-4444-9d1b-4fcf70998a35"
    },
    stats: [
      { label: "AI Stages", value: "2" },
      { label: "MCP Tools", value: "7" },
      { label: "Platform", value: "macOS" }
    ],
    color: "#f97316",
    year: "2026",
    featured: true
  },
  {
    id: "disruptech-portal",
    title: "Investor Portal",
    description: "Investor portal for portfolio data, documents, and role-based access",
    longDescription: "An investor and admin portal for a venture capital fund. It tracks portfolio company metrics, organizes documents, supports threaded communication between investors and admins, and enforces granular permissions. Built with TypeScript using React, TypeORM, and PostgreSQL.",
    thumbnail: investorPortalImage,
    images: [
      investorPortalImage
    ],
    tags: ["React", "TypeScript", "Node.js", "Express", "TypeORM", "PostgreSQL", "JWT", "Tailwind CSS"],
    links: {},
    stats: [
      { label: "User Roles", value: "3" },
      { label: "Stack", value: "Full" },
      { label: "Auth", value: "JWT" }
    ],
    color: "#8b5cf6",
    year: "2024",
    featured: false
  },
  // === OTHER PROJECTS ===
  {
    id: "scholar-ai",
    title: "Scholar AI",
    description: "Research assistant for finding sources and structuring academic arguments",
    longDescription: "Scholar AI searches scholarly sources, ranks matches with hybrid retrieval, and drafts thesis and argument structures with citations. Built with Streamlit, OpenAI models, and Supabase pgvector.",
    thumbnail: scholarAiImage,
    images: [
      scholarAiImage
    ],
    tags: ["Python", "Streamlit", "Supabase", "PostgreSQL", "pgvector", "OpenAI", "RAG"],
    links: {},
    stats: [
      { label: "Retrieval", value: "Hybrid" },
      { label: "Focus", value: "Academic" },
      { label: "Model", value: "GPT-4o" }
    ],
    color: "#f59e0b",
    year: "2024",
    featured: false
  },
  {
    id: "digital-cairo",
    title: "Digital Cairo Research",
    description: "Research support for Duke's Digital Cairo project",
    longDescription: "Digital Cairo / News of Cairo is a Duke digital humanities project on Cairo's press and urban history. I contributed research support and data organization for the historical record collection.",
    thumbnail: digitalCairoResearchImage,
    images: [
      digitalCairoResearchImage
    ],
    tags: ["Research", "Digital Humanities", "Data Analysis"],
    links: {
      research: "https://sites.duke.edu/cairemoderne/digital-cairo-xml-tei/"
    },
    stats: [
      { label: "Institution", value: "Duke" },
      { label: "Focus", value: "History" },
      { label: "Type", value: "Research" }
    ],
    color: "#06b6d4",
    year: "2023",
    featured: false
  }
];

export const featuredProjects = projects.filter(p => p.featured);
export const otherProjects = projects.filter(p => !p.featured);

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(p => p.id === id);
};
