import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Save, 
  ArrowLeft, 
  BookOpen,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  description?: string;
  createdAt: string;
}

interface BookFormProps {
  book?: Book | null;
  onSave: (bookData: Omit<Book, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const BookForm = ({ book, onSave, onCancel, isEditing = false }: BookFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverUrl: '',
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
        coverUrl: book.coverUrl || '',
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
      await onSave({
        title: formData.title.trim(),
        author: formData.author.trim(),
        coverUrl: formData.coverUrl.trim() || undefined,
        description: formData.description.trim() || undefined
      });
      
      setSubmitStatus('success');
      
      // Reset form if adding new book
      if (!isEditing) {
        setFormData({
          title: '',
          author: '',
          coverUrl: '',
          description: ''
        });
      }
      
      // Auto-navigate back after success
      setTimeout(() => {
        onCancel();
      }, 1500);
      
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error saving book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
              {isEditing ? 'Update your book details' : 'Add a book to your personal collection'}
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
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
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

          {/* Author Field */}
          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-medium">
              Author <span className="text-destructive">*</span>
            </Label>
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

          {/* Cover URL Field */}
          <div className="space-y-2">
            <Label htmlFor="coverUrl" className="text-sm font-medium">
              Cover Image URL <span className="text-muted-foreground">(optional)</span>
            </Label>
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

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter book description or your notes about it"
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
      </Card>
    </div>
  );
};