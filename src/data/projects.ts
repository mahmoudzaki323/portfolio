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
  {
    id: "neural-viz",
    title: "NeuralViz",
    description: "Interactive 3D neural network visualization platform",
    longDescription: "A real-time 3D visualization platform for deep learning models. Built with WebGL and Three.js, it allows researchers to explore network architectures, visualize activations, and understand how data flows through complex neural networks. Features interactive pruning, layer inspection, and training progression animations.",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    images: [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200"
    ],
    tags: ["React", "Three.js", "WebGL", "TensorFlow.js", "TypeScript", "Web Workers"],
    links: {
      demo: "https://neural-viz.demo",
      github: "https://github.com/username/neural-viz",
      caseStudy: "#case-study-neural"
    },
    stats: [
      { label: "Nodes Rendered", value: "1M+" },
      { label: "FPS", value: "60" },
      { label: "Models", value: "50+" }
    ],
    color: "#8b5cf6",
    year: "2024",
    featured: true
  },
  {
    id: "distributed-db",
    title: "AeroDB",
    description: "Distributed key-value store with consensus algorithm",
    longDescription: "A high-performance distributed key-value store implementing the Raft consensus algorithm. Features automatic failover, data replication, and partition tolerance. Benchmarked at 100k+ ops/sec with sub-millisecond latency. Includes a built-in web dashboard for cluster monitoring and management.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200"
    ],
    tags: ["Rust", "Tokio", "gRPC", "Raft", "Kubernetes", "Prometheus"],
    links: {
      github: "https://github.com/username/aerodb",
      caseStudy: "#case-study-aero"
    },
    stats: [
      { label: "Throughput", value: "100k+" },
      { label: "Latency", value: "<1ms" },
      { label: "Nodes", value: "32" }
    ],
    color: "#f59e0b",
    year: "2024",
    featured: true
  },
  {
    id: "code-collab",
    title: "SyncCode",
    description: "Real-time collaborative IDE with CRDT-based sync",
    longDescription: "A real-time collaborative code editor built on Conflict-free Replicated Data Types (CRDTs). Supports unlimited concurrent users with zero merge conflicts. Features intelligent cursor tracking, live user presence, voice chat integration, and AI-powered code suggestions. The CRDT implementation ensures consistency across all clients even with network partitions.",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    images: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200"
    ],
    tags: ["TypeScript", "Yjs", "WebRTC", "Node.js", "Monaco Editor", "Socket.io"],
    links: {
      demo: "https://sync-code.demo",
      github: "https://github.com/username/synccode",
      caseStudy: "#case-study-sync"
    },
    stats: [
      { label: "Active Users", value: "10k+" },
      { label: "Languages", value: "40+" },
      { label: "Uptime", value: "99.99%" }
    ],
    color: "#06b6d4",
    year: "2023",
    featured: true
  },
  {
    id: "quantum-sim",
    title: "QuSim",
    description: "Browser-based quantum circuit simulator",
    longDescription: "An educational quantum computing simulator that runs entirely in the browser using WebAssembly. Supports up to 16 qubits with realistic noise models and decoherence simulation. Features an intuitive drag-and-drop circuit builder, state vector visualization, and interactive Bloch spheres. Used by 5+ universities for quantum computing courses.",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
    images: [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200",
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=1200"
    ],
    tags: ["Rust", "WASM", "React", "WebGL", "Quantum Computing", "Tailwind"],
    links: {
      demo: "https://qusim.edu",
      github: "https://github.com/username/qusim",
      caseStudy: "#case-study-qusim"
    },
    stats: [
      { label: "Qubits", value: "16" },
      { label: "Gates", value: "50+" },
      { label: "Students", value: "5k+" }
    ],
    color: "#ec4899",
    year: "2023",
    featured: false
  },
  {
    id: "os-kernel",
    title: "MicroX",
    description: "Microkernel operating system from scratch",
    longDescription: "A minimal microkernel OS written in Rust, featuring memory safety, capability-based security, and message-passing IPC. Boots on x86_64 and RISC-V with a custom bootloader. Implements a userspace driver model, virtual file system, and preemptive multitasking. Includes a custom shell and basic Unix-like utilities.",
    thumbnail: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800",
    images: [
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200"
    ],
    tags: ["Rust", "Assembly", "OS Dev", "x86_64", "RISC-V", "QEMU"],
    links: {
      github: "https://github.com/username/microx",
      caseStudy: "#case-study-microx"
    },
    stats: [
      { label: "Lines", value: "15k" },
      { label: "Boot Time", value: "<100ms" },
      { label: "Arch", value: "2" }
    ],
    color: "#10b981",
    year: "2023",
    featured: false
  },
  {
    id: "compiler",
    title: "Lumina",
    description: "Systems language with LLVM backend",
    longDescription: "A systems programming language with modern features: linear types for memory safety, algebraic data types, pattern matching, and zero-cost abstractions. Compiles to LLVM IR with optimizations comparable to C++ -O2. Features a self-hosted compiler, package manager, and VS Code extension with LSP support.",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
    images: [
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200",
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200"
    ],
    tags: ["Rust", "LLVM", "Parser Combinators", "Language Design", "LSP"],
    links: {
      github: "https://github.com/username/lumina",
      caseStudy: "#case-study-lumina"
    },
    stats: [
      { label: "Performance", value: "C++" },
      { label: "Safety", value: "Rust" },
      { label: "Expressive", value: "ML" }
    ],
    color: "#3b82f6",
    year: "2022",
    featured: false
  }
];

export const featuredProjects = projects.filter(p => p.featured);
export const otherProjects = projects.filter(p => !p.featured);

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(p => p.id === id);
};
