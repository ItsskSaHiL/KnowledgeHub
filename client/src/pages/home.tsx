import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DomainCard } from "@/components/domain-card";
import type { Domain } from "@shared/schema";

export default function Home() {
  const { data: domains, isLoading } = useQuery<Domain[]>({
    queryKey: ["/api/domains"],
  });

  const { data: stats } = useQuery<{
    totalArticles: number;
    totalProjects: number;
    totalDomains: number;
    hoursLearned: number;
  }>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Loading...</div>
          <div className="text-muted-foreground">Fetching your knowledge domains</div>
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
                <BreadcrumbPage>Knowledge Domains</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Personal Knowledge Hub</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive archive of my learnings, projects, and insights across multiple domains of technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button data-testid="button-hero-add-content">
              <Plus className="w-4 h-4 mr-2" />
              Add New Content
            </Button>
            <Button variant="secondary" data-testid="button-hero-explore">
              <Search className="w-4 h-4 mr-2" />
              Explore Knowledge
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary" data-testid="stat-articles">
                {stats?.totalArticles || 0}
              </div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary" data-testid="stat-projects">
                {stats?.totalProjects || 0}
              </div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary" data-testid="stat-domains">
                {stats?.totalDomains || 0}
              </div>
              <div className="text-sm text-muted-foreground">Domains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary" data-testid="stat-hours">
                {stats?.hoursLearned || 0}
              </div>
              <div className="text-sm text-muted-foreground">Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Domains Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Knowledge Domains</h2>
            <div className="flex items-center space-x-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-40" data-testid="select-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" data-testid="button-grid-view">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" data-testid="button-list-view">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains?.map((domain) => (
              <DomainCard key={domain.id} domain={domain} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder recent activity items */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                    <i className="fas fa-file-alt text-blue-600 dark:text-blue-400 text-xs"></i>
                  </div>
                  <span className="text-sm text-muted-foreground">Article</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <h3 className="font-semibold mb-2">Understanding ARM Cortex-M Exception Handling</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Deep dive into exception vectors, stack operations, and interrupt handling.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Embedded Systems</Badge>
                  <Badge variant="outline">ARM</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
