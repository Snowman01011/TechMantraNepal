import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
}

let DATA_FILE_PATH = path.join(process.cwd(), "techmantra_data.json");

const defaultServices: Service[] = [
  {
    id: "web-dev",
    name: "Website Development",
    description: "High-performance websites crafted with modern architectures like React and Node.",
    icon: "Globe",
    features: ["Responsive layouts", "SEO optimization Optimization", "Custom design system"]
  },
  {
    id: "app-dev",
    name: "App Development",
    description: "Multi-platform iOS and Android mobile apps designed for seamless user experiences.",
    icon: "Smartphone",
    features: ["Offline usability", "Native execution performance", "Elegant interaction layouts"]
  },
  {
    id: "dig-market",
    name: "Digital Marketing",
    description: "Strategic campaign coordination and search engine placement to maximize reach.",
    icon: "TrendingUp",
    features: ["Data-driven analytics", "Content creation systems", "Targeted conversion metrics"]
  },
  {
    id: "graph-design",
    name: "Graphics Design",
    description: "Consistent branding guides and high-impact custom vector art directions.",
    icon: "Palette",
    features: ["Brand identity packages", "Corporate presentation layouts", "Interactive social structures"]
  }
];

const defaultProjects: Project[] = [
  {
    id: "proj-1",
    title: "TechMantra Portal",
    category: "Website Development",
    description: "A fast portal design featuring a light-dark-green theme system.",
    image: "portal_design",
  },
  {
    id: "proj-2",
    title: "Nepal Agro Tech App",
    category: "App Development",
    description: "Mobile application supporting localized tracking for agriculture.",
    image: "agro_app",
  },
  {
    id: "proj-3",
    title: "EcoBrand Identity",
    category: "Graphics Design",
    description: "Comprehensive sustainable brand guideline and vector suite.",
    image: "eco_design",
  }
];

let services: Service[] = [...defaultServices];
let projects: Project[] = [...defaultProjects];
let visitorsCount = 142;
let dbSynced = true;

try {
  if (fs.existsSync(DATA_FILE_PATH)) {
    const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed.services) services = parsed.services;
    if (parsed.projects) projects = parsed.projects;
    if (parsed.visitorsCount) visitorsCount = parsed.visitorsCount;
  } else {
    DATA_FILE_PATH = path.join("/tmp", "techmantra_data.json");
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed.services) services = parsed.services;
      if (parsed.projects) projects = parsed.projects;
      if (parsed.visitorsCount) visitorsCount = parsed.visitorsCount;
    }
  }
} catch (e) {
  DATA_FILE_PATH = path.join("/tmp", "techmantra_data.json");
}

function saveData() {
  try {
    const data = JSON.stringify({ services, projects, visitorsCount }, null, 2);
    fs.writeFileSync(DATA_FILE_PATH, data, "utf8");
  } catch (e) {
    try {
      const altPath = path.join("/tmp", "techmantra_data.json");
      const data = JSON.stringify({ services, projects, visitorsCount }, null, 2);
      fs.writeFileSync(altPath, data, "utf8");
    } catch (err) {
      // ignore
    }
  }
}

app.get("/api/services", (req, res) => {
  visitorsCount += 1;
  saveData();
  res.json({ services });
});

app.post("/api/services", (req, res) => {
  const { name, description, icon, features } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newService: Service = {
    id: "service-" + Date.now(),
    name,
    description,
    icon: icon || "Settings",
    features: Array.isArray(features) ? features : []
  };
  services.push(newService);
  dbSynced = false;
  saveData();
  res.status(201).json(newService);
});

app.delete("/api/services/:id", (req, res) => {
  const { id } = req.params;
  services = services.filter(s => s.id !== id);
  dbSynced = false;
  saveData();
  res.json({ success: true });
});

app.get("/api/projects", (req, res) => {
  res.json({ projects });
});

app.post("/api/projects", (req, res) => {
  const { title, category, description, image, link } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newProject: Project = {
    id: "project-" + Date.now(),
    title,
    category,
    description,
    image: image || "default_image",
    link
  };
  projects.push(newProject);
  dbSynced = false;
  saveData();
  res.status(201).json(newProject);
});

app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  projects = projects.filter(p => p.id !== id);
  dbSynced = false;
  saveData();
  res.json({ success: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    return res.json({ token: "tm-token-session-gated-auth" });
  }
  res.status(401).json({ error: "Unauthorized" });
});

app.get("/api/auth-verify", (req, res) => {
  const auth = req.headers.authorization;
  if (auth === "Bearer tm-token-session-gated-auth") {
    return res.json({ valid: true });
  }
  res.status(401).json({ error: "Unauthorized" });
});

app.post("/api/sync", (req, res) => {
  dbSynced = true;
  res.json({ success: true, timestamp: new Date().toISOString() });
});

app.get("/api/analytics", (req, res) => {
  res.json({
    visitorsCount,
    servicesCount: services.length,
    projectsCount: projects.length,
    dbSynced
  });
});

async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    // server listening
  });
}

main();
