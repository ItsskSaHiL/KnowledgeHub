import { type Domain, type Article, type Project, type InsertDomain, type InsertArticle, type InsertProject } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Domains
  getDomains(): Promise<Domain[]>;
  getDomain(id: string): Promise<Domain | undefined>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: string, domain: Partial<InsertDomain>): Promise<Domain | undefined>;
  deleteDomain(id: string): Promise<boolean>;

  // Articles
  getArticles(domainId?: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  searchArticles(query: string): Promise<Article[]>;

  // Projects
  getProjects(domainId?: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  getFeaturedProjects(): Promise<Project[]>;

  // Stats
  getStats(): Promise<{
    totalArticles: number;
    totalProjects: number;
    totalDomains: number;
    hoursLearned: number;
  }>;
}

export class MemStorage implements IStorage {
  private domains: Map<string, Domain>;
  private articles: Map<string, Article>;
  private projects: Map<string, Project>;

  constructor() {
    this.domains = new Map();
    this.articles = new Map();
    this.projects = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const defaultDomains: Domain[] = [
      {
        id: "embedded-systems",
        name: "Embedded Systems",
        description: "Bare-metal programming, RTOS, device drivers, bootloaders, and debugging techniques.",
        icon: "fas fa-microchip",
        color: "blue",
        progress: 75,
        articlesCount: 42,
        projectsCount: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "ai-ml",
        name: "AI & Machine Learning",
        description: "TinyML, TensorFlow Lite, deep learning basics, and edge device optimization.",
        icon: "fas fa-brain",
        color: "purple",
        progress: 50,
        articlesCount: 28,
        projectsCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "operating-systems",
        name: "Operating Systems",
        description: "Linux kernel internals, Android OS development, iOS/macOS, and RTOS concepts.",
        icon: "fas fa-server",
        color: "green",
        progress: 25,
        articlesCount: 18,
        projectsCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "hardware-architectures",
        name: "Hardware Architectures",
        description: "ARM Cortex-M/A, RISC-V, x86, GPU, and parallel processing architectures.",
        icon: "fas fa-memory",
        color: "red",
        progress: 100,
        articlesCount: 35,
        projectsCount: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "programming-languages",
        name: "Programming Languages",
        description: "C, C++, Rust, Python, Shell scripting, and Assembly programming.",
        icon: "fas fa-code",
        color: "indigo",
        progress: 75,
        articlesCount: 52,
        projectsCount: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "tools-devops",
        name: "Tools & DevOps",
        description: "Git, Jenkins, CI/CD, Docker, virtualization, and version control workflows.",
        icon: "fas fa-tools",
        color: "teal",
        progress: 50,
        articlesCount: 24,
        projectsCount: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "networking-protocols",
        name: "Networking & Protocols",
        description: "TCP/UDP, MQTT, HTTP/HTTPS, WiFi, BLE, LoRa, CAN, and automotive protocols.",
        icon: "fas fa-network-wired",
        color: "cyan",
        progress: 25,
        articlesCount: 19,
        projectsCount: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "iot-cloud",
        name: "IoT & Cloud",
        description: "IoT architecture, gateways, edge devices, backend servers, and cloud deployment.",
        icon: "fas fa-cloud",
        color: "orange",
        progress: 50,
        articlesCount: 22,
        projectsCount: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "product-development",
        name: "Product Development",
        description: "Product design, prototyping, testing, validation, and agile development lifecycle.",
        icon: "fas fa-rocket",
        color: "pink",
        progress: 25,
        articlesCount: 15,
        projectsCount: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaultDomains.forEach(domain => this.domains.set(domain.id, domain));
  }

  async getDomains(): Promise<Domain[]> {
    return Array.from(this.domains.values());
  }

  async getDomain(id: string): Promise<Domain | undefined> {
    return this.domains.get(id);
  }

  async createDomain(insertDomain: InsertDomain): Promise<Domain> {
    const id = randomUUID();
    const domain: Domain = {
      ...insertDomain,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.domains.set(id, domain);
    return domain;
  }

  async updateDomain(id: string, updateData: Partial<InsertDomain>): Promise<Domain | undefined> {
    const domain = this.domains.get(id);
    if (!domain) return undefined;

    const updatedDomain = { ...domain, ...updateData, updatedAt: new Date() };
    this.domains.set(id, updatedDomain);
    return updatedDomain;
  }

  async deleteDomain(id: string): Promise<boolean> {
    return this.domains.delete(id);
  }

  async getArticles(domainId?: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    return domainId ? articles.filter(a => a.domainId === domainId) : articles;
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      ...insertArticle,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;

    const updatedArticle = { ...article, ...updateData, updatedAt: new Date() };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getProjects(domainId?: string): Promise<Project[]> {
    const projects = Array.from(this.projects.values());
    return domainId ? projects.filter(p => p.domainId === domainId) : projects;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = { ...project, ...updateData, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.featured);
  }

  async getStats(): Promise<{
    totalArticles: number;
    totalProjects: number;
    totalDomains: number;
    hoursLearned: number;
  }> {
    return {
      totalArticles: this.articles.size,
      totalProjects: this.projects.size,
      totalDomains: this.domains.size,
      hoursLearned: 1240,
    };
  }
}

export const storage = new MemStorage();
