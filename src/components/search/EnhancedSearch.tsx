import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Mic, 
  MicOff, 
  BookOpen, 
  User, 
  Hash, 
  Sparkles,
  Clock,
  TrendingUp
} from "lucide-react";

interface SearchSuggestion {
  id: string;
  type: "book" | "author" | "topic" | "concept" | "trending";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
}

export const EnhancedSearch = () => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions: SearchSuggestion[] = [
    {
      id: "1",
      type: "book",
      title: "The Psychology of Money",
      subtitle: "Chapter 4: Confounding Compounding",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: "2", 
      type: "author",
      title: "James Clear",
      subtitle: "Author • 3 books in your library",
      icon: <User className="w-4 h-4" />
    },
    {
      id: "3",
      type: "concept",
      title: "Behavioral Economics",
      subtitle: "Concept from your notes",
      icon: <Hash className="w-4 h-4" />
    },
    {
      id: "4",
      type: "trending",
      title: "Innovation mindset",
      subtitle: "Trending in Business",
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  const recentSearches = [
    "habit formation techniques",
    "financial psychology",
    "startup methodologies"
  ];

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Voice search implementation would go here
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowSuggestions(false);
    // Search implementation would go here
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="search-enhanced rounded-xl p-1 flex items-center gap-2">
        <Search className="w-5 h-5 text-muted-foreground ml-3" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search books, authors, concepts, or ask questions..."
          className="border-0 bg-transparent focus-visible:ring-0 text-base"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVoiceSearch}
          className={`mr-1 ${isListening ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-0 border-0 shadow-strong z-50 glass-card">
          <div className="p-4">
            {/* AI Suggestions */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI Suggestions</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.title)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <div className="text-muted-foreground">{suggestion.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{suggestion.title}</div>
                      {suggestion.subtitle && (
                        <div className="text-sm text-muted-foreground">{suggestion.subtitle}</div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {suggestion.type}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Recent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(search)}
                    className="text-xs h-7"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Voice Search Indicator */}
      {isListening && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive-foreground rounded-full animate-pulse"></div>
            Listening...
          </div>
        </div>
      )}
    </div>
  );
};