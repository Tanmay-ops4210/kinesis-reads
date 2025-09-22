import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { BookList } from "@/components/books/BookList";
import { BookForm } from "@/components/books/BookForm";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { useBooks, Book } from "@/hooks/useBooks";
import { toast } from "@/components/ui/sonner";
import { 
  Bell, 
  User, 
  ChevronDown,
  BookOpen,
  Loader2
} from "lucide-react";

export const BookBasePro = () => {
  const [activeView, setActiveView] = useState("my-books");
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { books, loading, addBook, updateBook, deleteBook } = useBooks();

  const handleSaveBook = async (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
        toast.success("Book updated successfully!");
      } else {
        await addBook(bookData);
        toast.success("Book added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save book. Please try again.");
      throw error;
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setActiveView("add-book");
  };

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(bookId);
        toast.success("Book deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete book. Please try again.");
      }
    }
  };

  const handleCancelForm = () => {
    setEditingBook(null);
    setActiveView("my-books");
  };

  const handleViewChange = (view: string) => {
    if (view !== activeView) {
      setEditingBook(null);
    }
    setActiveView(view);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading your books...</span>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case "my-books":
        return (
          <BookList 
            books={books}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
          />
        );
      case "add-book":
        return (
          <BookForm
            book={editingBook}
            onSave={handleSaveBook}
            onCancel={handleCancelForm}
            isEditing={!!editingBook}
          />
        );
      default:
        return (
          <BookList 
            books={books}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar activeItem={activeView} onItemClick={handleViewChange} />
        
        <SidebarInset className="flex-1">
          {/* Top Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
            {/* Mobile Menu + Title */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">BookBase</h1>
                  <p className="text-xs text-muted-foreground">Personal Library</p>
                </div>
              </div>
            </div>

            {/* User Area */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hidden sm:flex">
                <Bell className="w-5 h-5" />
              </Button>

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* User Menu */}
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="hidden lg:block font-medium">Welcome back</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

            </main>

            {/* Right Panel - Hidden on mobile, shown on larger screens */}
            <aside className="hidden xl:block w-80 p-6 border-l border-border">
              <ContextualActionPanel selectedBook={selectedBook} />
            </aside>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};