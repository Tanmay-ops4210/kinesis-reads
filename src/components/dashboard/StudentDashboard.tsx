import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock,
  Filter,
  Eye
} from 'lucide-react';
import { useLibraryData } from '@/hooks/useLibraryData';
import { useAuth } from '@/contexts/AuthContext';
import { SearchFilters, BookCategory } from '@/types/library';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { searchBooks, getStudentBorrowHistory, borrowRecords, books } = useLibraryData();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const studentHistory = user?.studentId ? getStudentBorrowHistory(user.studentId) : [];
  const activeLoans = studentHistory.filter(record => record.status === 'active');
  const searchResults = searchBooks(searchFilters);

  const handleSearch = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query }));
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({ 
      ...prev, 
      [key]: value === 'all' ? undefined : value 
    }));
  };

  const getBookDetails = (bookId: string) => {
    return books.find(book => book.id === bookId);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">Discover and manage your library books</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans.length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total History</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentHistory.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Books</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{searchResults.filter(book => book.availableQuantity > 0).length}</div>
            <p className="text-xs text-muted-foreground">Ready to borrow</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Loans */}
      {activeLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Current Books</CardTitle>
            <CardDescription>Books you currently have borrowed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeLoans.map((loan) => {
                const book = getBookDetails(loan.bookId);
                const overdue = isOverdue(loan.dueDate);
                
                return (
                  <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{book?.title}</h4>
                        <p className="text-sm text-muted-foreground">{book?.author}</p>
                        <p className="text-xs text-muted-foreground">
                          Issued: {new Date(loan.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={overdue ? "destructive" : "outline"} className="mb-2">
                        {overdue ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Overdue
                          </>
                        ) : (
                          <>
                            <Calendar className="w-3 h-3 mr-1" />
                            Due Soon
                          </>
                        )}
                      </Badge>
                      <p className="text-sm">
                        Due: {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Book Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Browse Books</CardTitle>
              <CardDescription>Search and discover books in our collection</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Philosophy">Philosophy</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <Select onValueChange={(value) => handleFilterChange('availability', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All books" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Books</SelectItem>
                      <SelectItem value="available">Available Only</SelectItem>
                      <SelectItem value="borrowed">Currently Borrowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Input
                    placeholder="Filter by author..."
                    onChange={(e) => handleFilterChange('author', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((book) => (
                <Card key={book.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-16 h-20 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        {book.coverUrl ? (
                          <img 
                            src={book.coverUrl} 
                            alt={book.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <BookOpen className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{book.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={book.availableQuantity > 0 ? "default" : "secondary"} className="text-xs">
                            {book.availableQuantity > 0 ? 'Available' : 'Borrowed'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {book.availableQuantity}/{book.totalQuantity}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {book.category} • {book.shelfLocation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No books found matching your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};