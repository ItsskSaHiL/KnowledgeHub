import { useState } from "react";
import { Link } from "wouter";
import { Search, Menu, Sun, Moon, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { SearchDialog } from "@/components/search-dialog";
import { ContentModal } from "@/components/content-modal";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Knowledge Hub</h1>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-6 ml-8">
              <Link href="/">
                <a className="text-foreground hover:text-primary transition-colors font-medium" data-testid="nav-home">
                  Home
                </a>
              </Link>
              <Link href="/portfolio">
                <a className="text-muted-foreground hover:text-primary transition-colors" data-testid="nav-portfolio">
                  Portfolio
                </a>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Input
                type="text"
                placeholder="Search knowledge..."
                className="w-64 pl-10"
                onClick={() => setIsSearchOpen(true)}
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Add Content Button */}
            <Button 
              onClick={() => setIsContentModalOpen(true)}
              data-testid="button-add-content"
            >
              Add Content
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Button variant="outline" size="icon" className="md:hidden" data-testid="button-mobile-menu">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <ContentModal open={isContentModalOpen} onOpenChange={setIsContentModalOpen} />
    </>
  );
}
