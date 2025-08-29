import { Link } from "wouter";
import { ArrowRight, FileText, Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Domain } from "@shared/schema";
import { DOMAIN_COLORS, STATUS_COLORS, PROGRESS_CLASSES } from "@/lib/constants";

interface DomainCardProps {
  domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
  const getStatusText = (progress: number) => {
    if (progress === 100) return "Complete";
    if (progress >= 75) return "75% Complete";
    if (progress >= 50) return "50% Complete";
    return "25% Complete";
  };

  const getStatusColor = (progress: number) => {
    if (progress === 100) return STATUS_COLORS.completed;
    if (progress >= 75) return STATUS_COLORS.completed;
    if (progress >= 50) return STATUS_COLORS['in-progress'];
    return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
  };

  const getProgressClass = (progress: number) => {
    if (progress >= 75) return 'progress-75';
    if (progress >= 50) return 'progress-50';
    if (progress >= 25) return 'progress-25';
    return 'progress-25';
  };

  const iconColorClass = DOMAIN_COLORS[domain.color as keyof typeof DOMAIN_COLORS] || DOMAIN_COLORS.blue;

  return (
    <Link href={`/domain/${domain.id}`}>
      <Card className={`category-card progress-indicator ${getProgressClass(domain.progress)} cursor-pointer`} data-testid={`card-domain-${domain.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColorClass}`}>
              <i className={`${domain.icon} text-xl`} />
            </div>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor(domain.progress)}`}>
              {getStatusText(domain.progress)}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2">{domain.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{domain.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                {domain.articlesCount} articles
              </span>
              <span className="flex items-center">
                <Folder className="w-3 h-3 mr-1" />
                {domain.projectsCount} projects
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-primary hover:text-primary/80 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
