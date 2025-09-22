import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  Filter,
  Eye
} from 'lucide-react';
import { useLibraryData } from '@/hooks/useLibraryData';
import { Book, SearchFilters } from '@/types/library';
import { BookForm } from './BookForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

export const BookManagement = () => {
  const { books, searchBooks, deleteBook } = useLibraryData();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState<Book | null>(null);

  const searchResults = searchBooks(searchFilters);

  const handleSearch = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query }));
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setShowForm(true);
  };

  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook(bookId);
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedBook(null);
  };

  if (showForm) {
    return (
      <BookForm
        book={selectedBook}
        onSave={async () => {
          handleFormClose();
          toast({
            title: "Success",
            description: selectedBook ? "Book updated successfully" : "Book added successfully",
          });
        }}
        onCancel={handleFormClose}
        isEditing={!!selectedBook}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Book Management</h1>
          <p className="text-muted-foreground">Manage your library's book collection</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Book
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Books</CardTitle>
          <CardDescription>Find and manage books in your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, ISBN, or category..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {searchResults.map((book) => (
          <Card key={book.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Book Cover */}
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {book.coverUrl ? (
                    <img 
                      src={book.coverUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>

                {/* Book Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant={book.availableQuantity > 0 ? "default" : "secondary"}>
                      {book.availableQuantity > 0 ? 'Available' : 'All Borrowed'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {book.availableQuantity}/{book.totalQuantity}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>ISBN: {book.isbn}</p>
                    <p>Category: {book.category}</p>
                    <p>Location: {book.shelfLocation}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(book)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(book)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Book</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{book.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(book.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {searchResults.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground mb-6">No books match your search criteria</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Book
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Book Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Book Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDetails(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {showDetails.coverUrl ? (
                    <img 
                      src={showDetails.coverUrl} 
                      alt={showDetails.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{showDetails.title}</h2>
                    <p className="text-lg text-muted-foreground">{showDetails.author}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ISBN:</span>
                      <p>{showDetails.isbn}</p>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{showDetails.category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Publisher:</span>
                      <p>{showDetails.publisher}</p>
                    </div>
                    <div>
                      <span className="font-medium">Year:</span>
                      <p>{showDetails.publicationYear}</p>
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>
                      <p>{showDetails.shelfLocation}</p>
                    </div>
                    <div>
                      <span className="font-medium">Loan Duration:</span>
                      <p>{showDetails.loanDurationDays} days</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Availability:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={showDetails.availableQuantity > 0 ? "default" : "secondary"}>
                        {showDetails.availableQuantity > 0 ? 'Available' : 'All Borrowed'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {showDetails.availableQuantity} of {showDetails.totalQuantity} available
                      </span>
                    </div>
                  </div>
                  
                  {showDetails.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-sm text-muted-foreground mt-1">{showDetails.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};