import { Menu, X, Sun, Moon, Leaf } from "lucide-react";
import { ThemeType } from "../types";
import { useState } from "react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  setSecurePortalActive: (active: boolean) => void;
  securePortalActive: boolean;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  setSecurePortalActive,
  securePortalActive,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const getThemeTextClass = () => {
    if (theme === "dark") return "text-zinc-100";
    if (theme === "green") return "text-green-100";
    return "text-zinc-900";
  };

  const getThemeBgClass = () => {
    if (theme === "dark") return "bg-zinc-950/80 border-zinc-800";
    if (theme === "green") return "bg-zinc-950/90 border-green-900";
    return "bg-white/80 border-zinc-200";
  };

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact" }
  ];

  const handleNavClick = (tabId: string) => {
    setSecurePortalActive(false);
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${getThemeBgClass()}`}>
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <div 
          onClick={() => handleNavClick("home")}
          className="cursor-pointer font-sans text-lg font-bold tracking-tight select-none focus:outline-none focus:ring-1 focus:ring-zinc-400"
          tabIndex={0}
        >
          TechMantra <span className={theme === "green" ? "text-green-400" : "text-zinc-500"}>Nepal</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id && !securePortalActive;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-sans font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 py-1 px-2 ${
                  isActive 
                    ? theme === "green" ? "text-green-400 border-b border-green-400" : theme === "dark" ? "text-zinc-100 border-b border-zinc-100" : "text-zinc-900 border-b border-zinc-950"
                    : theme === "dark" ? "text-zinc-400 hover:text-zinc-100" : theme === "green" ? "text-green-300/80 hover:text-green-300" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={() => setTheme("light")}
            className={`p-1.5 border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
              theme === "light"
                ? "bg-zinc-100 text-zinc-900 border-zinc-400"
                : "text-zinc-400 border-transparent hover:text-zinc-100"
            }`}
          >
            <Sun size={15} />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-1.5 border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
              theme === "dark"
                ? "bg-zinc-800 text-zinc-100 border-zinc-600"
                : "text-zinc-400 border-transparent hover:text-zinc-900"
            }`}
          >
            <Moon size={15} />
          </button>
          <button
            onClick={() => setTheme("green")}
            className={`p-1.5 border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
              theme === "green"
                ? "bg-green-950/45 text-green-400 border-green-800"
                : "text-zinc-400 border-transparent hover:text-green-400"
            }`}
          >
            <Leaf size={15} />
          </button>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`p-1 focus:outline-none focus:ring-1 focus:ring-zinc-400 ${getThemeTextClass()}`}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={`md:hidden border-t px-6 py-4 space-y-4 flex flex-col backdrop-blur-lg ${getThemeBgClass()}`}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id && !securePortalActive;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-sans font-medium text-left text-sm transition-all duration-250 py-1.5 ${
                  isActive
                    ? theme === "green" ? "text-green-400" : "text-zinc-900 font-bold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          
          <div className="h-px bg-zinc-200/20 my-2" />

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center space-x-1.5 text-xs ${theme === "light" ? "text-zinc-950 font-bold" : "text-zinc-500"}`}
            >
              <Sun size={14} /> <span>Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center space-x-1.5 text-xs ${theme === "dark" ? "text-zinc-100 font-bold" : "text-zinc-500"}`}
            >
              <Moon size={14} /> <span>Dark</span>
            </button>
            <button
              onClick={() => setTheme("green")}
              className={`flex items-center space-x-1.5 text-xs ${theme === "green" ? "text-green-400 font-bold" : "text-zinc-500"}`}
            >
              <Leaf size={14} /> <span>Green</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
