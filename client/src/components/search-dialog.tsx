import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");

  const { data: searchResults, isLoading } = useQuery<{ articles: Article[] }>({
    queryKey: ["/api/search", { q: query }],
    enabled: query.length > 0,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Knowledge Base</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles, projects, and notes..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="search-dialog-input"
            />
          </div>
          
          {query && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Searching...
                </div>
              ) : searchResults?.articles.length ? (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Articles ({searchResults.articles.length})
                  </h3>
                  {searchResults.articles.map((article) => (
                    <div key={article.id} className="p-3 border border-border rounded-lg hover:bg-accent cursor-pointer" data-testid={`search-result-${article.id}`}>
                      <h4 className="font-medium">{article.title}</h4>
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {article.tags.map((tag) => (
                          <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
