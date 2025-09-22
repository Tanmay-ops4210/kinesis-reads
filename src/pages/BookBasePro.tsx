import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeView} 
        onItemClick={setActiveView} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <EnhancedSearch />
          </div>

          {/* User Area */}
          <div className="flex items-center gap-4">
            {/* User Stats */}
            <div className="hidden md:flex items-center gap-4">
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
              <span className="hidden md:block font-medium">Welcome back</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Discover Your Next Read</h1>
                  <p className="text-muted-foreground">AI-powered recommendations tailored just for you</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 mt-6">
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

          {/* Right Panel */}
          <aside className="w-80 p-6 border-l border-border">
            <ContextualActionPanel selectedBook={selectedBook} />
          </aside>
        </div>
      </div>
    </div>
  );
};