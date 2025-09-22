import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Heart, 
  Download, 
  Share2, 
  BookOpen, 
  Highlighter, 
  MessageSquare, 
  Star,
  ExternalLink,
  Brain,
  Clock,
  Users,
  Bookmark
} from "lucide-react";

import companyOneImg from "@/assets/books/company-of-one.jpg";

interface ContextualActionPanelProps {
  selectedBook?: {
    id: string;
    title: string;
    author: string;
    cover: string;
    rating: number;
    pages: number;
    description: string;
    isReading?: boolean;
    readingProgress?: number;
  } | null;
}

export const ContextualActionPanel = ({ selectedBook }: ContextualActionPanelProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorited, setIsFavorited] = useState(false);

  // Default selected book for demo
  const defaultBook = {
    id: "company-of-one",
    title: "Company of One",
    author: "Paul Jarvis",
    cover: companyOneImg,
    rating: 4.7,
    pages: 288,
    description: "A refreshing, counter-intuitive approach to business that shows how to grow a successful company by staying small and avoiding the common pitfalls of scaling up.",
    isReading: true,
    readingProgress: 67
  };

  const book = selectedBook || defaultBook;

  const userNotes = [
    {
      id: "1",
      chapter: "Chapter 4",
      text: "The myth of growth at all costs is deeply ingrained in business culture",
      highlight: "Sometimes better is staying the same size but becoming more efficient and profitable",
      page: 89
    },
    {
      id: "2", 
      chapter: "Chapter 2",
      text: "Questioning the assumption that bigger is always better",
      highlight: "Growth is not a strategy, it's a tactic that can be used strategically",
      page: 45
    }
  ];

  const relatedResources = [
    {
      title: "Small Business Sustainability Research",
      type: "Academic Paper",
      source: "Harvard Business Review",
      relevance: 95
    },
    {
      title: "Remote Work Productivity Studies", 
      type: "Industry Report",
      source: "McKinsey & Company",
      relevance: 88
    },
    {
      title: "Bootstrapping vs VC Funding Analysis",
      type: "News Article", 
      source: "TechCrunch",
      relevance: 82
    }
  ];

  if (!book) {
    return (
      <Card className="w-80 h-fit p-6 glass-card">
        <div className="text-center text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a book to see details</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-80 glass-card overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">My Notes</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-0 m-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-6">
              {/* Book Cover & Title */}
              <div className="text-center">
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="w-32 h-48 object-cover rounded-lg mx-auto mb-4 shadow-medium"
                />
                <h2 className="text-xl font-bold text-foreground">{book.title}</h2>
                <p className="text-muted-foreground mt-1">{book.author}</p>
              </div>

              {/* Reading Progress */}
              {book.isReading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reading Progress</span>
                    <span className="text-sm text-muted-foreground">{book.readingProgress}%</span>
                  </div>
                  <Progress value={book.readingProgress} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>~2.5 hours remaining</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Listen Sample
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={isFavorited ? "text-destructive" : ""}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                  Favorite
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Book Stats */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="font-semibold">{book.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">{book.pages}</div>
                  <p className="text-xs text-muted-foreground">Pages</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About this book</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Continue Reading Button */}
              {book.isReading && (
                <Button className="w-full" size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Reading
                </Button>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notes" className="p-0 m-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-6">
              {/* AI Summary */}
              <Card className="p-4 bg-gradient-card border-primary/20">
                <div className="flex items-start gap-3 mb-3">
                  <Brain className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">AI Summary of Your Notes</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your main takeaways focus on sustainable business growth and challenging traditional scaling assumptions.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Generate Flashcards
                </Button>
              </Card>

              {/* Notes List */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Highlighter className="w-4 h-4" />
                  My Highlights & Notes
                </h3>
                
                {userNotes.map((note) => (
                  <Card key={note.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {note.chapter}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Page {note.page}</span>
                    </div>
                    <blockquote className="text-sm bg-accent/30 p-3 rounded border-l-2 border-primary">
                      "{note.highlight}"
                    </blockquote>
                    <p className="text-sm text-muted-foreground">
                      <MessageSquare className="w-3 h-3 inline mr-1" />
                      {note.text}
                    </p>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Bookmark className="w-4 h-4 mr-2" />
                Add New Note
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="research" className="p-0 m-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Related External Resources
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-curated resources related to this book's topics
                </p>
              </div>

              <div className="space-y-3">
                {relatedResources.map((resource, index) => (
                  <Card key={index} className="p-4 hover:shadow-medium transition-shadow cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">{resource.title}</h4>
                        <Badge variant="outline" className="text-xs ml-2">
                          {resource.relevance}% match
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{resource.type}</span>
                        <span>•</span>
                        <span>{resource.source}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Find More Resources
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};