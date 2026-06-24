import React, { useState, useEffect } from "react";
import { Service, Project, AnalyticsData, ThemeType } from "../types";
import { Plus, Trash, Database, Server, RefreshCw, BarChart2, ShieldCheck, LogOut, Check } from "lucide-react";

class SafeLocalStorage {
  private static fallback: Record<string, string> = {};

  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return this.fallback[key] || null;
    }
  }

  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      this.fallback[key] = value;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete this.fallback[key];
    }
  }
}

interface AdminPanelProps {
  theme: ThemeType;
  services: Service[];
  projects: Project[];
  refreshData: () => void;
}

export default function AdminPanel({
  theme,
  services,
  projects,
  refreshData,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"services" | "projects" | "analytics">("services");

  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceFeatures, setServiceFeatures] = useState("");

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectCategory, setProjectCategory] = useState("Website Development");

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    const savedToken = SafeLocalStorage.getItem("tm_admin_token");
    if (savedToken === "tm-token-session-gated-auth") {
      setIsAuthenticated(true);
      fetchAnalytics();
    }
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      // ignore
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        SafeLocalStorage.setItem("tm_admin_token", data.token);
        setIsAuthenticated(true);
        fetchAnalytics();
      } else {
        setErrorMsg("Invalid username or password");
      }
    } catch (err) {
      setErrorMsg("Network error occurred");
    }
  };

  const handleLogout = () => {
    SafeLocalStorage.removeItem("tm_admin_token");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !serviceDesc) return;

    try {
      const featuresArr = serviceFeatures
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SafeLocalStorage.getItem("tm_admin_token")}`
        },
        body: JSON.stringify({
          name: serviceName,
          description: serviceDesc,
          features: featuresArr
        })
      });

      if (res.ok) {
        setServiceName("");
        setServiceDesc("");
        setServiceFeatures("");
        refreshData();
        fetchAnalytics();
      }
    } catch (err) {
      // ignore
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${SafeLocalStorage.getItem("tm_admin_token")}`
        }
      });
      if (res.ok) {
        refreshData();
        fetchAnalytics();
      }
    } catch (err) {
      // ignore
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDesc) return;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SafeLocalStorage.getItem("tm_admin_token")}`
        },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDesc,
          category: projectCategory,
          image: "custom_project_design"
        })
      });

      if (res.ok) {
        setProjectTitle("");
        setProjectDesc("");
        setProjectCategory("Website Development");
        refreshData();
        fetchAnalytics();
      }
    } catch (err) {
      // ignore
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${SafeLocalStorage.getItem("tm_admin_token")}`
        }
      });
      if (res.ok) {
        refreshData();
        fetchAnalytics();
      }
    } catch (err) {
      // ignore
    }
  };

  const handleSyncCloud = async () => {
    setSyncLoading(true);
    setSyncSuccess(false);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      if (res.ok) {
        setTimeout(() => {
          setSyncLoading(false);
          setSyncSuccess(true);
          fetchAnalytics();
        }, 1200);
      }
    } catch (err) {
      setSyncLoading(false);
    }
  };

  const bgClass =
    theme === "dark"
      ? "bg-zinc-950 border-zinc-900 text-zinc-100"
      : theme === "green"
        ? "bg-zinc-950 border-green-950 text-green-100"
        : "bg-white border-zinc-200 text-zinc-900";

  const cardClass =
    theme === "dark"
      ? "bg-zinc-900/50 border-zinc-800"
      : theme === "green"
        ? "bg-zinc-900/40 border-green-900/50"
        : "bg-zinc-50 border-zinc-200";

  const inputClass =
    theme === "dark"
      ? "bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-zinc-500"
      : theme === "green"
        ? "bg-zinc-900 border-green-900 text-zinc-100 focus:border-green-400"
        : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-500";

  const buttonClass =
    theme === "green"
      ? "bg-green-600 text-zinc-950 hover:bg-green-500"
      : theme === "dark"
        ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
        : "bg-zinc-950 text-white hover:bg-zinc-800";

  if (!isAuthenticated) {
    return (
      <div className={`max-w-md mx-auto my-16 border p-8 backdrop-blur-md ${cardClass}`}>
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheck size={20} className={theme === "green" ? "text-green-400" : "text-zinc-600"} />
          <h2 className="font-sans font-bold tracking-tight text-lg uppercase">
            Secure Gateway Access
          </h2>
        </div>
        <p className="font-sans text-xs text-zinc-500 mb-6">
          Gated system node: admin.techmantranepal.com.np
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-2">
              System Identifier
            </label>
            <input
              type="text"
              required
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-2.5 text-sm font-mono focus:outline-none transition-all duration-200 ${inputClass}`}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-mono text-zinc-500 mb-2">
              Credential Key
            </label>
            <input
              type="password"
              required
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2.5 text-sm font-mono focus:outline-none transition-all duration-200 ${inputClass}`}
            />
          </div>

          {errorMsg && (
            <div className="text-red-500 font-mono text-xs py-1">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-all duration-200 ${buttonClass}`}
          >
            Authenticate Node
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`border p-6 md:p-8 backdrop-blur-md ${cardClass}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Host Domain Active
            </span>
          </div>
          <h2 className="font-sans font-bold tracking-tight text-xl uppercase mt-1">
            admin.techmantranepal.com.np
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-3 py-1.5 font-mono text-xs uppercase transition-all duration-200 ${
              activeTab === "services"
                ? "bg-zinc-805 text-zinc-100 border border-zinc-700 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Services API
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3 py-1.5 font-mono text-xs uppercase transition-all duration-200 ${
              activeTab === "projects"
                ? "bg-zinc-805 text-zinc-100 border border-zinc-700 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Projects API
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 font-mono text-xs uppercase transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-zinc-805 text-zinc-100 border border-zinc-700 font-bold"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Analytics DB
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 text-red-400 hover:text-red-300 transition-colors focus:outline-none"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {activeTab === "services" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="font-sans font-bold text-sm uppercase mb-4 tracking-wider">
              Publish Service
            </h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-500 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cloud Integration"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className={`w-full p-2.5 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-500 mb-1">
                  Core Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Service description specifications..."
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  className={`w-full p-2.5 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-500 mb-1">
                  Features (comma-separated list)
                </label>
                <input
                  type="text"
                  placeholder="Feature A, Feature B, Feature C"
                  value={serviceFeatures}
                  onChange={(e) => setServiceFeatures(e.target.value)}
                  className={`w-full p-2.5 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 ${buttonClass}`}
              >
                <Plus size={14} />
                <span>Inject Service</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-sans font-bold text-sm uppercase mb-4 tracking-wider">
              Structured Services Nodes
            </h3>
            <div className="space-y-3">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className={`flex items-center justify-between border p-4 ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-900"
                      : theme === "green"
                        ? "bg-zinc-950 border-green-950/40"
                        : "bg-white border-zinc-150"
                  }`}
                >
                  <div>
                    <h4 className="font-sans font-semibold text-sm">
                      {svc.name}
                    </h4>
                    <p className="font-sans text-xs text-zinc-500 mt-1 max-w-md">
                      {svc.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteService(svc.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors focus:outline-none"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="font-sans font-bold text-sm uppercase mb-4 tracking-wider">
              Publish Project Node
            </h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-500 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Everest FinTech"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className={`w-full p-2.5 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-500 mb-1">
                  Technical Category
                </label>
                <select
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value)}
                  className={`w-full p-2.5 text-sm focus:outline-none ${inputClass}`}
                >
                  <option value="Website Development">Website Development</option>
                  <option value="App Development">App Development</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Graphics Design">Graphics Design</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-500 mb-1">
                  Core Description Text
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Project implementation details..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className={`w-full p-2.5 text-sm focus:outline-none ${inputClass}`}
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 ${buttonClass}`}
              >
                <Plus size={14} />
                <span>Inject Project</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-sans font-bold text-sm uppercase mb-4 tracking-wider">
              Project Nodes Database
            </h3>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`flex items-center justify-between border p-4 ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-900"
                      : theme === "green"
                        ? "bg-zinc-950 border-green-950/40"
                        : "bg-white border-zinc-150"
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] uppercase border px-1.5 text-zinc-500 border-zinc-200/30">
                        {proj.category}
                      </span>
                    </div>
                    <h4 className="font-sans font-semibold text-sm mt-1">
                      {proj.title}
                    </h4>
                    <p className="font-sans text-xs text-zinc-500 mt-1 max-w-md">
                      {proj.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors focus:outline-none"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-5 border flex flex-col justify-between ${
              theme === "dark" ? "bg-zinc-950 border-zinc-900" : theme === "green" ? "bg-zinc-950 border-green-950/40" : "bg-white border-zinc-150"
            }`}>
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-xs uppercase">Traffic Node</span>
                <BarChart2 size={16} />
              </div>
              <div className="mt-4">
                <span className="font-mono text-2xl font-bold">
                  {analytics?.visitorsCount || 0}
                </span>
                <p className="font-sans text-[10px] text-zinc-500 uppercase mt-1">
                  Unique Connections
                </p>
              </div>
            </div>

            <div className={`p-5 border flex flex-col justify-between ${
              theme === "dark" ? "bg-zinc-950 border-zinc-900" : theme === "green" ? "bg-zinc-950 border-green-950/40" : "bg-white border-zinc-150"
            }`}>
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-xs uppercase">Services API</span>
                <Server size={16} />
              </div>
              <div className="mt-4">
                <span className="font-mono text-2xl font-bold">
                  {analytics?.servicesCount || 0}
                </span>
                <p className="font-sans text-[10px] text-zinc-500 uppercase mt-1">
                  Endpoints Configured
                </p>
              </div>
            </div>

            <div className={`p-5 border flex flex-col justify-between ${
              theme === "dark" ? "bg-zinc-950 border-zinc-900" : theme === "green" ? "bg-zinc-950 border-green-950/40" : "bg-white border-zinc-150"
            }`}>
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-xs uppercase">Projects Node</span>
                <Database size={16} />
              </div>
              <div className="mt-4">
                <span className="font-mono text-2xl font-bold">
                  {analytics?.projectsCount || 0}
                </span>
                <p className="font-sans text-[10px] text-zinc-500 uppercase mt-1">
                  Verified Injections
                </p>
              </div>
            </div>

            <div className={`p-5 border flex flex-col justify-between ${
              theme === "dark" ? "bg-zinc-950 border-zinc-900" : theme === "green" ? "bg-zinc-950 border-green-950/40" : "bg-white border-zinc-150"
            }`}>
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-xs uppercase">Database Sync</span>
                <RefreshCw size={16} />
              </div>
              <div className="mt-4">
                <span className={`font-mono text-sm font-bold uppercase ${analytics?.dbSynced ? "text-emerald-500" : "text-amber-500"}`}>
                  {analytics?.dbSynced ? "Synchronized" : "Pending Sync"}
                </span>
                <p className="font-sans text-[10px] text-zinc-500 uppercase mt-1">
                  Supabase Endpoint Status
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 border ${
            theme === "dark" ? "bg-zinc-950 border-zinc-900" : theme === "green" ? "bg-zinc-950 border-green-950/40" : "bg-white border-zinc-150"
          }`}>
            <h4 className="font-sans font-bold text-sm uppercase mb-2 tracking-wider">
              Cloud Synchronization Setup
            </h4>
            <p className="font-sans text-xs text-zinc-500 mb-6 max-w-xl">
              Sync database states natively to external distributed Supabase clusters for failover backups. This action writes current cached snapshots securely to cloud storage.
            </p>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSyncCloud}
                disabled={syncLoading}
                className={`py-2 px-4 text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 focus:outline-none transition-all duration-200 ${buttonClass}`}
              >
                {syncLoading ? (
                  <RefreshCw className="animate-spin" size={14} />
                ) : syncSuccess ? (
                  <Check size={14} />
                ) : (
                  <RefreshCw size={14} />
                )}
                <span>
                  {syncLoading ? "Encrypting snapshot..." : syncSuccess ? "Cloud Synced Successful" : "Force Sync Backup"}
                </span>
              </button>

              {syncSuccess && (
                <span className="text-emerald-500 font-mono text-xs">
                  Snapshot backup successfully stored on decentralized databases.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
