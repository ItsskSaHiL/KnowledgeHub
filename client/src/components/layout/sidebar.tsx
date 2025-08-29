import { Link } from "wouter";
import { Home, Bookmark, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import type { Domain } from "@shared/schema";

export function Sidebar() {
  const { data: domains } = useQuery<Domain[]>({
    queryKey: ["/api/domains"],
  });

  const featuredDomains = domains?.slice(0, 2) || [];

  return (
    <aside className="hidden lg:block w-64 bg-card border-r border-border content-area overflow-y-auto">
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Quick Access
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent" data-testid="sidebar-overview">
                    <Home className="w-4 h-4" />
                    <span>Overview</span>
                  </a>
                </Link>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent" data-testid="sidebar-bookmarks">
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmarks</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent" data-testid="sidebar-recent">
                  <Clock className="w-4 h-4" />
                  <span>Recent</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Progress
            </h3>
            <div className="space-y-3">
              {featuredDomains.map((domain) => (
                <div key={domain.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{domain.name}</span>
                    <span className="text-xs text-muted-foreground">{domain.progress}%</span>
                  </div>
                  <Progress value={domain.progress} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
