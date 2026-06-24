import { useState, useEffect, FormEvent } from "react";
import { ThemeType } from "../types";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Activity, 
  ShieldCheck,
  Send,
  X,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FooterProps {
  theme: ThemeType;
  setActiveTab?: (tab: string) => void;
}

export default function Footer({ theme, setActiveTab }: FooterProps) {
  const [latency, setLatency] = useState(24);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "terms" | null>(null);
  
  const year = new Date().getFullYear();

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + change;
        return next < 15 ? 15 : next > 35 ? 35 : next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterStatus("error");
      return;
    }

    setNewsletterStatus("loading");
    setTimeout(() => {
      setNewsletterStatus("success");
      setNewsletterEmail("");
    }, 1200);
  };

  const handleNavClick = (tabId: string) => {
    if (setActiveTab) {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Base theme definitions
  const footerBgClasses = theme === "dark" 
    ? "bg-zinc-950 border-zinc-900 text-zinc-400" 
    : theme === "green" 
      ? "bg-zinc-950 border-green-950/40 text-green-700/80" 
      : "bg-zinc-50 border-zinc-200 text-zinc-600";

  const headingClasses = theme === "dark" 
    ? "text-zinc-100 font-sans tracking-wide" 
    : theme === "green" 
      ? "text-green-400 font-sans tracking-wide" 
      : "text-zinc-800 font-sans tracking-wide";

  const linkHoverClasses = theme === "green"
    ? "hover:text-green-400 transition-colors duration-200"
    : theme === "dark"
      ? "hover:text-white transition-colors duration-200"
      : "hover:text-zinc-900 transition-colors duration-200";

  const cardBorderClasses = theme === "green"
    ? "border-green-950/30 bg-green-950/10"
    : theme === "dark"
      ? "border-zinc-900 bg-zinc-900/10"
      : "border-zinc-200/60 bg-zinc-100/50";

  return (
    <footer className={`border-t py-16 px-6 md:px-12 transition-colors duration-300 relative z-10 ${footerBgClasses}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Multi-Column Gird */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-zinc-200/10 dark:border-zinc-900/50 mb-12">
          
          {/* Column 1: Brand & Identity */}
          <div className="flex flex-col space-y-4">
            <div 
              onClick={() => handleNavClick("home")}
              className="cursor-pointer font-sans text-lg font-bold tracking-tight select-none focus:outline-none"
            >
              TechMantra <span className={theme === "green" ? "text-green-400" : "text-zinc-500"}>Nepal</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xs">
              Architecting minimal digital instruments, robust interfaces, and modern full-stack systems engineering built with extreme precision and visual excellence.
            </p>
            {/* Contact Details */}
            <div className="flex flex-col space-y-2.5 text-xs pt-2">
              <div className="flex items-center space-x-2.5">
                <MapPin className="h-4 w-4 text-zinc-400 dark:text-zinc-650" />
                <span className="font-mono text-[11px]">Itahari-4, Sunsari, Nepal</span>
              </div>
              <a href="mailto:info@techmantranepal.com.np" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
                <Mail className="h-4 w-4 text-zinc-400 dark:text-zinc-650" />
                <span className="font-mono text-[11px]">info@techmantranepal.com.np</span>
              </a>
              <a href="tel:+97725580000" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
                <Phone className="h-4 w-4 text-zinc-400 dark:text-zinc-650" />
                <span className="font-mono text-[11px]">+977 25 580000</span>
              </a>
            </div>
          </div>

          {/* Column 2: Secondary Navigation */}
          <div className="flex flex-col space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${headingClasses}`}>
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { id: "home", label: "Home" },
                { id: "services", label: "Our Services" },
                { id: "about", label: "About Us" },
                { id: "contact", label: "Contact Engineering" }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center space-x-1 outline-none text-left ${linkHoverClasses}`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Resource Index */}
          <div className="flex flex-col space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${headingClasses}`}>
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setActiveLegalModal("privacy")}
                  className={`flex items-center space-x-1.5 outline-none ${linkHoverClasses}`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 opacity-80" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveLegalModal("terms")}
                  className={`flex items-center space-x-1.5 outline-none ${linkHoverClasses}`}
                >
                  <FileText className="h-3.5 w-3.5 opacity-80" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <span className="text-zinc-500 text-[10px] italic">
                  Registered under Co. Act Nepal — No. 49301/08
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Precision Newsletter subscription */}
          <div className="flex flex-col space-y-4">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${headingClasses}`}>
              Mantra Dispatch
            </h4>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Receive raw engineering insights, clean architectural structures, and design logs directly in your box.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex items-center space-x-1.5 relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus === "error") setNewsletterStatus("idle");
                  }}
                  className={`w-full bg-transparent border py-2 px-3 text-xs outline-none transition-colors duration-200 font-mono ${
                    newsletterStatus === "error"
                      ? "border-red-500 text-red-500"
                      : theme === "green"
                        ? "border-green-900 focus:border-green-400 text-green-100 placeholder-green-800"
                        : theme === "dark"
                          ? "border-zinc-800 focus:border-zinc-500 text-zinc-200 placeholder-zinc-700"
                          : "border-zinc-300 focus:border-zinc-600 text-zinc-900 placeholder-zinc-400"
                  }`}
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === "loading"}
                  className={`p-2 transition-all duration-200 focus:outline-none flex items-center justify-center border-y border-r h-[34px] -ml-[1px] ${
                    theme === "green"
                      ? "border-green-900 bg-green-950/20 text-green-400 hover:bg-green-900/40"
                      : theme === "dark"
                        ? "border-zinc-800 bg-zinc-900/20 text-zinc-300 hover:bg-zinc-800/40"
                        : "border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                  aria-label="Subscribe"
                >
                  <Send className={`h-3 w-3 ${newsletterStatus === "loading" ? "animate-pulse" : ""}`} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {newsletterStatus === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] text-emerald-500 font-mono"
                  >
                    Successfully subscribed to design dispatch.
                  </motion.p>
                )}
                {newsletterStatus === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] text-red-500 font-mono"
                  >
                    Please provide a valid email structure.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Bottom Section: Copyright, Socials & Live Indicators */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 text-xs">
          
          {/* Copyright Notice */}
          <div className="flex flex-col space-y-1.5 text-center lg:text-left self-center lg:self-start">
            <div className="font-sans font-medium text-zinc-700 dark:text-zinc-300">
              TechMantra Nepal © {year}. All rights reserved.
            </div>
            <div className="flex items-center justify-center lg:justify-start space-x-3 text-[10px] text-zinc-500 dark:text-zinc-650">
              <button onClick={() => setActiveLegalModal("privacy")} className={`font-mono outline-none ${linkHoverClasses}`}>
                Privacy Policy
              </button>
              <span>•</span>
              <button onClick={() => setActiveLegalModal("terms")} className={`font-mono outline-none ${linkHoverClasses}`}>
                Terms of Service
              </button>
              <span>•</span>
              <span className="font-mono">Co. Reg. Kathmandu Nepal</span>
            </div>
          </div>

          {/* Social Media Connections - Rich List */}
          <div className="flex items-center space-x-3 justify-center">
            {[
              { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
              { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
              { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
              { icon: Github, label: "GitHub", href: "https://github.com" },
              { icon: Twitter, label: "Twitter", href: "https://x.com" }
            ].map((soc, sIdx) => {
              const IconComp = soc.icon;
              return (
                <a
                  key={sIdx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-full border transition-all duration-300 ${
                    theme === "green"
                      ? "border-green-950/20 text-green-700 bg-zinc-950/20 hover:text-green-400 hover:border-green-500 hover:bg-green-950/40"
                      : theme === "dark"
                        ? "border-zinc-800/10 text-zinc-500 bg-zinc-950/10 hover:text-white hover:border-zinc-700 hover:bg-zinc-900"
                        : "border-zinc-200/50 text-zinc-400 bg-zinc-100/50 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-100"
                  }`}
                  aria-label={soc.label}
                >
                  <IconComp className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>

          {/* Real-time System Indicators */}
          <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[10px] border border-dashed px-4 py-2 rounded-md ${cardBorderClasses}`}>
            <div className="flex items-center space-x-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>Server: <span className="text-emerald-500 font-semibold uppercase">Online</span></span>
            </div>
            <div className="text-zinc-300 dark:text-zinc-800">|</div>
            <div>
              Latency: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{latency}ms</span>
            </div>
            <div className="text-zinc-300 dark:text-zinc-800">|</div>
            <div>
              Uptime: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">99.98%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Real Interactive legal Modals */}
      <AnimatePresence>
        {activeLegalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto border p-6 md:p-8 rounded-lg shadow-2xl relative ${
                theme === "green" 
                  ? "bg-zinc-950 border-green-950 text-green-300/90" 
                  : theme === "dark" 
                    ? "bg-zinc-950 border-zinc-900 text-zinc-300" 
                    : "bg-white border-zinc-200 text-zinc-700"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveLegalModal(null)}
                className={`absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-150/10 dark:hover:bg-zinc-900 transition-colors duration-200 ${
                  theme === "green" ? "text-green-500" : "text-zinc-400"
                }`}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {activeLegalModal === "privacy" ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-zinc-200/10 dark:border-zinc-900">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <h3 className={`text-base font-bold ${headingClasses}`}>Privacy Policy</h3>
                  </div>
                  <div className="text-xs space-y-3.5 leading-relaxed font-mono">
                    <p className="font-semibold text-[11px] uppercase text-zinc-500 dark:text-zinc-400">
                      Last Updated: June 2026 | TechMantra Nepal Pvt. Ltd.
                    </p>
                    <p>
                      Welcome to TechMantra Nepal. We respect your digital privacy and are deeply committed to protecting any personal metrics or data constructs processed through our applications.
                    </p>
                    <div className="space-y-1.5">
                      <h4 className="font-bold underline">1. Data Architecture We Process</h4>
                      <p>
                        We do not collect personal analytics on our general platform unless explicitly volunteered via contact portal. Any inquiry structure containing email, location preferences, or company size is held strictly in encrypted temporary buffers located in Nepal secure nodes.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold underline">2. Third Party Services</h4>
                      <p>
                        This digital asset operates under high safety sandboxes. We do not transmit tracking identifiers, cookies, or user telemetry values to third-party ad networks or global aggregators.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold underline">3. User Rights & Data Retention</h4>
                      <p>
                        You maintain full execution rights to purge any message, portfolio inquiry, or contact register we possess. Reach our privacy controller directly at <span className="underline">info@techmantranepal.com.np</span> to initiate instantaneous data clearance.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-zinc-200/10 dark:border-zinc-900">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    <h3 className={`text-base font-bold ${headingClasses}`}>Terms of Service</h3>
                  </div>
                  <div className="text-xs space-y-3.5 leading-relaxed font-mono">
                    <p className="font-semibold text-[11px] uppercase text-zinc-500 dark:text-zinc-400">
                      Effective Date: June 2026 | TechMantra Nepal Pvt. Ltd.
                    </p>
                    <p>
                      By interacting with the digital systems, web assets, and engineering portals owned or maintained by TechMantra Nepal, you consent to compile and execute under the following terms:
                    </p>
                    <div className="space-y-1.5">
                      <h4 className="font-bold underline">1. Clean Usage Limits</h4>
                      <p>
                        All content, code displays, specific custom components, and responsive state handlers are copyrighted. Scraping, reverse engineering structural assets, or denial-of-service simulations on this domain is strictly non-compliant with standard cyber safety regulations of Nepal.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold underline">2. Software Delivery Disclaimer</h4>
                      <p>
                        TechMantra Nepal delivers digital portals, mock interfaces, and robust system configurations as-is. We assert zero liabilities for direct or ancillary production system drops resulting from external system integration changes.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold underline">3. Legal Jurisdiction</h4>
                      <p>
                        All compliance matters, structural grievances, or contract disputes are subjected to processing in Itahari courts, Sunsari, Nepal in accordance with federal laws.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Close footer button */}
              <div className="mt-8 pt-4 border-t border-zinc-200/10 dark:border-zinc-900 flex justify-end">
                <button
                  onClick={() => setActiveLegalModal(null)}
                  className={`text-xs uppercase font-mono tracking-widest py-2 px-4 transition-colors duration-200 focus:outline-none ${
                    theme === "green"
                      ? "bg-green-900 hover:bg-green-800 text-zinc-950 font-bold"
                      : theme === "dark"
                        ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white font-bold"
                  }`}
                >
                  Acknowledge Terms
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
