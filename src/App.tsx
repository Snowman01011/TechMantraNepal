import React, { useState, useEffect } from "react";
import { Service, Project, ThemeType } from "./types";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TorusKnotCanvas from "./components/TorusKnotCanvas";
import AdminPanel from "./components/AdminPanel";
import { motion, AnimatePresence } from "motion/react";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { 
  Globe, 
  Smartphone, 
  TrendingUp, 
  Palette, 
  Cpu, 
  Layers, 
  ArrowRight, 
  Mail, 
  MapPin, 
  Terminal, 
  Check, 
  Activity, 
  Layers2, 
  Settings,
  Shield,
  Zap,
  Award,
  ArrowUpRight,
  Code2,
  Workflow,
  Binary,
  ChevronDown,
  HelpCircle,
  Sparkles,
  Play,
  Rss,
  Database,
  DollarSign
} from "lucide-react";

const architecturalFaqs = [
  {
    q: "What is TechMantra's core deployment and micro-infrastructure strategy?",
    a: "We deploy using lightweight, serverless container platforms. Our stack leverages a container-native runtime that auto-scales dynamically with active workloads (scale-to-zero capabilities) and streams telemetry payloads through secure reverse proxies, keeping critical nodes decoupled from client environments."
  },
  {
    q: "How does TechMantra enforce a zero-bloat standard for code assets?",
    a: "Our standard strictly prohibits over-engineering, layout decoration, and speculative imports. We compile and bundle our custom servers into a single, optimized file under dist/ with explicit package-exclusion flags. This approach drastically minimizes container cold-starts and system memory overhead."
  },
  {
    q: "Why do we prioritize Supabase and relational federated databases?",
    a: "Relational data structures guarantee transactional integrity, strong typing, and schema validation. Supabase allows us to implement secure, real-time sync with PostgreSQL schemas powered by Row-Level Security (RLS) policies, providing robust user data isolation without heavy backend middleware."
  },
  {
    q: "How does asynchronous design philosophy improve delivery cycles?",
    a: "By shifting communication to precise, self-documenting code specifications and interface contracts, we eliminate standard meeting bloat and alignment overhead. This results in hyper-focused build iterations, robust documentation, and rapid release intervals for our clients."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [theme, setTheme] = useState<ThemeType>("dark");
  const [securePortalActive, setSecurePortalActive] = useState<boolean>(false);
  
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);
  const [ctaName, setCtaName] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaMessage, setCtaMessage] = useState("");
  const [ctaSuccess, setCtaSuccess] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Added States for trust sections, video, pricing map components
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [cfgStorageType, setCfgStorageType] = useState<"postgres" | "sqlite" | "client">("postgres");
  const [cfgCaching, setCfgCaching] = useState<boolean>(true);
  const [cfgSecurity, setCfgSecurity] = useState<boolean>(true);
  const [cfgTelemetry, setCfgTelemetry] = useState<boolean>(false);
  const [cfgLoadMultiplier, setCfgLoadMultiplier] = useState<number>(50);
  const [activeMapNode, setActiveMapNode] = useState<number>(2);

  const fetchDynamicData = async () => {
    try {
      const sRes = await fetch("/api/services");
      if (sRes.ok) {
        const sData = await sRes.json();
        setServices(sData.services);
      }
      const pRes = await fetch("/api/projects");
      if (pRes.ok) {
        const pData = await pRes.json();
        setProjects(pData.projects);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalHeight = scrollHeight - clientHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run immediately to capture initial loaded position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, securePortalActive]);

  useEffect(() => {
    fetchDynamicData();

    // Check query params and pathname to toggle the admin dashboard
    const checkAdminAccess = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      if (path === "/admin" || params.has("admin") || params.has("portal")) {
        setSecurePortalActive(true);
      }
    };
    checkAdminAccess();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowThankYou(false);
      }
    };
    if (showThankYou) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showThankYou]);

  // Track cursor position to dynamically illuminate the dotted background patterns
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const root = document.documentElement;
      root.style.setProperty("--mouse-x", `${e.clientX}px`);
      root.style.setProperty("--mouse-y", `${e.clientY}px`);

      const bg = document.getElementById("interactive-glow-bg");
      if (bg) {
        bg.style.setProperty("--mouse-x", `${e.clientX}px`);
        bg.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Synchronize dynamic background theme classes with document.body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSuccess(true);
    setShowThankYou(true);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => {
      setContactSuccess(false);
    }, 4000);
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctaName || !ctaEmail || !ctaMessage) return;
    setCtaSuccess(true);
    setShowThankYou(true);
    setCtaName("");
    setCtaEmail("");
    setCtaMessage("");
    setTimeout(() => {
      setCtaSuccess(false);
    }, 4000);
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail("");
    setTimeout(() => {
      setNewsletterSuccess(false);
    }, 4000);
  };



  const themeStyles = () => {
    if (theme === "dark") {
      return {
        "--dot-color": "rgba(255, 255, 255, 0.065)",
        "--grid-color": "rgba(255, 255, 255, 0.012)",
      } as React.CSSProperties;
    }
    if (theme === "green") {
      return {
        "--dot-color": "rgba(34, 197, 94, 0.11)",
        "--grid-color": "rgba(34, 197, 94, 0.015)",
      } as React.CSSProperties;
    }
    return {
      "--dot-color": "rgba(24, 24, 27, 0.06)",
      "--grid-color": "#f1f5f9",
    } as React.CSSProperties;
  };

  const currentBgClass = () => {
    if (theme === "dark") return "bg-transparent text-zinc-100 selection:bg-zinc-800 selection:text-white";
    if (theme === "green") return "bg-transparent text-green-100 selection:bg-green-950 selection:text-green-300";
    return "bg-transparent text-slate-900 selection:bg-green-100 selection:text-slate-900";
  };

  const containerBorderClass = () => {
    if (theme === "dark") return "border-zinc-800";
    if (theme === "green") return "border-green-950";
    return "border-slate-150";
  };

  const cardBgClass = () => {
    if (theme === "dark") return "bg-zinc-900/10 border-zinc-850 backdrop-blur-sm";
    if (theme === "green") return "bg-zinc-900/15 border-green-950/60 backdrop-blur-sm";
    return "bg-[#fcfcfc]/80 border-slate-150 backdrop-blur-sm";
  };

  const gridDotColor = () => {
    if (theme === "dark") return "rgba(255, 255, 255, 0.02)";
    if (theme === "green") return "rgba(34, 197, 94, 0.04)";
    return "rgba(0, 0, 0, 0.03)";
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Globe": return <Globe size={20} />;
      case "Smartphone": return <Smartphone size={20} />;
      case "TrendingUp": return <TrendingUp size={20} />;
      case "Palette": return <Palette size={20} />;
      case "Cpu": return <Cpu size={20} />;
      case "Layers": return <Layers size={20} />;
      default: return <Settings size={20} />;
    }
  };


  return (
    <div style={themeStyles()} className={`min-h-screen flex flex-col transition-colors duration-300 relative ${currentBgClass()}`}>
      {/* Top scroll-depth progress indicator */}
      <div 
        id="scroll-progress-bar"
        className="fixed top-0 left-0 right-0 h-[3px] z-[10000] origin-left pointer-events-none transition-all duration-100 ease-out"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: theme === "green" ? "#22c55e" : theme === "dark" ? "#f4f4f5" : "#18181b",
          boxShadow: theme === "green" 
            ? "0 1px 8px rgba(34, 197, 94, 0.5)" 
            : theme === "dark" 
              ? "0 1px 8px rgba(255, 255, 255, 0.25)" 
              : "0 1px 8px rgba(24, 24, 27, 0.25)"
        }}
      />

      {/* Dynamic interactive hover dotted background */}
      <div 
        id="interactive-glow-bg" 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          "--mouse-x": "50vw",
          "--mouse-y": "50vh",
        } as React.CSSProperties}
      >
        {/* Ambient background lighting spotlight */}
        <div 
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${
              theme === "green" 
                ? "rgba(34, 197, 94, 0.055)" 
                : theme === "dark" 
                  ? "rgba(255, 255, 255, 0.015)" 
                  : "rgba(24, 24, 27, 0.025)"
            }, transparent 100%)`
          }}
        />

        {/* Base sub-opacity background dots */}
        <div className="absolute inset-0 clean-dots-background opacity-35" />

        {/* Dynamic focused glowing dots on cursor hover */}
        <div 
          className="absolute inset-0 clean-dots-background transition-opacity duration-300"
          style={{
            maskImage: "radial-gradient(240px circle at var(--mouse-x) var(--mouse-y), black 10%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(240px circle at var(--mouse-x) var(--mouse-y), black 10%, transparent 80%)",
            opacity: theme === "green" ? 1.0 : theme === "dark" ? 0.9 : 0.8,
            filter: theme === "green" 
              ? "drop-shadow(0 0 2px rgba(34, 197, 94, 0.75))"
              : theme === "dark"
                ? "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
                : "drop-shadow(0 0 2px rgba(24, 24, 27, 0.25))",
          }}
        />
      </div>

      {/* Grid lines layout with low opacity for depth */}
      <div className="fixed inset-0 pointer-events-none clean-grid-lines opacity-100 z-0"></div>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        setSecurePortalActive={setSecurePortalActive}
        securePortalActive={securePortalActive}
      />

      <main className="flex-grow pt-18 relative z-10">
        {securePortalActive ? (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <AdminPanel
              theme={theme}
              services={services}
              projects={projects}
              refreshData={fetchDynamicData}
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="relative min-h-[90vh] lg:h-[85vh] w-full flex items-center border-b border-zinc-800/15 overflow-hidden">
                  <div className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-0 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
                    
                    {/* Left text column */}
                    <div className="lg:col-span-7 flex flex-col justify-center text-left">
                      <div className="inline-flex self-start items-center space-x-2 border px-3 py-1 mb-6 transition-all duration-200 border-zinc-805 bg-zinc-900/10 hover:border-zinc-700/60 font-mono">
                        <Terminal size={12} className={theme === "green" ? "text-green-400" : "text-zinc-500"} />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                          Digital Engineering Node: Itahari
                        </span>
                      </div>

                      <h1 className="font-sans font-bold text-4xl sm:text-6xl tracking-tight uppercase leading-none mb-6">
                        TechMantra <span className={theme === "green" ? "text-green-400" : "text-zinc-500"}>Nepal</span>
                      </h1>

                      <p className="font-sans text-sm sm:text-base text-zinc-500 max-w-xl mb-8 font-light leading-relaxed">
                        Forging minimalist design structures and micro-engineered solutions. We build durable digital instruments for growth.
                      </p>

                      <div className="flex flex-wrap gap-4 pointer-events-auto">
                        <button
                          onClick={() => setActiveTab("services")}
                          className={`font-mono text-xs uppercase tracking-widest py-3 px-6 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-bold ${
                            theme === "green"
                              ? "bg-green-600 text-zinc-950 hover:bg-green-500"
                              : theme === "dark"
                                ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                                : "bg-zinc-950 text-white hover:bg-zinc-900"
                          }`}
                        >
                          Discover Services
                        </button>
                        <button
                          onClick={() => setActiveTab("about")}
                          className={`font-mono text-xs uppercase tracking-widest py-3 px-6 border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
                            theme === "dark"
                              ? "border-zinc-800 hover:bg-zinc-900/50"
                              : theme === "green"
                                ? "border-green-800 text-green-400 hover:bg-green-950/20"
                                : "border-zinc-300 hover:bg-zinc-50"
                          }`}
                        >
                          Our Studio
                        </button>
                      </div>
                    </div>

                    {/* Right interactive column: 3D Holographic Model Container */}
                    <div className="lg:col-span-5 w-full h-[380px] sm:h-[450px] lg:h-[500px] relative flex items-center justify-center">
                      <div className="absolute inset-0 w-full h-full rounded-2xl border border-zinc-800/20 bg-zinc-950/15 backdrop-blur-sm overflow-hidden shadow-2xl">
                        {/* Interactive Hologram Indicator HUD */}
                        <div className="absolute top-4 left-4 z-20 flex items-center space-x-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500 select-none">
                          <span className={`w-1.5 h-1.5 rounded-full ${theme === "green" ? "bg-green-400 animate-pulse" : "bg-zinc-400 animate-pulse"}`}></span>
                          <span>3D HOLO_PERSPECTIVE</span>
                        </div>
                        <div className="absolute top-4 right-4 z-20 font-mono text-[9px] uppercase tracking-wider text-zinc-600 select-none">
                          NODE_09_HOLO
                        </div>

                        <TorusKnotCanvas theme={theme} />

                        {/* Bottom holographic trace HUD */}
                        <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between font-mono text-[8px] uppercase tracking-wider text-zinc-500/80">
                          <span>SYS_INTEGRITY: 100%</span>
                          <span>RENDER: COMPLETED</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Social Proof & Trust Signals Section */}
                <div className={`border-b ${
                  theme === "dark" 
                    ? "border-zinc-900 bg-[#09090b]/40" 
                    : theme === "green" 
                      ? "border-green-950/20 bg-green-950/5" 
                      : "border-zinc-200/60 bg-zinc-50/50"
                } py-12 px-6 md:px-12`}>
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Key Stats subgrid */}
                    <div className="lg:col-span-5 space-y-6">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                          Verified Integrity
                        </span>
                        <h2 className="font-sans font-bold text-xl uppercase tracking-tight mt-1 mb-2">
                          Performance Stats & Metrics
                        </h2>
                        <p className="font-sans text-xs text-zinc-500 leading-relaxed max-w-sm font-light">
                          Our operations run on strict, SLA-backed performance criteria, validating absolute tech authenticity.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: "120+", label: "Systems Deployed", detail: "KTM, Pokhara & global nodes", unit: "delivered" },
                          { value: "99.98%", label: "System Uptime SLA", detail: "Container auto-restores", unit: "uptime" },
                          { value: "5,000+", label: "Engineers Mentored", detail: "Core skills upgrade paths", unit: "trained" },
                          { value: "15ms", label: "Broker Latency", detail: "Ultra-slim CJS routing", unit: "response" }
                        ].map((stat, sIdx) => (
                          <div 
                            key={sIdx}
                            className={`border p-4 transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-800 ${cardBgClass()}`}
                          >
                            <div className="flex items-baseline space-x-1">
                              <span className={`font-sans font-extrabold text-2xl tracking-normal ${
                                theme === "green" ? "text-green-400" : "text-zinc-900 dark:text-zinc-100"
                              }`}>
                                {stat.value}
                              </span>
                              <span className="font-mono text-[8px] text-zinc-500 font-light lowercase">
                                {stat.unit}
                              </span>
                            </div>
                            <h4 className="font-sans font-semibold text-[10px] uppercase tracking-wide text-zinc-400 mt-1">
                              {stat.label}
                            </h4>
                            <p className="font-mono text-[9px] text-zinc-650 mt-0.5 font-light leading-none">
                              {stat.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Client Logos ticker/grid */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex justify-between items-end border-b border-dashed border-zinc-200/10 pb-4">
                        <div>
                          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                            Partner Ecosystem
                          </span>
                          <h3 className="font-sans font-bold text-base uppercase tracking-tight mt-1">
                            Enterprise Integrations
                          </h3>
                        </div>
                        <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest hidden sm:inline">
                          LIVE_CONTRACTS
                        </span>
                      </div>

                      {/* Infinite marquee logo ribbon container */}
                      <div className="w-full relative overflow-hidden py-1 border-y border-zinc-200/5 mt-4">
                        {/* Edge fade gradients */}
                        <div className={`absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r ${
                          theme === "green" 
                            ? "from-[#030a05]" 
                            : theme === "dark" 
                              ? "from-[#09090b]" 
                              : "from-[#fcfcfc]"
                        } to-transparent z-10 pointer-events-none`} />
                        <div className={`absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l ${
                          theme === "green" 
                            ? "from-[#030a05]" 
                            : theme === "dark" 
                              ? "from-[#09090b]" 
                              : "from-[#fcfcfc]"
                        } to-transparent z-10 pointer-events-none`} />

                        <div className="flex overflow-hidden">
                          <div className="animate-marquee-ribbon flex items-center space-x-4 py-2">
                            {[...Array(4)].flatMap(() => [
                              { title: "Koshi Fintech", desc: "Digital Ledgers", prefix: "KO_FT" },
                              { title: "Sagarmatha Labs", desc: "System Audits", prefix: "SG_LB" },
                              { title: "Alpine Code", desc: "Interface Engine", prefix: "AL_CD" },
                              { title: "Himalayan Ledger", desc: "Relational States", prefix: "HM_LD" },
                              { title: "Adhikari & Co", desc: "Automations Node", prefix: "AD_CO" },
                              { title: "Sunsari Secure", desc: "Telemetry Pipes", prefix: "SN_SC" }
                            ]).map((client, cIdx) => (
                              <div
                                key={cIdx}
                                className={`border p-4 flex flex-col justify-between w-56 h-24 hover:border-zinc-400 dark:hover:border-zinc-750 transition-all duration-300 relative overflow-hidden shrink-0 group ${cardBgClass()}`}
                              >
                                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300">
                                  <Terminal size={60} />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                    theme === "green"
                                      ? "bg-green-950/40 border-green-900/60 text-green-400"
                                      : "bg-zinc-950/40 border-zinc-900/60 text-zinc-400"
                                  }`}>
                                    {client.prefix}
                                  </span>
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 animate-pulse"></div>
                                </div>

                                <div>
                                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-150 leading-tight">
                                    {client.title}
                                  </h4>
                                  <p className="font-mono text-[9px] text-zinc-500 font-light mt-0.5">
                                    {client.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <section className="max-w-7xl mx-auto px-6 py-12">
                  {/* Philosophy Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t pt-16 border-zinc-200/5">
                    <motion.div 
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`p-6 border transition-all duration-300 ${cardBgClass()}`}
                    >
                      <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest flex items-center space-x-1.5">
                        <Shield size={10} className={theme === "green" ? "text-green-400 animate-pulse" : "text-zinc-500"} />
                        <span>01 / PHILOSOPHY</span>
                      </span>
                      <h3 className="font-sans font-bold text-base uppercase mt-3 mb-3">
                        Absolute Precision
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light">
                        Eliminating ambient design noise to let underlying engineering principles emerge clearly. Our layouts are calculated, not guessed.
                      </p>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`p-6 border transition-all duration-300 ${cardBgClass()}`}
                    >
                      <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest flex items-center space-x-1.5">
                        <Zap size={10} className={theme === "green" ? "text-green-400" : "text-zinc-500"} />
                        <span>02 / CAPABILITY</span>
                      </span>
                      <h3 className="font-sans font-bold text-base uppercase mt-3 mb-3">
                        High Performance
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light">
                        Leveraging lightweight reactive core technologies to deliver lightning-fast interactive metrics for both mobile and web terminals.
                      </p>
                    </motion.div>

                    <motion.div 
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className={`p-6 border transition-all duration-300 ${cardBgClass()}`}
                    >
                      <span className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest flex items-center space-x-1.5">
                        <Layers2 size={10} className={theme === "green" ? "text-green-400 animate-pulse" : "text-zinc-500"} />
                        <span>03 / INTEGRATION</span>
                      </span>
                      <h3 className="font-sans font-bold text-base uppercase mt-3 mb-3">
                        Seamless Syncing
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light">
                        Distributed persistence models connecting local configurations to global cloud backends, guaranteeing secure failover capabilities.
                      </p>
                    </motion.div>
                  </div>

                  {/* Operational Metrics Panel */}
                  <div className="mt-20 border-t pt-16 border-zinc-200/5">
                    <div className="mb-10 text-center sm:text-left">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Quantitative Proof
                      </span>
                      <h2 className="font-sans font-bold text-xl uppercase tracking-tight mt-1">
                        System Integrity & Metrics
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { title: "Edge Deployment Uptime", val: "99.98%", sub: "Aggregated regional uptime node measurement matrix.", icon: Activity },
                        { title: "Dynamic Compilation", val: "< 14ms", sub: "Modular hot-relink intervals across standard endpoints.", icon: Zap },
                        { title: "Instruments Deployed", val: "140+", sub: "Verified active layouts and custom engineered software stacks.", icon: Award }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.1 }}
                          whileHover={{ scale: 1.015, y: -2, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                          className={`p-6 border flex flex-col justify-between transition-colors duration-300 ${cardBgClass()}`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                                {item.title}
                              </h4>
                              <item.icon size={12} className={theme === "green" ? "text-green-400" : "text-zinc-400"} />
                            </div>
                            <div className={`font-sans font-extrabold text-3xl sm:text-4xl tracking-tighter mb-2 ${
                              theme === "green" ? "text-green-400 text-glow-green" : "text-slate-100"
                            }`}>
                              {item.val}
                            </div>
                          </div>
                          <p className="font-sans text-[11px] text-zinc-500 leading-normal font-light">
                            {item.sub}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Core Tech Stack Matrix */}
                  <div className="mt-24 border-t pt-16 border-zinc-200/5">
                    <div className="mb-12 text-center">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Architectural Foundations
                      </span>
                      <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-1">
                        Selected Service Stack Matrix
                      </h2>
                      <p className="font-sans text-xs text-zinc-500 max-w-xl mx-auto mt-2 leading-relaxed font-light">
                        We assemble modern, high-grade utilities avoiding superficial dependencies to keep client software fast, secure, and easily maintainable.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { name: "React 19 Core Engine", desc: "Interactive Virtual Trees executing responsive DOM micro-refresh logic.", badge: "UI / UX Assemblies", tech: "Hooks & Transitions", icon: Code2 },
                        { name: "Node.js & Express Nodes", desc: "Super-compact backend controllers managing dynamic schemas and REST handlers.", badge: "Edge Platforms", tech: "Asynchronous APIs", icon: Terminal },
                        { name: "Tailwind Styling Tokens", desc: "Zero runtime overhead, optimized utility coordinates for screen density adapting.", badge: "Layout Fluidity", tech: "Fluid Tokens", icon: Palette },
                        { name: "Relational Supabase Models", desc: "Cloud persistent SQL structure delivering verified distributed persistence properties.", badge: "Database Layer", tech: "Postgres Schemas", icon: Layers2 },
                        { name: "D3 & High Definition Canvas", desc: "Fluid 3D models and spatial data visualizers running at hardware canvas speed.", badge: "Visualization Node", tech: "Calculated Geometry", icon: Activity },
                        { name: "Motion & Micro Animations", desc: "Silky hardware accelerated spring transitions with precise cubic timing layers.", badge: "Micro Interaction", tech: "Spring Mechanics", icon: Zap }
                      ].map((tech, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.98 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 450, damping: 22 } }}
                          className={`p-6 border transition-all duration-300 relative group overflow-hidden ${cardBgClass()}`}
                        >
                          {/* Top row */}
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-[9px] uppercase border px-2 py-0.5 tracking-wider border-zinc-800 text-zinc-500 matches-theme">
                              {tech.badge}
                            </span>
                            <tech.icon size={13} className="text-zinc-500 group-hover:text-green-400 transition-colors duration-200" />
                          </div>

                          <h3 className="font-sans font-bold text-sm uppercase tracking-tight mb-2">
                            {tech.name}
                          </h3>
                          <p className="font-sans text-xs text-zinc-500 font-light leading-relaxed mb-4">
                            {tech.desc}
                          </p>

                          <div className="border-t pt-3 border-zinc-200/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                            <span>{tech.tech}</span>
                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Timeline Block */}
                  <div className="mt-24 border-t pt-16 border-zinc-200/5 mb-12">
                    <div className="text-center mb-16">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                        Operational Flow
                      </span>
                      <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-1">
                        Deployment Life Cycle
                      </h2>
                    </div>

                    <div className="relative">
                      {/* Central trace line */}
                      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-850/50 hidden lg:block -translate-y-1/2"></div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                        {[
                          { step: "01", name: "System Formulation", action: "Architectural consultation mapping core parameters & technical metrics.", icon: Shield },
                          { step: "02", name: "Responsive Layouts", action: "Drafting typographic flow, grid columns & responsive structures.", icon: Workflow },
                          { step: "03", name: "Data Sync Implementation", action: "Deploying relational tables, fast endpoints & API synchronization.", icon: Binary },
                          { step: "04", name: "Production Release", action: "Deploying production ready bundles over globally distributed networks.", icon: Award }
                        ].map((node, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.15 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-6 border text-left bg-[#09090b]/40 backdrop-blur-md relative ${cardBgClass()}`}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-mono text-xs font-bold text-zinc-500 border border-zinc-800/40 w-6 h-6 flex items-center justify-center rounded-none">
                                {node.step}
                              </span>
                              <node.icon size={12} className={theme === "green" ? "text-green-400" : "text-zinc-500"} />
                            </div>

                            <h4 className="font-sans font-bold text-xs uppercase tracking-tight mb-2">
                              {node.name}
                            </h4>
                            <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                              {node.action}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Elegant About Us Summary section on Home Screen */}
                  <div className="mt-28 border-t pt-16 border-zinc-200/5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-6 space-y-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                          About Us Summary
                        </span>
                        <h2 className="font-sans font-bold text-2xl uppercase tracking-tight">
                          Crafting Elite Digital Instruments In Nepal
                        </h2>
                        <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                          Founded in Itahari, TechMantra Nepal stands at the intersection of mathematical layout discipline and high-efficiency core backend architecture. We eliminate unnecessary framework complexity, delivering zero-bloat applications designed for commercial scaling.
                        </p>
                        <p className="font-sans text-xs text-zinc-500 font-light leading-relaxed">
                          Our systems are engineered to withstand peak stress loads while retaining pixel-perfect alignment. We translate complex business matrices into direct, high-performance visual solutions.
                        </p>
                        <div className="pt-2">
                          <button 
                            onClick={() => { setActiveTab("about"); window.scrollTo({top: 0, behavior: "smooth"}); }}
                            className={`font-mono text-[9px] uppercase tracking-widest py-2 px-4 border ${
                              theme === "green" 
                                ? "border-green-800 text-green-400 hover:bg-green-950/20" 
                                : "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
                            }`}
                          >
                            Read Our Genesis Story
                          </button>
                        </div>
                      </div>
                      <div className="lg:col-span-1"></div>
                      <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className={`p-5 border ${cardBgClass()}`}>
                          <h4 className={`font-sans font-extrabold text-2xl mb-1 uppercase ${theme === "green" ? "text-green-400" : "text-white"}`}>24h</h4>
                          <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SLA Turnaround</p>
                          <p className="font-sans text-xs text-zinc-500 mt-2 font-light">Prompt node synchronization across active build pipelines.</p>
                        </div>
                        <div className={`p-5 border ${cardBgClass()}`}>
                          <h4 className={`font-sans font-extrabold text-2xl mb-1 uppercase ${theme === "green" ? "text-green-400" : "text-white"}`}>100%</h4>
                          <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Zero Bloat Specs</p>
                          <p className="font-sans text-xs text-zinc-500 mt-2 font-light">Every package is vetted manually, eliminating unread scripts.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Showcase / Gallery Section on Home Screen */}
                  <div className="mt-28 border-t pt-16 border-zinc-200/5">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                          Portfolio Showcase
                        </span>
                        <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-1">
                          Recent Solutions & Deployments
                        </h2>
                      </div>
                      <span className="font-mono text-xs text-zinc-500 max-w-xs mt-2 md:mt-0 font-light">
                        A curated showcase of verified web applications, telemetry panels, and database integrations.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.length > 0 ? (
                        projects.slice(0, 3).map((proj) => (
                          <div
                            key={proj.id}
                            className={`border p-6 flex flex-col justify-between group transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700 h-80 relative overflow-hidden ${cardBgClass()}`}
                          >
                            <div>
                              <div className="flex justify-between items-center mb-4">
                                <span className={`font-mono text-[9px] uppercase border px-2 py-0.5 tracking-wider font-semibold ${
                                  theme === "green" 
                                    ? "bg-green-950/30 border-green-900/50 text-green-400" 
                                    : "bg-zinc-950/40 border-zinc-900/60 text-zinc-400"
                                }`}>
                                  {proj.category}
                                </span>
                                <span className="font-mono text-[8px] text-zinc-500">LIVE NODE</span>
                              </div>
                              <h3 className="font-sans font-bold text-base uppercase tracking-tight mb-2 group-hover:text-emerald-500 transition-colors">
                                {proj.title}
                              </h3>
                              <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light mb-4 line-clamp-4">
                                {proj.description}
                              </p>
                            </div>
                            
                            <div className="border-t pt-4 border-zinc-200/5 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                              <span className="font-light">SLA: 99.99% Guaranteed</span>
                              <span className="flex items-center space-x-1 uppercase tracking-widest text-[9px]">
                                <span>Launch</span>
                                <ArrowUpRight size={10} />
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Fallback mock content if DB returns empty temporarily
                        [
                          { title: "Koshi Digital Ledger", cat: "Fintech Platform", desc: "A relational, transaction-certified ledger sync engine designed under strict audit configurations." },
                          { title: "Alpine API Infrastructure", cat: "Backend Gateway", desc: "A light, scale-to-zero container node delivering microsecond communication times." },
                          { title: "Himalayan Sync Router", cat: "Database Sync", desc: "Syncs offline local storage assets with Postgres databases immediately upon reconnecting." }
                        ].map((mockProj, index) => (
                          <div
                            key={index}
                            className={`border p-6 flex flex-col justify-between group transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700 h-80 relative overflow-hidden ${cardBgClass()}`}
                          >
                            <div>
                              <div className="flex justify-between items-center mb-4">
                                <span className={`font-mono text-[9px] uppercase border px-2 py-0.5 tracking-wider font-semibold ${
                                  theme === "green" 
                                    ? "bg-green-950/30 border-green-900/50 text-green-400" 
                                    : "bg-zinc-950/40 border-zinc-900/60 text-zinc-400"
                                }`}>
                                  {mockProj.cat}
                                </span>
                                <span className="font-mono text-[8px] text-zinc-500">VERIFIED INSTANCE</span>
                              </div>
                              <h3 className="font-sans font-bold text-base uppercase tracking-tight mb-2">
                                {mockProj.title}
                              </h3>
                              <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light mb-4">
                                {mockProj.desc}
                              </p>
                            </div>
                            <div className="border-t pt-4 border-zinc-200/5 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                              <span className="font-light">SLA: 99.99%</span>
                              <span className="flex items-center space-x-1 uppercase tracking-widest text-[9px] text-zinc-400">
                                <span>Production ready</span>
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* TechMantra System Configurator & Estimator Section */}
                  <div className="mt-28 border-t pt-16 border-zinc-200/5">
                    <div className="text-center max-w-xl mx-auto mb-12">
                      <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                        Interactive planner
                      </span>
                      <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-1">
                        System Architect & Cost Estimator
                      </h2>
                      <p className="font-sans text-xs text-zinc-500 mt-2 font-light">
                        Select your platform attributes, database layers, and target workload metrics to dynamically simulate live latency benchmarks, bundle packaging sizes, and implementation timelines.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
                      {/* Left Side: Parameters Toggles */}
                      <div className={`lg:col-span-6 border p-6 flex flex-col justify-between ${cardBgClass()}`}>
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4 flex items-center space-x-2">
                              <Cpu size={14} className="text-zinc-400" />
                              <span>1. Database & Persistence Layer</span>
                            </h3>
                            <div className="grid grid-cols-3 gap-2.5">
                              {[
                                { id: "postgres", label: "PostgreSQL Sync", desc: "Durable Cloud SQL" },
                                { id: "sqlite", label: "SQLite Local", desc: "File-based Cache" },
                                { id: "client", label: "Client Only", desc: "No Database" }
                              ].map((db) => (
                                <button
                                  key={db.id}
                                  type="button"
                                  onClick={() => setCfgStorageType(db.id as any)}
                                  className={`p-3 border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                                    cfgStorageType === db.id
                                      ? theme === "green"
                                        ? "border-green-500 bg-green-950/20 text-green-400"
                                        : "border-zinc-400 bg-zinc-950/40 text-white"
                                      : "border-zinc-800/40 text-zinc-500 hover:border-zinc-500/60 hover:text-zinc-300"
                                  }`}
                                >
                                  <span className="font-sans font-bold text-[10px] uppercase tracking-wider">{db.label}</span>
                                  <span className="font-mono text-[8px] opacity-75 mt-1 leading-tight">{db.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4 flex items-center space-x-2">
                              <Shield size={14} className="text-zinc-400" />
                              <span>2. Performance & Security Extensions</span>
                            </h3>
                            <div className="space-y-3">
                              {/* Toggle 1: Caching */}
                              <label className="flex items-center justify-between p-3 border border-zinc-800/40 hover:border-zinc-700/60 cursor-pointer select-none">
                                <div className="flex items-start space-x-3">
                                  <input 
                                    type="checkbox" 
                                    checked={cfgCaching} 
                                    onChange={(e) => setCfgCaching(e.target.checked)}
                                    className="mt-0.5 accent-emerald-500 cursor-pointer"
                                  />
                                  <div>
                                    <div className="font-sans font-bold text-[10px] uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Global CDN & Redis Caching</div>
                                    <div className="font-mono text-[8px] text-zinc-500">Injects edge networks. Decreases core transaction latency by up to 10ms.</div>
                                  </div>
                                </div>
                                <span className="font-mono text-[9px] text-emerald-400 font-bold">-10ms</span>
                              </label>

                              {/* Toggle 2: Security */}
                              <label className="flex items-center justify-between p-3 border border-zinc-800/40 hover:border-zinc-700/60 cursor-pointer select-none">
                                <div className="flex items-start space-x-3">
                                  <input 
                                    type="checkbox" 
                                    checked={cfgSecurity} 
                                    onChange={(e) => setCfgSecurity(e.target.checked)}
                                    className="mt-0.5 accent-emerald-500 cursor-pointer"
                                  />
                                  <div>
                                    <div className="font-sans font-bold text-[10px] uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Row-Level Security (RLS) & JWT Auths</div>
                                    <div className="font-mono text-[8px] text-zinc-500">Applies cryptographically signed verification layers to backend requests.</div>
                                  </div>
                                </div>
                                <span className="font-mono text-[9px] text-zinc-500">+2ms</span>
                              </label>

                              {/* Toggle 3: Telemetry */}
                              <label className="flex items-center justify-between p-3 border border-zinc-800/40 hover:border-zinc-700/60 cursor-pointer select-none">
                                <div className="flex items-start space-x-3">
                                  <input 
                                    type="checkbox" 
                                    checked={cfgTelemetry} 
                                    onChange={(e) => setCfgTelemetry(e.target.checked)}
                                    className="mt-0.5 accent-emerald-500 cursor-pointer"
                                  />
                                  <div>
                                    <div className="font-sans font-bold text-[10px] uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Live Telemetry & Logs Pipeline</div>
                                    <div className="font-mono text-[8px] text-zinc-500">Synchronizes real-time performance ingestion metrics directly to analytics dashboard.</div>
                                  </div>
                                </div>
                                <span className="font-mono text-[9px] text-zinc-500">+3ms</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                                <Activity size={14} className="text-zinc-400" />
                                <span>3. Expected Workload Load-Scale</span>
                              </h3>
                              <span className="font-mono text-[10px] text-zinc-400 font-bold">
                                {cfgLoadMultiplier * 250} req / min
                              </span>
                            </div>
                            <input 
                              type="range" 
                              min="4" 
                              max="100" 
                              value={cfgLoadMultiplier} 
                              onChange={(e) => setCfgLoadMultiplier(parseInt(e.target.value))}
                              className="w-full h-1.5 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between font-mono text-[8px] text-zinc-500 mt-1 uppercase">
                              <span>Low Overhead (1k req)</span>
                              <span>Enterprise Load (25k req)</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-zinc-200/5 pt-6 mt-6 flex items-center justify-between font-mono text-[10px]">
                          <span className="text-zinc-500 uppercase">Config ID: SYS_MANTRA_{cfgStorageType.toUpperCase()}_{cfgLoadMultiplier}</span>
                          <span className="text-emerald-500 font-bold flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>VALID ARCHITECTURE</span>
                          </span>
                        </div>
                      </div>

                      {/* Right Side: Benchmark HUD Panel */}
                      <div className="lg:col-span-6 bg-[#020202]/95 border border-zinc-900 p-6 flex flex-col justify-between select-none">
                        <div>
                          {/* HUD OS Terminal Bar */}
                          <div className="border-b border-zinc-800 pb-3 mb-6 flex items-center justify-between font-mono text-[10px] text-zinc-500">
                            <span>MANTRA_ANALYTICS_V2.0</span>
                            <span className="text-zinc-700 animate-pulse">● CALIBRATING</span>
                          </div>

                          {/* Dynamic Benchmark Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Card 1: Latency */}
                            <div className="border border-zinc-800/80 p-4 bg-zinc-950/40 relative overflow-hidden group">
                              <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Projected Latency</span>
                              <div className="flex items-baseline space-x-1 mt-1">
                                <span className="font-sans font-extrabold text-3xl text-white">
                                  {Math.max(2, Math.round(15 + (cfgStorageType === "postgres" ? 8 : cfgStorageType === "sqlite" ? 4 : 0) + (cfgSecurity ? 2 : 0) + (cfgTelemetry ? 3 : 0) - (cfgCaching ? 10 : 0) + (cfgLoadMultiplier * 0.12)))}
                                </span>
                                <span className="font-mono text-[10px] text-zinc-500">ms</span>
                              </div>
                              <div className="w-full h-[2px] bg-zinc-900 mt-3 relative overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 transition-all duration-500"
                                  style={{ 
                                    width: `${Math.min(100, Math.max(10, (100 - Math.max(2, Math.round(15 + (cfgStorageType === "postgres" ? 8 : cfgStorageType === "sqlite" ? 4 : 0) + (cfgSecurity ? 2 : 0) + (cfgTelemetry ? 3 : 0) - (cfgCaching ? 10 : 0) + (cfgLoadMultiplier * 0.12))) * 2)))}%` 
                                  }}
                                />
                              </div>
                            </div>

                            {/* Card 2: Bundle Size */}
                            <div className="border border-zinc-800/80 p-4 bg-zinc-950/40 relative overflow-hidden group">
                              <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Bundle Payload</span>
                              <div className="flex items-baseline space-x-1 mt-1">
                                <span className="font-sans font-extrabold text-3xl text-white">
                                  {45 + (cfgStorageType === "postgres" ? 65 : cfgStorageType === "sqlite" ? 30 : 0) + (cfgSecurity ? 18 : 0) + (cfgTelemetry ? 25 : 0) + (cfgCaching ? 12 : 0)}
                                </span>
                                <span className="font-mono text-[10px] text-zinc-500">KB</span>
                              </div>
                              <div className="w-full h-[2px] bg-zinc-900 mt-3 relative overflow-hidden">
                                <div 
                                  className="h-full bg-sky-500 transition-all duration-500"
                                  style={{ 
                                    width: `${Math.min(100, Math.max(15, ((45 + (cfgStorageType === "postgres" ? 65 : cfgStorageType === "sqlite" ? 30 : 0) + (cfgSecurity ? 18 : 0) + (cfgTelemetry ? 25 : 0) + (cfgCaching ? 12 : 0)) / 2.2)))}%` 
                                  }}
                                />
                              </div>
                            </div>

                            {/* Card 3: SLA Uptime */}
                            <div className="border border-zinc-800/80 p-4 bg-zinc-950/40 relative overflow-hidden group">
                              <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Guaranteed SLA</span>
                              <div className="flex items-baseline space-x-1 mt-1">
                                <span className="font-sans font-extrabold text-2xl text-white">
                                  {cfgStorageType === "client" ? "100.00" : cfgCaching && cfgTelemetry ? "99.999" : cfgTelemetry ? "99.95" : "99.90"}
                                </span>
                                <span className="font-mono text-[10px] text-zinc-500">%</span>
                              </div>
                              <div className="w-full h-[2px] bg-zinc-900 mt-3 relative overflow-hidden">
                                <div 
                                  className="h-full bg-amber-500 transition-all duration-500"
                                  style={{ width: cfgStorageType === "client" ? "100%" : cfgCaching && cfgTelemetry ? "99%" : "90%" }}
                                />
                              </div>
                            </div>

                            {/* Card 4: Dev Estimate */}
                            <div className="border border-zinc-800/80 p-4 bg-zinc-950/40 relative overflow-hidden group">
                              <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-500">Delivery Window</span>
                              <div className="flex items-baseline space-x-1 mt-1">
                                <span className="font-sans font-extrabold text-3xl text-white">
                                  {7 + (cfgStorageType === "postgres" ? 6 : cfgStorageType === "sqlite" ? 4 : 0) + (cfgSecurity ? 2 : 0) + (cfgTelemetry ? 3 : 0) + (cfgCaching ? 1 : 0) + Math.round(cfgLoadMultiplier / 25)}
                                </span>
                                <span className="font-mono text-[10px] text-zinc-500">Days</span>
                              </div>
                              <div className="w-full h-[2px] bg-zinc-900 mt-3 relative overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500 transition-all duration-500"
                                  style={{ 
                                    width: `${Math.min(100, Math.max(20, (7 + (cfgStorageType === "postgres" ? 6 : cfgStorageType === "sqlite" ? 4 : 0) + (cfgSecurity ? 2 : 0) + (cfgTelemetry ? 3 : 0) + (cfgCaching ? 1 : 0) + Math.round(cfgLoadMultiplier / 25)) * 4))}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Interactive JSON Live schema payload inspector */}
                          <div className="border border-zinc-900 mt-6 bg-[#030303] p-4 font-mono text-[10px] relative">
                            <span className="absolute top-2 right-3 text-[8px] text-zinc-600">JSON_PAYLOAD</span>
                            <pre className="text-zinc-400 overflow-x-auto whitespace-pre">
{`{
  "node_origin": "ITR_HQ_MAIN_09",
  "data_engine": "${cfgStorageType === "postgres" ? "PostgreSQL / Cloud SQL" : cfgStorageType === "sqlite" ? "SQLite / Drizzle CJS" : "Client Memory"}",
  "capabilities": {
    "caching": ${cfgCaching ? "true" : "false"},
    "security_rls": ${cfgSecurity ? "true" : "false"},
    "realtime_telemetry": ${cfgTelemetry ? "true" : "false"}
  },
  "workload_metric": "${cfgLoadMultiplier * 250} req/min",
  "projected_latency": "${Math.max(2, Math.round(15 + (cfgStorageType === "postgres" ? 8 : cfgStorageType === "sqlite" ? 4 : 0) + (cfgSecurity ? 2 : 0) + (cfgTelemetry ? 3 : 0) - (cfgCaching ? 10 : 0) + (cfgLoadMultiplier * 0.12)))}ms"
}`}
                            </pre>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button
                            onClick={() => { setActiveTab("contact"); window.scrollTo({top: 0, behavior: "smooth"}); }}
                            className={`w-full py-3.5 px-6 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center justify-center space-x-2.5 transition-all duration-300 focus:outline-none cursor-pointer ${
                              theme === "green"
                                ? "bg-green-600 text-zinc-950 hover:bg-green-500"
                                : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                            }`}
                          >
                            <span>Request This Architecture Build</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonials / Client Reviews Section linked on Home */}
                  <div className="mt-28 border-t pt-16 border-zinc-200/5">
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      Client Reviews
                    </span>
                    <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-2 mb-10">
                      Trusted Appraisals & Testimonials
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          rating: 5,
                          reviewer: "Abhishek Adhikari",
                          role: "Lead of Infrastructure, Koshi Fintech",
                          text: "TechMantra re-architected our legacy digital ledger systems. We reduced our page response delays to under 20ms and completely eliminated communication bottlenecks.",
                          stamp: "KATHMANDU, NP",
                          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                        },
                        {
                          rating: 5,
                          reviewer: "Pema Sherpa",
                          role: "Founder, Alpine Organics Nepal",
                          text: "The team delivered a pristine, high-contrast responsive interface. Our conversion rates climbed by 34% within the first month. Amazing attention to typographic rhythm.",
                          stamp: "POKHARA, NP",
                          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                        },
                        {
                          rating: 5,
                          reviewer: "Niranjan Gupta",
                          role: "Technical Coordinator, Sagarmatha Solutions",
                          text: "Their container-native autoscaling builds are incredibly durable. Zero outages during peak traffic loads and immaculate API specification documentation.",
                          stamp: "ITAHARI, NP",
                          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop"
                        }
                      ].map((rev, rIdx) => (
                        <div
                          key={rIdx}
                          className={`border p-6 flex flex-col justify-between transition-all duration-200 ${cardBgClass()}`}
                        >
                          <div>
                            <div className="flex items-center space-x-1 mb-4">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Sparkles key={i} size={11} className={theme === "green" ? "text-green-400" : "text-amber-500"} />
                              ))}
                            </div>
                            <p className="font-sans text-xs italic text-zinc-400 leading-relaxed font-light mb-6">
                              "{rev.text}"
                            </p>
                          </div>
                          <div className="border-t pt-4 border-zinc-200/10 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <img
                                src={rev.image}
                                alt={rev.reviewer}
                                referrerPolicy="no-referrer"
                                className={`w-9 h-9 rounded-full object-cover border ${
                                  theme === "green" 
                                    ? "border-green-800/40" 
                                    : "border-zinc-800"
                                }`}
                              />
                              <div>
                                <h5 className="font-sans font-bold text-[11px] uppercase tracking-wide text-zinc-200">
                                  {rev.reviewer}
                                </h5>
                                <p className="font-mono text-[9px] text-zinc-500">
                                  {rev.role}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-[9px] text-zinc-500 tracking-wider self-end">
                              {rev.stamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Blog Posts / News Feed Section */}
                  <div className="mt-28 border-t pt-16 border-zinc-200/5">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                          News Feed
                        </span>
                        <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-1">
                          Latest Blog Posts & DevLog
                        </h2>
                      </div>
                      <span className="font-mono text-xs text-zinc-500 max-w-xs mt-2 md:mt-0 font-light">
                        Recent publications on design rules, performance protocols, and code compilation cycles.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          date: "JUNE 20, 2026",
                          title: "Optimized Node ESModule Bundling benchmarks via esbuild bundles",
                          desc: "How compiling Express backends into a single self-contained CommonJS target drastically lowers cold start delays on production edge containers.",
                          author: "Sumit Khadka",
                          read: "4 min read"
                        },
                        {
                          date: "MAY 14, 2026",
                          title: "Implementing secure Row-Level Security parameters on Postgres schemas",
                          desc: "Step-by-step strategies to configure data data isolation layers directly in federated databases without adding complex, slow node middleware libraries.",
                          author: "Prabhat Shrestha",
                          read: "6 min read"
                        },
                        {
                          date: "APRIL 09, 2026",
                          title: "Eliminating digital layout noise: Why typography pairings drive conversions",
                          desc: "An analytical breakdown of Space Grotesk display headings headings matched with JetBrains Mono code indices to deliver extreme layout rhythm validation in web terminals.",
                          author: "Rejina Adhikari",
                          read: "3 min read"
                        }
                      ].map((post, pIdx) => (
                        <article
                          key={pIdx}
                          className={`border p-6 flex flex-col justify-between group transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-700 ${cardBgClass()}`}
                        >
                          <div>
                            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-3.5 pb-3 border-b border-dashed border-zinc-800/40">
                              <span>{post.date}</span>
                              <span>{post.read}</span>
                            </div>
                            
                            <h3 className="font-sans font-bold text-sm uppercase leading-snug mb-3 group-hover:text-emerald-400 transition-colors">
                              {post.title}
                            </h3>
                            
                            <p className="font-sans text-xs text-zinc-500 font-light leading-relaxed mb-6">
                              {post.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-zinc-200/5 pt-4 mt-auto">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                              By Node Architect: {post.author}
                            </span>
                            <span className="text-zinc-400 group-hover:translate-x-1 transition-transform">
                              <ArrowRight size={12} />
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  {/* FAQ Section (Frequently Asked Questions) on Home Screen */}
                  <div className="mt-28 border-t pt-16 border-zinc-200/5">
                    <div className="text-center max-w-xl mx-auto mb-12">
                      <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                        FAQ Section
                      </span>
                      <h3 className="font-sans font-bold text-2xl uppercase mt-2 tracking-wide text-zinc-900 dark:text-zinc-100">
                        Frequently Asked Questions
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 mt-2 font-light">
                        Explore our deployment patterns, performance optimizations, and backend structure benchmarks.
                      </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                      {architecturalFaqs.map((faq, idx) => {
                        const isOpen = openFaqIndex === idx;
                        return (
                          <div 
                            key={idx}
                            className={`border transition-all duration-300 ${
                              isOpen 
                                ? theme === "green" 
                                  ? "border-green-500/50 shadow-sm shadow-green-500/5" 
                                  : "border-zinc-400 dark:border-zinc-700" 
                                : "border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800"
                            } ${cardBgClass()}`}
                          >
                            <button
                              type="button"
                              className="w-full flex items-center justify-between p-5 text-left font-sans focus:outline-none"
                              onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            >
                              <div className="flex items-center space-x-4 pr-4">
                                <HelpCircle size={16} className={`shrink-0 ${
                                  isOpen 
                                    ? theme === "green" 
                                      ? "text-green-500" 
                                      : "text-zinc-900 dark:text-zinc-250" 
                                    : "text-zinc-500"
                                }`} />
                                <span className={`text-xs sm:text-sm font-medium transition-colors ${
                                  isOpen 
                                    ? "text-white" 
                                    : "text-zinc-400"
                                }`}>
                                  {faq.q}
                                </span>
                              </div>
                              <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="text-zinc-500 shrink-0"
                              >
                                <ChevronDown size={14} />
                              </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5 pt-1 border-t border-zinc-200/5 dark:border-zinc-900/50">
                                    <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                                      {faq.a}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Map & Contact Coordinates */}
                  <div className="mt-28 border-t pt-16 border-zinc-200/5">
                    <div className="text-center max-w-xl mx-auto mb-12">
                      <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                        Interactive Map
                      </span>
                      <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-1">
                        Interactive Nepal Node Map & Contact Details
                      </h2>
                      <p className="font-sans text-xs text-zinc-500 mt-2 font-light">
                        Select nodes on our interactive coordinate system below to inspect localized SLA performance, latencies, and physical addresses.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
                      {/* Map visualization left */}
                      <div className="lg:col-span-7 flex flex-col space-y-4">
                        <div className={`relative w-full h-[340px] border p-1 overflow-hidden bg-zinc-950/20 backdrop-blur-sm ${cardBgClass()}`}>
                          {/* Inner Iframe container exposing Google Maps of Nepal nodes */}
                          <iframe 
                            src={`https://maps.google.com/maps?q=${[
                              "Pokhara,%20Nepal",
                              "Putalisadak,%20Kathmandu,%20Nepal",
                              "Itahari,%20Sunsari,%20Nepal",
                              "Biratnagar,%20Nepal"
                            ][activeMapNode]}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            className={`w-full h-full border-0 transition-all duration-700 ${
                              theme === "dark" 
                                ? "grayscale invert opacity-80 contrast-125 brightness-90 hover:opacity-100 hover:grayscale-0 hover:invert-0 hover:contrast-100 hover:brightness-100" 
                                : theme === "green" 
                                  ? "grayscale invert hue-rotate-140 opacity-80 contrast-115 hover:opacity-100 hover:grayscale-0 hover:invert-0 hover:hue-rotate-0" 
                                  : "opacity-95 hover:opacity-100"
                            }`}
                            allowFullScreen 
                            loading="lazy"
                            title="TechMantra Nepal Infrastructure Map"
                          />

                          {/* Map Compass/Holo HUD overlay details */}
                          <div className="absolute top-4 left-4 bg-zinc-950/80 px-2 py-1 border border-zinc-800/80 font-mono text-[8px] text-zinc-400 select-none z-10">
                            COORD_SYNC: {[
                              "PKR_WEST_04 (Pokhara)",
                              "KTM_CENTRAL_01 (Kathmandu)",
                              "ITR_HQ_MAIN_09 (Itahari HQ)",
                              "BRT_SOUTH_05 (Biratnagar)"
                            ][activeMapNode]}
                          </div>
                          
                          <div className="absolute bottom-4 left-4 bg-zinc-950/80 px-2 py-1 border border-zinc-800/80 font-mono text-[8px] text-zinc-400 flex items-center space-x-1.5 select-none z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            <span>ACTIVE LOGS: INGEST_OK</span>
                          </div>
                        </div>

                        {/* Node selections buttons bar */}
                        <div className="grid grid-cols-4 gap-2 font-mono text-[9px]">
                          {[
                            { id: 0, label: "Pokhara" },
                            { id: 1, label: "Kathmandu" },
                            { id: 2, label: "Itahari (HQ)" },
                            { id: 3, label: "Biratnagar" }
                          ].map((nodeObj) => (
                            <button
                              key={nodeObj.id}
                              type="button"
                              onClick={() => setActiveMapNode(nodeObj.id)}
                              className={`py-2 px-1 border uppercase font-bold text-center tracking-wider transition-all duration-300 ${
                                activeMapNode === nodeObj.id
                                  ? theme === "green"
                                    ? "bg-green-600 border-green-500 text-zinc-950"
                                    : "bg-zinc-150 border-zinc-300 text-zinc-950 dark:bg-zinc-100 dark:border-zinc-750 dark:text-zinc-950"
                                  : "border-zinc-800/40 text-zinc-500 hover:border-zinc-500 hover:text-zinc-250 cursor-pointer"
                              }`}
                            >
                              {nodeObj.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Selected coordinate details right */}
                      <div className="lg:col-span-5 space-y-6 text-left">
                        {[
                          {
                            title: "Pokhara Edge Node",
                            ref: "Node ID: PKR_WEST_04",
                            lat: "Avg Ping: 22ms latency",
                            addr: "Bhimsen Marg, Lakeside Pokhara, Nepal",
                            phone: "+977 61-55XXXX",
                            sla: "SLA Guarantee: 99.95%",
                            role: "Serves regional retail applications, and local caching servers.",
                          },
                          {
                            title: "Kathmandu Central Hub",
                            ref: "Node ID: KTM_CENTRAL_01",
                            lat: "Avg Ping: 18ms latency",
                            addr: "Putalisadak, Landmark Building Kathmandu, Nepal",
                            phone: "+977 1-42XXXXX",
                            sla: "SLA Guarantee: 99.99%",
                            role: "Drives system orchestration, security tokens, and routing proxies.",
                          },
                          {
                            title: "Itahari Corporate HQ Nodes",
                            ref: "Node ID: ITR_HQ_MAIN_09",
                            lat: "Avg Ping: 12ms response",
                            addr: "Itahari-9, Hospital line, Sunsari, Nepal",
                            phone: "+977 25-58XXXX",
                            sla: "SLA Guarantee: 99.99%",
                            role: "Primary building terminal, corporate database engine, developer labs.",
                          },
                          {
                            title: "Biratnagar Sync Node",
                            ref: "Node ID: BRT_SOUTH_05",
                            lat: "Avg Ping: 14ms latency",
                            addr: "Main Road, Biratnagar, Morang, Nepal",
                            phone: "+977 21-52XXXX",
                            sla: "SLA Guarantee: 99.98%",
                            role: "Redundant hot-sync database backups and failover data persistence.",
                          }
                        ].map((nodeDetails, nIdx) => {
                          if (activeMapNode !== nIdx) return null;
                          return (
                            <motion.div
                              key={nIdx}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-4"
                            >
                              <div>
                                <span className="font-mono text-[9px] uppercase border px-2 py-0.5 tracking-wider border-zinc-800 text-zinc-500 bg-zinc-950/20">
                                  {nodeDetails.ref}
                                </span>
                                <h3 className="font-sans font-bold text-lg uppercase tracking-tight mt-2 text-slate-100">
                                  {nodeDetails.title}
                                </h3>
                              </div>

                              <div className="space-y-2 text-zinc-400 font-sans text-xs font-light">
                                <p className="flex items-center space-x-2">
                                  <MapPin size={12} className={theme === "green" ? "text-green-400" : "text-zinc-400"} />
                                  <span>Address: {nodeDetails.addr}</span>
                                </p>
                                <p className="flex items-center space-x-2">
                                  <Activity size={12} className={theme === "green" ? "text-green-400" : "text-zinc-405"} />
                                  <span className="font-mono text-[11px] text-zinc-400">{nodeDetails.lat}</span>
                                </p>
                                <p className="flex items-center space-x-2">
                                  <Shield size={12} className={theme === "green" ? "text-green-400" : "text-zinc-405"} />
                                  <span>SLA Target: {nodeDetails.sla}</span>
                                </p>
                              </div>

                              <div className="border-t border-zinc-200/5 pt-4">
                                <h4 className="font-mono text-[9px] uppercase tracking-wider text-zinc-400 mb-1.5">Node Operational Role</h4>
                                <p className="font-sans text-xs text-zinc-500 font-light leading-relaxed">
                                  {nodeDetails.role}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}

                        {/* Display options buttons selector */}
                        <div className="flex flex-wrap gap-2 font-mono text-[9px]">
                          {[
                            { tag: "01 Pokhara", id: 0 },
                            { tag: "02 Kathmandu", id: 1 },
                            { tag: "03 Itahari (HQ)", id: 2 },
                            { tag: "04 Biratnagar", id: 3 },
                          ].map((btn) => (
                            <button
                              key={btn.id}
                              onClick={() => setActiveMapNode(btn.id)}
                              className={`px-3 py-1.5 border transition-all duration-200 uppercase tracking-widest font-semibold ${
                                activeMapNode === btn.id 
                                  ? theme === "green"
                                    ? "bg-green-600 text-zinc-950 border-green-500"
                                    : "bg-zinc-100 text-zinc-950 border-zinc-100"
                                  : "border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                              }`}
                            >
                              {btn.tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Newsletter Subscription Form */}
                  <div className="mt-28 border-t pt-16 border-zinc-200/5">
                    <div className={`border p-8 md:p-12 relative overflow-hidden ${
                      theme === "green"
                        ? "border-green-950/40 bg-zinc-950/20"
                        : theme === "dark"
                          ? "border-zinc-900 bg-zinc-950/15"
                          : "border-zinc-200 bg-zinc-50/40"
                    }`}>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 text-left">
                        <div className="md:col-span-7 space-y-3">
                          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-semiboldBlock">
                            Automated Log Pipeline
                          </span>
                          <h2 className="font-sans font-bold text-xl uppercase tracking-tight">
                            Subscribe to Node Bulletins & Technical Newsletter
                          </h2>
                          <p className="font-sans text-xs text-zinc-550 font-light leading-relaxed max-w-xl">
                            Receive automated system chronicles, benchmark summaries, and technical updates from the Itahari node. No marketing slop, strictly verified layout guidelines.
                          </p>
                        </div>

                        <div className="md:col-span-5">
                          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                            <div className="flex">
                              <input
                                type="email"
                                required
                                placeholder="developer@domain.com"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                className={`w-full p-3 text-xs outline-none focus:outline-none transition-all duration-200 ${
                                  theme === "dark"
                                    ? "bg-zinc-950 border-zinc-900 text-zinc-200 focus:border-zinc-500"
                                    : theme === "green"
                                      ? "bg-zinc-950 border-green-950 text-green-105 focus:border-green-400"
                                      : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-500"
                                }`}
                              />
                              <button
                                type="submit"
                                className={`font-mono text-[10px] uppercase tracking-widest px-6 font-bold transition-all duration-200 ${
                                  theme === "green"
                                    ? "bg-green-600 text-zinc-950 hover:bg-green-500"
                                    : theme === "dark"
                                      ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                                      : "bg-zinc-950 text-white hover:bg-zinc-900"
                                }`}
                              >
                                Subscribe
                              </button>
                            </div>
                            
                            {newsletterSuccess ? (
                              <div className="font-mono text-[9px] text-emerald-450 uppercase tracking-widest animate-fadeIn leading-none">
                                Subscription authenticated. Newsletter pipeline linked safely.
                              </div>
                            ) : (
                              <p className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
                                Deliverable: Under 1 technical chronicle article per quarter limit.
                              </p>
                            )}
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                </section>
              </motion.div>
            )}

            {activeTab === "services" && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto px-6 py-16"
              >
                <div className="border-b pb-10 mb-16 border-zinc-200/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    Capabilities Suite
                  </span>
                  <h1 className="font-sans font-bold text-3xl sm:text-4xl uppercase tracking-tight mt-2">
                    Our Services
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-zinc-500 max-w-xl mt-3 leading-relaxed font-light">
                    Modern developer integrations designed to carry complex processes effortlessly. Tailored, dynamic endpoints, managed with absolute clarity.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                  {services.map((svc, sIdx) => (
                    <motion.div
                      key={svc.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: sIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={`border p-8 transition-colors duration-200 flex flex-col justify-between ${cardBgClass()}`}
                    >
                      <div>
                        <div className={`inline-block p-2.5 border mb-6 ${
                          theme === "green" ? "border-green-900 text-green-400 bag-green-950/10" : "border-zinc-250/20 text-zinc-400"
                        }`}>
                          {getIconComponent(svc.icon)}
                        </div>
                        <h3 className="font-sans font-bold text-lg uppercase tracking-tight mb-3">
                          {svc.name}
                        </h3>
                        <p className="font-sans text-xs text-zinc-500 leading-relaxed mb-6 font-light">
                          {svc.description}
                        </p>
                      </div>

                      {svc.features && svc.features.length > 0 && (
                        <div className="border-t pt-6 border-zinc-200/10 flex flex-col space-y-2">
                          {svc.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Check size={12} className={theme === "green" ? "text-green-400" : "text-zinc-500"} />
                              <span className="font-sans text-[11px] text-zinc-400">
                                {feat}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="border-t pt-16 border-zinc-200/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    Operational Proof
                  </span>
                  <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-2 mb-10">
                    Our Selected Projects
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className={`border p-6 transition-all duration-200 ${cardBgClass()}`}
                      >
                        <div className="font-mono text-[9px] uppercase border px-2 py-0.5 inline-block text-zinc-500 border-zinc-200/20 mb-4 matches-theme">
                          {proj.category}
                        </div>
                        <h4 className="font-sans font-bold text-sm uppercase tracking-tight mb-2">
                          {proj.title}
                        </h4>
                        <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light mb-4">
                          {proj.description}
                        </p>
                        <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 select-none">
                          <span>Verified Implementation</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Client Appraisals & Professional Reviews */}
                <div className="border-t pt-20 mt-20 border-zinc-200/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    Trusted Appraisals
                  </span>
                  <h2 className="font-sans font-bold text-2xl uppercase tracking-tight mt-2 mb-10">
                    Client Testimonials
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        rating: 5,
                        reviewer: "Abhishek Adhikari",
                        role: "Director of Operations, Koshi Fintech",
                        text: "TechMantra re-architected our legacy digital ledger systems. We reduced our page response delays to under 20ms and completely eliminated communication bottlenecks.",
                        stamp: "KATHMANDU, NP",
                        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        rating: 5,
                        reviewer: "Pema Sherpa",
                        role: "Founder, Alpine Organics Nepal",
                        text: "The team delivered a pristine, high-contrast responsive interface. Our conversion rates climbed by 34% within the first month. Amazing attention to typographic rhythm.",
                        stamp: "POKHARA, NP",
                        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                      },
                      {
                        rating: 5,
                        reviewer: "Niranjan Gupta",
                        role: "Technical Lead, Sagarmatha Solutions",
                        text: "Their container-native autoscaling builds are incredibly durable. Zero outages during peak traffic loads and immaculate API specification documentation.",
                        stamp: "ITAHARI, NP",
                        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop"
                      }
                    ].map((rev, rIdx) => (
                      <div
                        key={rIdx}
                        className={`border p-6 flex flex-col justify-between transition-all duration-200 ${cardBgClass()}`}
                      >
                        <div>
                          <div className="flex items-center space-x-1 mb-4">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Sparkles key={i} size={11} className={theme === "green" ? "text-green-400" : "text-amber-500"} />
                            ))}
                          </div>
                          <p className="font-sans text-xs italic text-zinc-400 leading-relaxed font-light mb-6">
                            "{rev.text}"
                          </p>
                        </div>
                        <div className="border-t pt-4 border-zinc-200/10 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <img
                              src={rev.image}
                              alt={rev.reviewer}
                              referrerPolicy="no-referrer"
                              className={`w-9 h-9 rounded-full object-cover border ${
                                theme === "green" 
                                  ? "border-green-800/40" 
                                  : "border-zinc-850"
                              }`}
                            />
                            <div>
                              <h5 className="font-sans font-bold text-[11px] uppercase tracking-wide text-zinc-200 dark:text-zinc-800">
                                {rev.reviewer}
                              </h5>
                              <p className="font-mono text-[9px] text-zinc-500">
                                {rev.role}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-[9px] text-zinc-650 tracking-wider self-end">
                            {rev.stamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Call to Action Section with Closing message and layout fields */}
                <div className="border-t pt-20 mt-20 border-zinc-200/10">
                  <div className={`border p-8 md:p-12 relative overflow-hidden ${
                    theme === "green"
                      ? "border-green-950/40 bg-zinc-950/30"
                      : theme === "dark"
                        ? "border-zinc-900 bg-zinc-950/30"
                        : "border-zinc-200 bg-zinc-50/50"
                  }`}>
                    <div className="absolute top-0 right-0 pointer-events-none opacity-5">
                      <Terminal size={300} strokeWidth={0.5} className={theme === "green" ? "text-green-400" : "text-zinc-650"} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                      <div className="lg:col-span-6 space-y-6">
                        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                          Secure Partnership
                        </span>
                        <h2 className="font-sans font-bold text-2xl sm:text-3xl uppercase tracking-tight leading-none">
                          Ready to upgrade your systems & skills?
                        </h2>
                        <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed font-light max-w-lg">
                          Initialize a secure workspace project with TechMantra Nepal. Whether you need modern, lightweight interfaces, cloud infrastructure mapping, or high-performance API structures, we deliver robust solutions built for enterprise growth.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                          <button
                            onClick={() => {
                              setActiveTab("contact");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`font-mono text-[10px] uppercase tracking-widest py-3 px-5 transition-all duration-200 focus:outline-none flex items-center space-x-1.5 font-bold ${
                              theme === "green"
                                ? "bg-green-600 text-zinc-950 hover:bg-green-500"
                                : theme === "dark"
                                  ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                                  : "bg-zinc-950 text-white hover:bg-zinc-900"
                            }`}
                          >
                            <span>Enterprise Inquiry</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-6 border-l border-dashed border-zinc-200/10 pl-0 lg:pl-12">
                        <form onSubmit={handleCtaSubmit} className="space-y-4">
                          <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-400 mb-2">
                            Quick Connection Payload
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <input
                                type="text"
                                required
                                placeholder="Your Name"
                                value={ctaName}
                                onChange={(e) => setCtaName(e.target.value)}
                                className={`w-full p-2.5 text-xs outline-none focus:outline-none transition-all duration-200 ${
                                  theme === "dark"
                                    ? "bg-zinc-950 border-zinc-900 focus:border-zinc-500 text-zinc-200"
                                    : theme === "green"
                                      ? "bg-zinc-950 border-green-950 text-green-100 focus:border-green-400"
                                      : "bg-white border-zinc-200 focus:border-zinc-500 text-zinc-900"
                                }`}
                              />
                            </div>
                            <div>
                              <input
                                type="email"
                                required
                                placeholder="Email Address"
                                value={ctaEmail}
                                onChange={(e) => setCtaEmail(e.target.value)}
                                className={`w-full p-2.5 text-xs outline-none focus:outline-none transition-all duration-200 ${
                                  theme === "dark"
                                    ? "bg-zinc-950 border-zinc-900 focus:border-zinc-500 text-zinc-200"
                                    : theme === "green"
                                      ? "bg-zinc-950 border-green-950 text-green-100 focus:border-green-400"
                                      : "bg-white border-zinc-200 focus:border-zinc-500 text-zinc-900"
                                }`}
                              />
                            </div>
                          </div>

                          <div>
                            <textarea
                              required
                              rows={3}
                              placeholder="Brief description of skills upgrade or system architecture requirements..."
                              value={ctaMessage}
                              onChange={(e) => setCtaMessage(e.target.value)}
                              className={`w-full p-2.5 text-xs outline-none focus:outline-none transition-all duration-200 ${
                                theme === "dark"
                                  ? "bg-zinc-950 border-zinc-900 focus:border-zinc-500 text-zinc-200"
                                  : theme === "green"
                                    ? "bg-zinc-950 border-green-950 text-green-100 focus:border-green-400"
                                    : "bg-white border-zinc-200 focus:border-zinc-500 text-zinc-900"
                                }`}
                            />
                          </div>

                          {ctaSuccess && (
                            <div className="p-2.5 bg-emerald-950/20 text-emerald-400 border border-emerald-900 text-[10px] font-mono animate-fadeIn">
                              Inquiry payload securely transmitted. Welcome!
                            </div>
                          )}

                          <button
                            type="submit"
                            className={`w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                              theme === "green"
                                ? "bg-green-950/40 text-green-400 border border-green-900 hover:bg-green-600 hover:text-zinc-950"
                                : theme === "dark"
                                  ? "bg-zinc-900 text-zinc-200 border border-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"
                                  : "bg-zinc-150 text-zinc-900 border border-zinc-300 hover:bg-zinc-950 hover:text-white"
                            }`}
                          >
                            Transmit Quick Payload
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto px-6 py-16"
              >
                <div className="border-b pb-10 mb-16 border-zinc-200/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    Behind the Terminal
                  </span>
                  <h1 className="font-sans font-bold text-3xl sm:text-4xl uppercase tracking-tight mt-2">
                    About Us
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  <div className="space-y-6">
                    <h3 className="font-sans font-bold text-lg uppercase">
                      Engineering Minimalist Paradigms from Itahari
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                      TechMantra Nepal is a digital craft studio. We develop layouts, software stacks, and conversion engines for modern clients who value direct clarity, rigorous execution, and structured interface paths over superficial decoration.
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                      We reject visual clutter, superfluous animations, and unnecessary dependencies. Every project is designed from scratch with strict adherence to responsive coordinates and zero frame overflow.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className={`p-6 border transition-all duration-300 hover:border-zinc-750/30 ${cardBgClass()}`}>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        Location Node
                      </h4>
                      <p className="font-sans text-sm font-semibold">
                        Itahari, Nepal
                      </p>
                      <p className="font-sans text-xs text-zinc-500 mt-1 font-light">
                        itahari-9, Hospital line
                      </p>
                    </div>

                    <div className={`p-6 border ${cardBgClass()}`}>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        Developer Network
                      </h4>
                      <p className="font-sans text-sm font-semibold">
                        Full Stack Core Nodes
                      </p>
                      <p className="font-sans text-xs text-zinc-500 mt-1 font-light">
                        A clean assembly of remote-aligned specialists
                      </p>
                    </div>

                    <div className={`p-6 border ${cardBgClass()}`}>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        Operational Flow
                      </h4>
                      <p className="font-sans text-sm font-semibold">
                        Asynchronous Design
                      </p>
                      <p className="font-sans text-xs text-zinc-500 mt-1 font-light">
                        Clear task definitions, zero meeting bloat
                      </p>
                    </div>

                    <div className={`p-6 border ${cardBgClass()}`}>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-2">
                        Database Engine
                      </h4>
                      <p className="font-sans text-sm font-semibold">
                        Supabase Federated
                      </p>
                      <p className="font-sans text-xs text-zinc-500 mt-1 font-light">
                        Real-time structured sync and relational schema
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-20 border-t pt-16 border-zinc-200/10">
                  <h3 className="font-sans font-bold text-center text-sm uppercase mb-12 tracking-widest">
                    Core Engineering Guidelines We Follow
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="font-mono text-2xl text-zinc-500 mb-2">
                        01
                      </div>
                      <h5 className="font-sans font-bold text-xs uppercase mb-1">
                        Solid Anchors
                      </h5>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                        All interactive triggers have precise focus boundaries.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-2xl text-zinc-500 mb-2">
                        02
                      </div>
                      <h5 className="font-sans font-bold text-xs uppercase mb-1">
                        Zero Decorative Slop
                      </h5>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                        No gratuitous elements or meaningless gradients.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-2xl text-zinc-500 mb-2">
                        03
                      </div>
                      <h5 className="font-sans font-bold text-xs uppercase mb-1">
                        Continuous Sync
                      </h5>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                        Your admin state commits live to verified storage nodes.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-2xl text-zinc-500 mb-2">
                        04
                      </div>
                      <h5 className="font-sans font-bold text-xs uppercase mb-1">
                        Responsive Fluids
                      </h5>
                      <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                        Form factors adapt directly to active view ports.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visualizing Our Core Values & Mission (Why Choose Us) */}
                <div className="mt-20 border-t pt-16 border-zinc-200/10 animate-fadeIn">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 space-y-4">
                      <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                        Our Genesis & Values
                      </span>
                      <h3 className="font-sans font-bold text-2xl uppercase tracking-tight">
                        Why We Founded TechMantra Nepal
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                        We started with a simple, disruptive realization: modern web systems are collapsing under the weight of excessive packages, heavy visual bloat, and chaotic specifications. Businesses in Nepal and abroad were paying for over-engineered dashboards they did not understand.
                      </p>
                      <p className="font-sans text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                        Our foundational mantra is simple: <strong className="font-medium text-zinc-900 dark:text-zinc-100">Simplify. Compress. Standardize.</strong> We build ultra-high contrast, fast, and secure software using clean interfaces so your business never misses a heartbeat.
                      </p>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Uncompromising Speed",
                          desc: "We optimize render branches and bundle payloads so initial paint metrics are loadable in under 150 milliseconds globally."
                        },
                        {
                          title: "Absolute Safety",
                          desc: "We route telemetry pipelines and relational states through strict secure container boundaries, guaranteeing data privacy."
                        },
                        {
                          title: "Direct Engineering Clarity",
                          desc: "Zero consulting jargon. All requirements maps, interface systems, and progress charts are transparent to clients."
                        },
                        {
                          title: "Robust Local Heritage",
                          desc: "We bring elite digital systems design directly from Itahari, Sunsari to global standards, championing high craftsmanship."
                        }
                      ].map((item, idx) => (
                        <div key={idx} className={`border p-5 transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-750 ${cardBgClass()}`}>
                          <h4 className="font-sans font-bold text-xs uppercase tracking-wider mb-2">
                            {item.title}
                          </h4>
                          <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Team Bios section with high quality headshots and professional descriptions */}
                <div className="mt-20 border-t pt-16 border-zinc-200/10">
                  <div className="text-center max-w-xl mx-auto mb-12">
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      Craft Specialist Nodes
                    </span>
                    <h3 className="font-sans font-bold text-2xl uppercase mt-2 tracking-wide text-zinc-900 dark:text-zinc-100">
                      Meet Our Specialist Team
                    </h3>
                    <p className="font-sans text-xs text-zinc-500 mt-2 font-light">
                      The core architects, interface designers, and systems engineers behind TechMantra Nepal's high-precision digital instruments.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Sumit Khadka",
                        role: "Founder & Lead Architect",
                        bio: "Former cloud system researcher obsessed with ultra-slim CJS bundling and edge container performance.",
                        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=260&auto=format&fit=crop",
                        tags: ["System Arch", "Node Core"]
                      },
                      {
                        name: "Rejina Adhikari",
                        role: "Director of Interface Design",
                        bio: "Crafts balanced grid structures, typographic rhythm templates, and optimized interactive layout systems.",
                        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=260&auto=format&fit=crop",
                        tags: ["UI Systems", "Aesthetics"]
                      },
                      {
                        name: "Prabhat Shrestha",
                        role: "Principal Backend Engineer",
                        bio: "Designs low-latency federated relational triggers and builds container-native scale-to-zero microservices.",
                        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=260&auto=format&fit=crop",
                        tags: ["Relational DB", "Telemetry"]
                      }
                    ].map((member, mIdx) => (
                      <div
                        key={mIdx}
                        className={`border p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:border-zinc-400 dark:hover:border-zinc-750 ${cardBgClass()}`}
                      >
                        <div>
                          <div className="overflow-hidden border border-zinc-200/10 dark:border-zinc-900 mb-5 relative group">
                            <img
                              src={member.image}
                              alt={member.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-48 object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-300"
                            />
                            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                              {member.tags.map((tag, tIdx) => (
                                <span key={tIdx} className="font-mono text-[8px] uppercase tracking-wider bg-zinc-950/80 text-zinc-300 px-2 py-0.5 border border-zinc-805/40">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <h4 className="font-sans font-bold text-sm uppercase tracking-tight mb-1 text-zinc-905 dark:text-zinc-100">
                            {member.name}
                          </h4>
                          <span className={`font-mono text-[10px] uppercase tracking-wide block mb-3 ${
                            theme === "green" ? "text-green-400" : "text-zinc-500"
                          }`}>
                            {member.role}
                          </span>
                          <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light mb-4">
                            {member.bio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architectural FAQ Section */}
                <div className="mt-20 border-t pt-16 border-zinc-200/10">
                  <div className="text-center max-w-xl mx-auto mb-12">
                    <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                      Technical Protocols
                    </span>
                    <h3 className="font-sans font-bold text-lg uppercase mt-2 tracking-wide text-zinc-900 dark:text-zinc-100">
                      Architectural FAQ
                    </h3>
                    <p className="font-sans text-xs text-zinc-500 mt-2 font-light">
                      Explore our deployment patterns, performance optimizations, and backend structure benchmarks.
                    </p>
                  </div>

                  <div className="max-w-3xl mx-auto space-y-4">
                    {architecturalFaqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div 
                          key={idx}
                          className={`border transition-all duration-300 ${
                            isOpen 
                              ? theme === "green" 
                                ? "border-green-500/50 shadow-sm shadow-green-500/5" 
                                : "border-zinc-400 dark:border-zinc-700" 
                              : "border-zinc-200 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-800"
                          } ${cardBgClass()}`}
                        >
                          <button
                            type="button"
                            className="w-full flex items-center justify-between p-5 text-left font-sans focus:outline-none"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          >
                            <div className="flex items-center space-x-4 pr-4">
                              <HelpCircle size={16} className={`shrink-0 ${
                                isOpen 
                                  ? theme === "green" 
                                    ? "text-green-500" 
                                    : "text-zinc-900 dark:text-zinc-200" 
                                  : "text-zinc-500"
                              }`} />
                              <span className={`text-xs sm:text-sm font-medium transition-colors ${
                                isOpen 
                                  ? "text-zinc-900 dark:text-zinc-100" 
                                  : "text-zinc-700 dark:text-zinc-400"
                              }`}>
                                {faq.q}
                              </span>
                            </div>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="text-zinc-500 shrink-0"
                            >
                              <ChevronDown size={16} />
                            </motion.div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-1 border-t border-zinc-200/5 dark:border-zinc-900/50">
                                  <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                                    {faq.a}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto px-6 py-16"
              >
                <div className="border-b pb-10 mb-16 border-zinc-200/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    Initialize Connection
                  </span>
                  <h1 className="font-sans font-bold text-3xl sm:text-4xl uppercase tracking-tight mt-2">
                    Contact Us
                  </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  <div className="lg:col-span-5 space-y-8">
                    <div>
                      <h3 className="font-sans font-bold text-lg uppercase mb-3">
                        Technical Inquiries
                      </h3>
                      <p className="font-sans text-xs text-zinc-500 leading-relaxed font-light">
                        Need architectural consultation, dynamic application endpoints, or custom branding frameworks? Initialize a secure contact payload below.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <Mail size={16} className={theme === "green" ? "text-green-400" : "text-zinc-500"} />
                        <span className="font-mono text-xs">info@techmantranepal.com.np</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <MapPin size={16} className={theme === "green" ? "text-green-400" : "text-zinc-500"} />
                        <span className="font-mono text-xs">itahari-9, Hospital line, Nepal</span>
                      </div>
                    </div>
                  </div>

                  <div className={`lg:col-span-7 border p-8 backdrop-blur-md ${cardBgClass()}`}>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-mono text-zinc-500 mb-2">
                            Name / Node Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Jane Doe"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className={`w-full p-2.5 text-sm focus:outline-none transition-all duration-200 ${
                              theme === "dark"
                                ? "bg-zinc-950 border-zinc-900 focus:border-zinc-500"
                                : theme === "green"
                                  ? "bg-zinc-950 border-green-950 text-green-100 focus:border-green-400"
                                  : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-500"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase font-mono text-zinc-500 mb-2">
                            Contact Address
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g., jane@domain.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className={`w-full p-2.5 text-sm focus:outline-none transition-all duration-200 ${
                              theme === "dark"
                                ? "bg-zinc-950 border-zinc-900 focus:border-zinc-500"
                                : theme === "green"
                                  ? "bg-zinc-950 border-green-950 text-green-100 focus:border-green-400"
                                  : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-mono text-zinc-500 mb-2">
                          Message payload
                        </label>
                        <textarea
                          required
                          rows={4}
                          placeholder="State system specs or general inquiries..."
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className={`w-full p-2.5 text-sm focus:outline-none transition-all duration-200 ${
                            theme === "dark"
                              ? "bg-zinc-950 border-zinc-900 focus:border-zinc-500"
                              : theme === "green"
                                ? "bg-zinc-950 border-green-950 text-green-100 focus:border-green-400"
                                  : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-500"
                          }`}
                        />
                      </div>

                      {contactSuccess && (
                        <div className="p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900 text-xs font-mono transition-all duration-300 animate-fadeIn">
                          Message payload securely transmitted to Itahari node. We will respond shortly.
                        </div>
                      )}

                      <button
                        type="submit"
                        className={`w-full py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                          theme === "green"
                            ? "bg-green-600 text-zinc-900 hover:bg-green-500"
                            : theme === "dark"
                              ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                              : "bg-zinc-950 text-white hover:bg-zinc-900"
                        }`}
                      >
                        Transmit Payload
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      <Footer theme={theme} setActiveTab={setActiveTab} />

      {/* Subtle holographic Thank You Modal */}
      <AnimatePresence>
        {showThankYou && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowThankYou(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`relative w-full max-w-md overflow-hidden border p-8 md:p-10 text-center flex flex-col items-center ${
                theme === "green"
                  ? "bg-zinc-950 border-green-500/30 text-green-400 shadow-[0_0_50px_rgba(34,197,94,0.15)]"
                  : theme === "dark"
                    ? "bg-zinc-950 border-zinc-900 text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    : "bg-white border-zinc-200 text-zinc-900 shadow-2xl shadow-zinc-200/50"
              }`}
            >
              {/* Corner tech marks */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-500/30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-500/30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-500/30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-500/30" />

              {/* Holographic Confirmation Icon Container */}
              <div className="relative flex items-center justify-center h-20 w-20 mb-6">
                <div className={`absolute inset-0 rounded-full border border-dashed animate-[spin_8s_linear_infinite] opacity-40 ${
                  theme === "green" ? "border-green-500" : theme === "dark" ? "border-zinc-500" : "border-zinc-300"
                }`} />
                <div className={`absolute -inset-2 rounded-full border border-zinc-500/10 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] ${
                  theme === "green" ? "bg-green-500/5" : theme === "dark" ? "bg-zinc-500/5" : "bg-zinc-200/20"
                }`} />
                <div className={`absolute -inset-4 rounded-full opacity-30 blur-md ${
                  theme === "green" ? "bg-green-500/20" : theme === "dark" ? "bg-zinc-400/10" : "bg-zinc-300/10"
                }`} />
                
                <div className={`relative z-10 p-4 rounded-full border transition-all duration-300 ${
                  theme === "green"
                    ? "border-green-500/50 bg-green-950/40 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    : theme === "dark"
                      ? "border-zinc-700/80 bg-zinc-900/60 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      : "border-zinc-200 bg-zinc-50 text-zinc-900 shadow-md"
                }`}>
                  <Sparkles className={`h-8 w-8 ${theme === "green" ? "animate-pulse" : ""}`} />
                </div>
                
                <span className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l ${theme === "green" ? "border-green-400" : "border-zinc-400"}`} />
                <span className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r ${theme === "green" ? "border-green-400" : "border-zinc-400"}`} />
                <span className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l ${theme === "green" ? "border-green-400" : "border-zinc-400"}`} />
                <span className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r ${theme === "green" ? "border-green-400" : "border-zinc-400"}`} />
              </div>

              {/* Title & Body */}
              <h3 className={`font-sans font-bold text-lg sm:text-xl uppercase tracking-wider mb-2 ${
                theme === "green" ? "text-green-400" : theme === "dark" ? "text-zinc-100" : "text-zinc-900"
              }`}>
                Transmission Secured
              </h3>
              <p className={`font-sans text-xs max-w-xs mx-auto leading-relaxed mb-6 font-light ${
                theme === "green" ? "text-green-500/70" : theme === "dark" ? "text-zinc-400" : "text-zinc-500"
              }`}>
                Thank you for initializing contact. Your payload has been securely routed to Itahari-9 node. We will respond shortly.
              </p>

              {/* Manual Dismiss Button */}
              <button
                onClick={() => setShowThankYou(false)}
                className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all duration-200 ${
                  theme === "green"
                    ? "border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500"
                    : theme === "dark"
                      ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      : "border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                Close Connection [ESC]
              </button>

              {/* Countdown Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-200/20 dark:bg-zinc-800/20">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className={`h-full ${
                    theme === "green" ? "bg-green-500" : theme === "dark" ? "bg-white" : "bg-zinc-900"
                  }`}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <SpeedInsights />
    </div>
  );
}
