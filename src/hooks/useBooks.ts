import { useState, useEffect } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  description?: string;
  createdAt: string;
}

// Mock data for development - replace with actual API calls
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    description: 'Timeless lessons on wealth, greed, and happiness from one of the most important financial writers of our time.',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    description: 'An easy & proven way to build good habits & break bad ones.',
    createdAt: '2024-01-10T15:30:00Z'
  },
  {
    id: '3',
    title: 'Company of One',
    author: 'Paul Jarvis',
    description: 'A refreshing, counter-intuitive approach to business that shows how to grow a successful company by staying small.',
    createdAt: '2024-01-05T09:15:00Z'
  }
];

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load books from localStorage on mount
  useEffect(() => {
    try {
      const savedBooks = localStorage.getItem('bookbase-books');
      if (savedBooks) {
        setBooks(JSON.parse(savedBooks));
      } else {
        // Initialize with mock data if no saved books
        setBooks(mockBooks);
        localStorage.setItem('bookbase-books', JSON.stringify(mockBooks));
      }
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load books');
      setBooks(mockBooks); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  }, []);

  // Save books to localStorage whenever books change
  const saveBooks = (newBooks: Book[]) => {
    try {
      localStorage.setItem('bookbase-books', JSON.stringify(newBooks));
      setBooks(newBooks);
    } catch (err) {
      console.error('Error saving books:', err);
      throw new Error('Failed to save book');
    }
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'createdAt'>): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newBook: Book = {
            ...bookData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          
          const updatedBooks = [newBook, ...books];
          saveBooks(updatedBooks);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 500); // Simulate API delay
    });
  };

  const updateBook = async (bookId: string, bookData: Omit<Book, 'id' | 'createdAt'>): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updatedBooks = books.map(book => 
            book.id === bookId 
              ? { ...book, ...bookData }
              : book
          );
          saveBooks(updatedBooks);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 500); // Simulate API delay
    });
  };

  const deleteBook = async (bookId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updatedBooks = books.filter(book => book.id !== bookId);
          saveBooks(updatedBooks);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 300); // Simulate API delay
    });
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook
  };
};