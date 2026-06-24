export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link?: string;
}

export interface AnalyticsData {
  visitorsCount: number;
  servicesCount: number;
  projectsCount: number;
  dbSynced: boolean;
}

export type ThemeType = "light" | "dark" | "green";
