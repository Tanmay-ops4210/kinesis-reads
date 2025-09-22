import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  BookOpen,
  User,
  ExternalLink
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  description?: string;
  createdAt: string;
}

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

export const BookList = ({ books, onEdit, onDelete }: BookListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No books in your collection</h3>
        <p className="text-muted-foreground mb-6">Start building your personal library by adding your first book.</p>
        <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-add'))}>
          Add Your First Book
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Books</h2>
          <p className="text-muted-foreground">{books.length} book{books.length !== 1 ? 's' : ''} in your collection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Books Display */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
        : "space-y-4"
      }>
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden hover:shadow-medium transition-shadow">
            {viewMode === 'grid' ? (
              <div className="p-4">
                {/* Book Cover */}
                <div className="aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-muted">
                  {book.coverUrl ? (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${book.coverUrl ? 'hidden' : ''}`}>
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                  </div>
                </div>

                {/* Book Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground line-clamp-2">{book.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span className="line-clamp-1">{book.author}</span>
                  </div>
                  {book.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(book)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(book.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex gap-4">
                {/* Book Cover - List View */}
                <div className="w-16 h-20 rounded bg-muted flex-shrink-0">
                  {book.coverUrl ? (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center rounded ${book.coverUrl ? 'hidden' : ''}`}>
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>

                {/* Book Info - List View */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{book.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <User className="w-3 h-3" />
                    <span>{book.author}</span>
                  </div>
                  {book.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{book.description}</p>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Added {new Date(book.createdAt).toLocaleDateString()}
                  </Badge>
                </div>

                {/* Actions - List View */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(book)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(book.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};