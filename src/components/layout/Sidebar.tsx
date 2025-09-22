import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  BookOpen, 
  Grid3X3, 
  Library, 
  Download, 
  Headphones, 
  Heart, 
  Settings, 
  LogOut,
  Zap,
  TrendingUp,
  Target
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export const Sidebar = ({ activeItem, onItemClick }: SidebarProps) => {
  const [readingStreak, setReadingStreak] = useState(7);

  const menuItems = [
    { id: "discover", label: "Discover", icon: Search, badge: null },
    { id: "recommended", label: "AI Recommendations", icon: Zap, badge: "12" },
    { id: "trending", label: "Trending", icon: TrendingUp, badge: null },
    { id: "categories", label: "Categories", icon: Grid3X3, badge: null },
    { id: "library", label: "My Library", icon: Library, badge: "24" },
    { id: "goals", label: "Reading Goals", icon: Target, badge: null },
    { id: "downloads", label: "Downloads", icon: Download, badge: "3" },
    { id: "audiobooks", label: "Audio Books", icon: Headphones, badge: null },
    { id: "favorites", label: "Favorites", icon: Heart, badge: "8" },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">BookBase</h1>
            <p className="text-xs text-sidebar-foreground/60">Pro</p>
          </div>
        </div>
      </div>

      {/* Reading Streak */}
      <div className="p-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-sidebar-foreground">Reading Streak</span>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-text">{readingStreak}</span>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Keep it up! 🔥</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`sidebar-item w-full justify-between ${isActive ? 'active' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className="sidebar-item w-full"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};