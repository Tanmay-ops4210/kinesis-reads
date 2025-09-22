import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Save, 
  ArrowLeft, 
  BookOpen,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Book, BookCategory } from "@/types/library";
import { useLibraryData } from "@/hooks/useLibraryData";

interface BookFormProps {
  book?: Book | null;
  onSave: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const BookForm = ({ book, onSave, onCancel, isEditing = false }: BookFormProps) => {
  const { addBook, updateBook } = useLibraryData();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '' as BookCategory | '',
    totalQuantity: 1,
    availableQuantity: 1,
    shelfLocation: '',
    publicationYear: new Date().getFullYear(),
    publisher: '',
    loanDurationDays: 14,
    description: '',
    coverUrl: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || '',
        totalQuantity: book.totalQuantity || 1,
        availableQuantity: book.availableQuantity || 1,
        shelfLocation: book.shelfLocation || '',
        publicationYear: book.publicationYear || new Date().getFullYear(),
        publisher: book.publisher || '',
        loanDurationDays: book.loanDurationDays || 14,
        description: book.description || '',
        coverUrl: book.coverUrl || ''
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.shelfLocation.trim()) {
      newErrors.shelfLocation = 'Shelf location is required';
    }

    if (!formData.publisher.trim()) {
      newErrors.publisher = 'Publisher is required';
    }

    if (formData.totalQuantity < 1) {
      newErrors.totalQuantity = 'Total quantity must be at least 1';
    }

    if (formData.availableQuantity < 0 || formData.availableQuantity > formData.totalQuantity) {
      newErrors.availableQuantity = 'Available quantity must be between 0 and total quantity';
    }

    if (formData.publicationYear < 1000 || formData.publicationYear > new Date().getFullYear() + 1) {
      newErrors.publicationYear = 'Please enter a valid publication year';
    }

    if (formData.loanDurationDays < 1 || formData.loanDurationDays > 365) {
      newErrors.loanDurationDays = 'Loan duration must be between 1 and 365 days';
    }

    if (formData.coverUrl && !isValidUrl(formData.coverUrl)) {
      newErrors.coverUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim(),
        category: formData.category as BookCategory,
        totalQuantity: formData.totalQuantity,
        availableQuantity: formData.availableQuantity,
        shelfLocation: formData.shelfLocation.trim(),
        publicationYear: formData.publicationYear,
        publisher: formData.publisher.trim(),
        loanDurationDays: formData.loanDurationDays,
        description: formData.description.trim() || undefined,
        coverUrl: formData.coverUrl.trim() || undefined
      };

      if (isEditing && book) {
        await updateBook(book.id, bookData);
      } else {
        await addBook(bookData);
      }
      
      setSubmitStatus('success');
      
      // Auto-navigate back after success
      setTimeout(() => {
        onSave();
      }, 1500);
      
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error saving book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categories: BookCategory[] = [
    'Science', 'Arts', 'Engineering', 'Literature', 'Mathematics', 
    'History', 'Philosophy', 'Computer Science', 'Business', 'Other'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Book' : 'Add New Book'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update book information' : 'Add a new book to the library collection'}
            </p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">
            Book {isEditing ? 'updated' : 'added'} successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to {isEditing ? 'update' : 'add'} book. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter book title"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Author */}
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Enter author name"
                  className={errors.author ? 'border-destructive' : ''}
                />
                {errors.author && (
                  <p className="text-sm text-destructive">{errors.author}</p>
                )}
              </div>

              {/* ISBN */}
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN *</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  placeholder="Enter ISBN"
                  className={errors.isbn ? 'border-destructive' : ''}
                />
                {errors.isbn && (
                  <p className="text-sm text-destructive">{errors.isbn}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              {/* Publisher */}
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher *</Label>
                <Input
                  id="publisher"
                  value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  placeholder="Enter publisher name"
                  className={errors.publisher ? 'border-destructive' : ''}
                />
                {errors.publisher && (
                  <p className="text-sm text-destructive">{errors.publisher}</p>
                )}
              </div>

              {/* Publication Year */}
              <div className="space-y-2">
                <Label htmlFor="publicationYear">Publication Year *</Label>
                <Input
                  id="publicationYear"
                  type="number"
                  value={formData.publicationYear}
                  onChange={(e) => handleInputChange('publicationYear', parseInt(e.target.value) || 0)}
                  placeholder="Enter publication year"
                  className={errors.publicationYear ? 'border-destructive' : ''}
                />
                {errors.publicationYear && (
                  <p className="text-sm text-destructive">{errors.publicationYear}</p>
                )}
              </div>

              {/* Shelf Location */}
              <div className="space-y-2">
                <Label htmlFor="shelfLocation">Shelf Location *</Label>
                <Input
                  id="shelfLocation"
                  value={formData.shelfLocation}
                  onChange={(e) => handleInputChange('shelfLocation', e.target.value)}
                  placeholder="e.g., CS-001, MATH-045"
                  className={errors.shelfLocation ? 'border-destructive' : ''}
                />
                {errors.shelfLocation && (
                  <p className="text-sm text-destructive">{errors.shelfLocation}</p>
                )}
              </div>

              {/* Loan Duration */}
              <div className="space-y-2">
                <Label htmlFor="loanDurationDays">Loan Duration (Days) *</Label>
                <Input
                  id="loanDurationDays"
                  type="number"
                  value={formData.loanDurationDays}
                  onChange={(e) => handleInputChange('loanDurationDays', parseInt(e.target.value) || 0)}
                  placeholder="Enter loan duration in days"
                  className={errors.loanDurationDays ? 'border-destructive' : ''}
                />
                {errors.loanDurationDays && (
                  <p className="text-sm text-destructive">{errors.loanDurationDays}</p>
                )}
              </div>

              {/* Total Quantity */}
              <div className="space-y-2">
                <Label htmlFor="totalQuantity">Total Quantity *</Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  value={formData.totalQuantity}
                  onChange={(e) => handleInputChange('totalQuantity', parseInt(e.target.value) || 0)}
                  placeholder="Enter total quantity"
                  className={errors.totalQuantity ? 'border-destructive' : ''}
                />
                {errors.totalQuantity && (
                  <p className="text-sm text-destructive">{errors.totalQuantity}</p>
                )}
              </div>

              {/* Available Quantity */}
              <div className="space-y-2">
                <Label htmlFor="availableQuantity">Available Quantity *</Label>
                <Input
                  id="availableQuantity"
                  type="number"
                  value={formData.availableQuantity}
                  onChange={(e) => handleInputChange('availableQuantity', parseInt(e.target.value) || 0)}
                  placeholder="Enter available quantity"
                  className={errors.availableQuantity ? 'border-destructive' : ''}
                />
                {errors.availableQuantity && (
                  <p className="text-sm text-destructive">{errors.availableQuantity}</p>
                )}
              </div>
            </div>

            {/* Cover URL */}
            <div className="space-y-2">
              <Label htmlFor="coverUrl">Cover Image URL (optional)</Label>
              <Input
                id="coverUrl"
                type="url"
                value={formData.coverUrl}
                onChange={(e) => handleInputChange('coverUrl', e.target.value)}
                placeholder="https://example.com/book-cover.jpg"
                className={errors.coverUrl ? 'border-destructive' : ''}
              />
              {errors.coverUrl && (
                <p className="text-sm text-destructive">{errors.coverUrl}</p>
              )}
              {formData.coverUrl && !errors.coverUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="w-24 h-32 rounded border bg-muted">
                    <img 
                      src={formData.coverUrl} 
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center hidden">
                      <span className="text-xs text-muted-foreground">Invalid URL</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter book description"
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Update Book' : 'Add Book'}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};