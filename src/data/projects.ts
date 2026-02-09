export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  links: {
    demo?: string;
    github?: string;
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
    id: "caresecurity-qa-agent",
    title: "Security QA Agent",
    description: "WhatsApp AI agent that audits security guards' attendance and uniform compliance from photos",
    longDescription: "A production WhatsApp AI agent that transforms field photos into structured QA scores and dashboards. Security guards or supervisors send photos via WhatsApp, and the system uses a dual-AI pipeline (AWS Rekognition for face identification + Google Gemini for uniform analysis) to produce auditable attendance and compliance logs. Currently live in 2 pilot sites with planned rollout to 20+ sites.",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    images: [
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200"
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
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200"
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
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    images: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200"
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
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200"
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
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200"
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
    thumbnail: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800",
    images: [
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200",
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200"
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
