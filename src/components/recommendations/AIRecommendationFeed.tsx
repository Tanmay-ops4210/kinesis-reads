import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/books/BookCard";
import { 
  Sparkles, 
  Users, 
  MapPin, 
  Target, 
  RefreshCw, 
  Filter,
  TrendingUp,
  Brain,
  Calendar
} from "lucide-react";

// Import book covers
import psychologyMoneyImg from "@/assets/books/psychology-money.jpg";
import innovationImg from "@/assets/books/how-innovation-works.jpg";
import companyOneImg from "@/assets/books/company-of-one.jpg";
import atomicHabitsImg from "@/assets/books/atomic-habits.jpg";

interface RecommendationSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  books: any[];
  type: "personalized" | "trending" | "social" | "knowledge";
}

export const AIRecommendationFeed = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const recommendations: RecommendationSection[] = [
    {
      id: "readers-like-you",
      title: "Readers Like You Also Read",
      subtitle: "Based on your profile: Product Manager, Tech Industry",
      icon: <Users className="w-5 h-5" />,
      type: "personalized",
      books: [
        {
          id: "1",
          title: "The Psychology of Money",
          author: "Morgan Housel",
          cover: psychologyMoneyImg,
          rating: 4.8,
          reviews: 15420,
          readingTime: 6,
          knowledgeDensity: 7,
          category: "Finance",
          aiReason: "Similar to readers who enjoyed behavioral economics books in your library"
        },
        {
          id: "2", 
          title: "How Innovation Works",
          author: "Matt Ridley",
          cover: innovationImg,
          rating: 4.6,
          reviews: 8932,
          readingTime: 8,
          knowledgeDensity: 8,
          category: "Business",
          aiReason: "Complements your interest in startup methodologies"
        }
      ]
    },
    {
      id: "trending-network",
      title: "Trending in Your Network",
      subtitle: "Popular among Product Managers in San Francisco",
      icon: <MapPin className="w-5 h-5" />,
      type: "social",
      books: [
        {
          id: "3",
          title: "Company of One",
          author: "Paul Jarvis", 
          cover: companyOneImg,
          rating: 4.7,
          reviews: 6234,
          readingTime: 5,
          knowledgeDensity: 6,
          category: "Entrepreneurship",
          isPopular: true,
          aiReason: "84% of your network colleagues rated this 5 stars"
        }
      ]
    },
    {
      id: "knowledge-gap",
      title: "Bridge Your Knowledge Gap",
      subtitle: "Skills you want to develop: Leadership, Decision Making",
      icon: <Target className="w-5 h-5" />,
      type: "knowledge",
      books: [
        {
          id: "4",
          title: "Atomic Habits",
          author: "James Clear",
          cover: atomicHabitsImg,
          rating: 4.9,
          reviews: 23456,
          readingTime: 7,
          knowledgeDensity: 6,
          category: "Self-Help",
          aiReason: "Essential for developing leadership consistency based on your goal profile"
        }
      ]
    }
  ];

  const filters = [
    { id: "all", label: "All Recommendations", icon: <Sparkles className="w-4 h-4" /> },
    { id: "personalized", label: "For You", icon: <Brain className="w-4 h-4" /> },
    { id: "trending", label: "Trending", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "knowledge", label: "Skill Building", icon: <Target className="w-4 h-4" /> }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh recommendations
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const filteredRecommendations = selectedFilter === "all" 
    ? recommendations 
    : recommendations.filter(section => section.type === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">AI-Powered Recommendations</h2>
          <p className="text-muted-foreground mt-1">Personalized just for you • Updated 2 minutes ago</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter.id)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {filter.icon}
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Recommendation Sections */}
      <div className="space-y-8">
        {filteredRecommendations.map((section) => (
          <div key={section.id} className="space-y-4">
            {/* Section Header */}
            <Card className="p-4 bg-gradient-card border-primary/20">
              <div className="flex items-start gap-3">
                <div className="text-primary mt-1">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {section.type}
                </Badge>
              </div>
            </Card>

            {/* Books Grid */}
            <div className="book-grid">
              {section.books.map((book) => (
                <BookCard
                  key={book.id}
                  {...book}
                  onClick={() => console.log(`Opening book: ${book.title}`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-6">
        <Button variant="outline" size="lg">
          <Calendar className="w-4 h-4 mr-2" />
          Show More Recommendations
        </Button>
      </div>
    </div>
  );
};