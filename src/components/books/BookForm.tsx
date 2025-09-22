import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Save, 
  X,
  BookOpen,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Book } from "@/lib/supabase";
import { useBooks } from "@/hooks/useBooks";

interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
}

export const BookForm = ({ book, onClose }: BookFormProps) => {
  const { addBook, updateBook } = useBooks();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publication_year: new Date().getFullYear(),
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        publication_year: book.publication_year || new Date().getFullYear(),
        description: book.description || ''
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

    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required';
    }

    if (formData.publication_year < 1000 || formData.publication_year > new Date().getFullYear() + 1) {
      newErrors.publication_year = 'Please enter a valid publication year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      let result;

      if (book) {
        result = await updateBook(book.id, formData);
      } else {
        result = await addBook(formData);
      }
      
      if (result.error) {
        setError(result.error);
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
      
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {book ? 'Edit Book' : 'Add New Book'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {book ? 'Update book information' : 'Add a new book to your collection'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <Alert className="border-success bg-success/10 mb-4">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Book {book ? 'updated' : 'added'} successfully! Closing...
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to {book ? 'update' : 'add'} book. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
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

              {/* Genre */}
              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  placeholder="Enter genre (e.g., Fiction, Science, History)"
                  className={errors.genre ? 'border-destructive' : ''}
                />
                {errors.genre && (
                  <p className="text-sm text-destructive">{errors.genre}</p>
                )}
              </div>

              {/* Publication Year */}
              <div className="space-y-2">
                <Label htmlFor="publication_year">Publication Year *</Label>
                <Input
                  id="publication_year"
                  type="number"
                  value={formData.publication_year}
                  onChange={(e) => handleInputChange('publication_year', parseInt(e.target.value) || 0)}
                  placeholder="Enter publication year"
                  className={errors.publication_year ? 'border-destructive' : ''}
                />
                {errors.publication_year && (
                  <p className="text-sm text-destructive">{errors.publication_year}</p>
                )}
              </div>
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
                    {book ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {book ? 'Update Book' : 'Add Book'}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
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