import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EnhancedSearch } from "@/components/search/EnhancedSearch";
import { AIRecommendationFeed } from "@/components/recommendations/AIRecommendationFeed";
import { ContextualActionPanel } from "@/components/panels/ContextualActionPanel";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { 
  Bell, 
  User, 
  ChevronDown,
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";

export const BookBasePro = () => {
  const [activeView, setActiveView] = useState("recommended");
  const [selectedBook, setSelectedBook] = useState(null);

  const userStats = {
    booksRead: 24,
    readingStreak: 7,
    knowledgeScore: 87
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar activeItem={activeView} onItemClick={setActiveView} />
        
        <SidebarInset className="flex-1">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
            {/* Mobile Menu + Search */}
            <div className="flex items-center gap-2 flex-1 max-w-2xl">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1">
                <EnhancedSearch />
              </div>
            </div>

            {/* User Area */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* User Stats */}
              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">{userStats.knowledgeScore}</span>
                  <span className="text-xs text-muted-foreground">Knowledge Score</span>
                </div>
                <div className="w-px h-6 bg-border"></div>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive"></Badge>
              </Button>

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* User Menu */}
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="hidden lg:block font-medium">Welcome back</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold gradient-text">Discover Your Next Read</h1>
                    <p className="text-muted-foreground">AI-powered recommendations tailored just for you</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="font-medium">{userStats.booksRead}</span>
                    <span className="text-muted-foreground">books completed this year</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <span className="font-medium">{userStats.readingStreak}</span>
                    <span className="text-muted-foreground">day reading streak</span>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Feed */}
              <AIRecommendationFeed />
            </main>

            {/* Right Panel - Hidden on mobile, shown on larger screens */}
            <aside className="hidden xl:block w-80 p-6 border-l border-border">
              <ContextualActionPanel selectedBook={selectedBook} />
            </aside>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};