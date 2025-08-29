import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Project, Domain } from "@shared/schema";
import { STATUS_COLORS } from "@/lib/constants";

export default function Portfolio() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: domains } = useQuery<Domain[]>({
    queryKey: ["/api/domains"],
  });

  const { data: featuredProjects } = useQuery<Project[]>({
    queryKey: ["/api/projects", { featured: true }],
  });

  const getDomainName = (domainId: string) => {
    return domains?.find(d => d.id === domainId)?.name || "Unknown Domain";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Loading...</div>
          <div className="text-muted-foreground">Fetching your projects</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Portfolio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Portfolio Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Portfolio</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A showcase of my projects across various technology domains, demonstrating practical applications of my knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button data-testid="button-add-project">
              Add New Project
            </Button>
            <Button variant="secondary" data-testid="button-view-all">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow" data-testid={`featured-project-${project.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <Badge className={STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{getDomainName(project.domainId)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-testid={`github-${project.id}`}>
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" data-testid={`demo-${project.id}`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">All Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow" data-testid={`project-${project.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold line-clamp-2">{project.title}</h3>
                    <Badge className={`ml-2 ${STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="text-xs text-muted-foreground mb-3">
                    {getDomainName(project.domainId)} • {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-testid={`github-${project.id}`}>
                            <Github className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                      {project.demoUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" data-testid={`demo-${project.id}`}>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!projects?.length && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-lg font-medium mb-2">No Projects Yet</div>
              <p className="mb-4">Start building your portfolio by adding your first project.</p>
              <Button data-testid="button-create-first-project">
                Create Your First Project
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
