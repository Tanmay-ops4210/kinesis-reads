import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  Clock, 
  Brain, 
  Play, 
  Heart, 
  BookOpen, 
  MoreHorizontal,
  TrendingUp
} from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  reviews: number;
  readingTime: number;
  knowledgeDensity: number;
  isReading?: boolean;
  readingProgress?: number;
  category: string;
  isPopular?: boolean;
  aiReason?: string;
  onClick?: () => void;
}

export const BookCard = ({ 
  id,
  title, 
  author, 
  cover, 
  rating, 
  reviews,
  readingTime,
  knowledgeDensity,
  isReading = false,
  readingProgress = 0,
  category,
  isPopular = false,
  aiReason,
  onClick 
}: BookCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getDensityColor = (density: number) => {
    if (density >= 8) return "text-destructive";
    if (density >= 6) return "text-warning";
    return "text-success";
  };

  const getDensityLabel = (density: number) => {
    if (density >= 8) return "Expert";
    if (density >= 6) return "Intermediate"; 
    return "Beginner";
  };

  return (
    <Card 
      className="recommendation-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Popular/Trending Badge */}
      {isPopular && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-secondary text-secondary-foreground gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </Badge>
        </div>
      )}

      {/* Book Cover */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img 
          src={cover} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Reading Progress Overlay */}
        {isReading && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <div className="text-white text-xs mb-1">{readingProgress}% complete</div>
            <Progress value={readingProgress} className="h-1" />
          </div>
        )}

        {/* Hover Actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                <Play className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-destructive' : ''}`} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="space-y-3">
        {/* Title & Author */}
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{author}</p>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
        </div>

        {/* Knowledge Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span>{readingTime}h read</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className={`w-3 h-3 ${getDensityColor(knowledgeDensity)}`} />
            <span className={getDensityColor(knowledgeDensity)}>
              {getDensityLabel(knowledgeDensity)}
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <Badge variant="outline" className="w-fit text-xs">
          {category}
        </Badge>

        {/* AI Recommendation Reason */}
        {aiReason && (
          <div className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Brain className="w-3 h-3 text-primary" />
              <span className="font-medium">AI Insight:</span>
            </div>
            <p>{aiReason}</p>
          </div>
        )}

        {/* Action Button */}
        {isReading ? (
          <Button className="w-full" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Continue Reading
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              Read Now
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};