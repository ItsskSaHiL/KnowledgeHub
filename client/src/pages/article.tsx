import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Tag, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Article, Domain } from "@shared/schema";
import { STATUS_COLORS } from "@/lib/constants";

export default function Article() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading: articleLoading } = useQuery<Article>({
    queryKey: ["/api/articles", id],
  });

  const { data: domain } = useQuery<Domain>({
    queryKey: ["/api/domains", article?.domainId],
    enabled: !!article?.domainId,
  });

  if (articleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Loading...</div>
          <div className="text-muted-foreground">Fetching article content</div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested article could not be found.</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
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
              {domain && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/domain/${domain.id}`}>{domain.name}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage>{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link href={domain ? `/domain/${domain.id}` : "/"}>
                  <Button variant="outline" size="sm" data-testid="button-back">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <Badge className={STATUS_COLORS[article.status as keyof typeof STATUS_COLORS]}>
                  {article.status}
                </Badge>
              </div>
              <Button variant="outline" data-testid="button-edit-article">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              {article.updatedAt !== article.createdAt && (
                <div className="flex items-center space-x-2">
                  <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
              {domain && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>{domain.name}</span>
                </div>
              )}
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap" data-testid="article-content">
                {article.content}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attachments */}
      {article.attachments.length > 0 && (
        <section className="py-8 bg-card border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold mb-4">Attachments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.attachments.map((attachment, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg" data-testid={`attachment-${index}`}>
                    <div className="text-sm font-medium">{attachment}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
