import nimbusDashboard from "../assets/nimbus-dashboard.jpg";
import nimbusFrame13 from "../assets/nimbus-frame-13.jpg";
import digitalCairoResearchImage from "../assets/projects/digital-cairo-research.png";
import investorPortalImage from "../assets/projects/investor-portal.png";
import scholarAiImage from "../assets/projects/scholar-ai.png";
import securityQaAgentImage from "../assets/projects/security-qa-agent.png";
import securityWorkforcePlatformImage from "../assets/projects/security-workforce-platform.png";
import vitaraVoiceOsImage from "../assets/projects/vitara-voice-os.png";

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
    id: "nimbus",
    title: "Nimbus",
    description: "AI workflow memory for macOS",
    longDescription: "Nimbus records your workflow in the background, understands what you are doing with on-device AI analysis, and turns that activity into structured memory AI agents can query later. It combines local capture, workflow understanding, cloud sync, and MCP access into a product for people who want their real work to become reusable context.",
    thumbnail: nimbusFrame13,
    images: [
      nimbusFrame13,
      nimbusDashboard
    ],
    imageFit: "contain",
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
    id: "caresecurity-qa-agent",
    title: "Security QA Agent",
    description: "WhatsApp AI agent that audits security guards' attendance and uniform compliance from photos",
    longDescription: "A production WhatsApp AI agent that transforms field photos into structured QA scores and dashboards. Security guards or supervisors send photos via WhatsApp, and the system uses a dual-AI pipeline (AWS Rekognition for face identification + Google Gemini for uniform analysis) to produce auditable attendance and compliance logs. Currently live in 2 pilot sites with planned rollout to 20+ sites.",
    thumbnail: securityQaAgentImage,
    images: [
      securityQaAgentImage
    ],
    tags: ["Node.js", "Express", "React", "Supabase", "PostgreSQL", "AWS Rekognition", "Google Gemini", "WhatsApp API", "TypeScript"],
    links: {
      caseStudy: "#case-study-security-qa"
    },
    stats: [
      { label: "Pilot Sites", value: "2" },
      { label: "Planned Rollout", value: "20+" },
      { label: "AI Models", value: "2" }
    ],
    color: "#3b82f6",
    year: "2024",
    featured: true
  },
  {
    id: "caresecurity-workforce",
    title: "Security Workforce Platform",
    description: "Android-first workforce management platform for 5,000+ security personnel",
    longDescription: "An enterprise workforce management platform designed to scale to 5,000+ users. Security supervisors use an Android app (React Native) to capture evidence via photos, GPS, NFC, and QR check-ins. Managers access real-time dashboards to track rounds, view compliance reports, and align operations with contract clauses. Features immutable audit trails and contract-aware workflows to prevent revenue deductions.",
    thumbnail: securityWorkforcePlatformImage,
    images: [
      securityWorkforcePlatformImage
    ],
    tags: ["React Native", "Expo", "Node.js", "PostgreSQL", "Supabase", "Turborepo", "TypeScript", "i18n (AR/EN)"],
    links: {
      caseStudy: "#case-study-security-workforce"
    },
    stats: [
      { label: "Target Users", value: "5,000+" },
      { label: "Platforms", value: "2" },
      { label: "Languages", value: "2" }
    ],
    color: "#10b981",
    year: "2024",
    featured: true
  },
  {
    id: "disruptech-portal",
    title: "Investor Portal",
    description: "Full-stack VC dashboard with portfolio metrics, document management, and role-based access",
    longDescription: "A full-stack investor and admin portal for a venture capital fund. Features portfolio company tracking with key metrics, document management with categorization, a threaded messaging system between investors and admins, and granular role-based access control. Built with TypeScript across the stack, using React/TypeORM/PostgreSQL. Includes simulated AI features ready for real LLM integration.",
    thumbnail: investorPortalImage,
    images: [
      investorPortalImage
    ],
    tags: ["React", "TypeScript", "Node.js", "Express", "TypeORM", "PostgreSQL", "JWT", "Tailwind CSS"],
    links: {
      caseStudy: "#case-study-investor-portal"
    },
    stats: [
      { label: "User Roles", value: "3" },
      { label: "Stack", value: "Full" },
      { label: "Auth", value: "JWT" }
    ],
    color: "#8b5cf6",
    year: "2024",
    featured: true
  },
  // === OTHER PROJECTS ===
  {
    id: "scholar-ai",
    title: "Scholar AI",
    description: "Research assistant that retrieves scholarly evidence and generates structured academic arguments",
    longDescription: "A research and argumentation assistant inspired by philosophy coursework. Uses hybrid retrieval (vector similarity + metadata filtering) from a Supabase pgvector database of scholarly works. Generates structured academic responses with thesis, supporting arguments, objections, and replies—all grounded in primary sources with full provenance. Built with Streamlit and OpenAI models.",
    thumbnail: scholarAiImage,
    images: [
      scholarAiImage
    ],
    tags: ["Python", "Streamlit", "Supabase", "PostgreSQL", "pgvector", "OpenAI", "RAG"],
    links: {
      caseStudy: "#case-study-scholar"
    },
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
    id: "vitara-voice-os",
    title: "Vitara Voice OS",
    description: "Voice-first OS concept for seniors to access services and healthcare through natural conversation",
    longDescription: "A voice-first 'OS' designed for people locked out of traditional UIs—primarily seniors and those with physical or cognitive limitations. Prototype features daily health check-ins, on-demand task completion (groceries, Uber, appointments), and planned EHR integration for medication adherence and cognitive decline detection. Built with Vapi voice platform, multi-agent LangGraph system, and conducted ~10 user interviews with care facility staff.",
    thumbnail: vitaraVoiceOsImage,
    images: [
      vitaraVoiceOsImage
    ],
    tags: ["Node.js", "Python", "LangGraph", "Vapi", "Pinecone", "PostgreSQL", "Redis", "FHIR"],
    links: {
      caseStudy: "#case-study-vitara"
    },
    stats: [
      { label: "Interviews", value: "10+" },
      { label: "Target", value: "Seniors" },
      { label: "Status", value: "Demo" }
    ],
    color: "#ec4899",
    year: "2024",
    featured: false
  },
  {
    id: "digital-cairo",
    title: "Digital Cairo Research",
    description: "Research contributor to Duke University's historical data project on Cairo's press and urban history",
    longDescription: "Contributed to Digital Cairo / News of Cairo, a digital humanities project at Duke University focusing on Cairo's press and urban history. Work involved research, data organization, and supporting the project's mission to preserve and analyze historical records of Egypt's journalistic heritage.",
    thumbnail: digitalCairoResearchImage,
    images: [
      digitalCairoResearchImage
    ],
    tags: ["Research", "Digital Humanities", "Data Analysis"],
    links: {
      caseStudy: "#case-study-digital-cairo"
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
