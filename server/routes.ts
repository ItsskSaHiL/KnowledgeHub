import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDomainSchema, insertArticleSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Domain routes
  app.get("/api/domains", async (req, res) => {
    try {
      const domains = await storage.getDomains();
      res.json(domains);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch domains" });
    }
  });

  app.get("/api/domains/:id", async (req, res) => {
    try {
      const domain = await storage.getDomain(req.params.id);
      if (!domain) {
        return res.status(404).json({ message: "Domain not found" });
      }
      res.json(domain);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch domain" });
    }
  });

  app.post("/api/domains", async (req, res) => {
    try {
      const validation = insertDomainSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid domain data", errors: validation.error.errors });
      }
      const domain = await storage.createDomain(validation.data);
      res.status(201).json(domain);
    } catch (error) {
      res.status(500).json({ message: "Failed to create domain" });
    }
  });

  // Article routes
  app.get("/api/articles", async (req, res) => {
    try {
      const domainId = req.query.domainId as string;
      const articles = await storage.getArticles(domainId);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validation = insertArticleSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid article data", errors: validation.error.errors });
      }
      const article = await storage.createArticle(validation.data);
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.patch("/api/articles/:id", async (req, res) => {
    try {
      const validation = insertArticleSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid article data", errors: validation.error.errors });
      }
      const article = await storage.updateArticle(req.params.id, validation.data);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteArticle(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const domainId = req.query.domainId as string;
      const featured = req.query.featured === 'true';
      
      let projects;
      if (featured) {
        projects = await storage.getFeaturedProjects();
      } else {
        projects = await storage.getProjects(domainId);
      }
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validation = insertProjectSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid project data", errors: validation.error.errors });
      }
      const project = await storage.createProject(validation.data);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const validation = insertProjectSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid project data", errors: validation.error.errors });
      }
      const project = await storage.updateProject(req.params.id, validation.data);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Search routes
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const articles = await storage.searchArticles(query);
      res.json({ articles });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
