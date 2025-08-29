import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Domain, Article, Project } from "@shared/schema";
import { DOMAIN_COLORS, STATUS_COLORS } from "@/lib/constants";

export default function Domain() {
  const { id } = useParams<{ id: string }>();

  const { data: domain, isLoading: domainLoading } = useQuery<Domain>({
    queryKey: ["/api/domains", id],
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    select: (data) => data.filter(article => article.domainId === id),
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    select: (data) => data.filter(project => project.domainId === id),
  });

  if (domainLoading || articlesLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Loading...</div>
          <div className="text-muted-foreground">Fetching domain content</div>
        </div>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Domain Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested domain could not be found.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const iconColorClass = DOMAIN_COLORS[domain.color as keyof typeof DOMAIN_COLORS] || DOMAIN_COLORS.blue;

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
                <BreadcrumbPage>{domain.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Domain Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-6">
          <div className="flex items-start space-x-6">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${iconColorClass}`}>
              <i className={`${domain.icon} text-2xl`} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{domain.name}</h1>
              <p className="text-muted-foreground text-lg mb-4">{domain.description}</p>
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{articles?.length || 0} articles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Folder className="w-4 h-4" />
                  <span className="text-sm">{projects?.length || 0} projects</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{domain.progress}%</span>
                </div>
                <Progress value={domain.progress} className="h-2" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button data-testid="button-add-content">
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
              <Link href="/">
                <Button variant="outline" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Articles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Articles</h2>
              <Button variant="outline" size="sm" data-testid="button-view-all-articles">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {articles?.length ? (
                articles.map((article) => (
                  <Link key={article.id} href={`/article/${article.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-article-${article.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold line-clamp-2">{article.title}</h3>
                          <Badge className={`ml-2 ${STATUS_COLORS[article.status as keyof typeof STATUS_COLORS]}`}>
                            {article.status}
                          </Badge>
                        </div>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No articles found in this domain.</p>
                  <Button variant="outline" className="mt-4" data-testid="button-create-first-article">
                    Create your first article
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Projects</h2>
              <Button variant="outline" size="sm" data-testid="button-view-all-projects">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {projects?.length ? (
                projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow" data-testid={`card-project-${project.id}`}>
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
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 2).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 2} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-github-${project.id}`}>
                                GitHub
                              </a>
                            </Button>
                          )}
                          {project.demoUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-demo-${project.id}`}>
                                Demo
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No projects found in this domain.</p>
                  <Button variant="outline" className="mt-4" data-testid="button-create-first-project">
                    Create your first project
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
