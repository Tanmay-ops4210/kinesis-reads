import { useState, useEffect } from 'react';
import { Book, BorrowRecord, User, DashboardStats, SearchFilters, BookCategory } from '@/types/library';

// Mock data for development
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    author: 'John Smith',
    isbn: '978-0123456789',
    category: 'Computer Science',
    totalQuantity: 5,
    availableQuantity: 3,
    shelfLocation: 'CS-001',
    publicationYear: 2023,
    publisher: 'Tech Publications',
    loanDurationDays: 14,
    description: 'Comprehensive introduction to computer science fundamentals',
    coverUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Advanced Mathematics',
    author: 'Jane Doe',
    isbn: '978-0987654321',
    category: 'Mathematics',
    totalQuantity: 8,
    availableQuantity: 6,
    shelfLocation: 'MATH-045',
    publicationYear: 2022,
    publisher: 'Academic Press',
    loanDurationDays: 21,
    description: 'Advanced mathematical concepts and applications',
    coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Modern Literature Anthology',
    author: 'Various Authors',
    isbn: '978-0456789123',
    category: 'Literature',
    totalQuantity: 10,
    availableQuantity: 8,
    shelfLocation: 'LIT-102',
    publicationYear: 2023,
    publisher: 'Literary House',
    loanDurationDays: 14,
    description: 'Collection of modern literary works',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
];

const mockBorrowRecords: BorrowRecord[] = [
  {
    id: '1',
    bookId: '1',
    studentId: 'STU001',
    handlerId: 'HND001',
    issueDate: '2024-01-15T10:00:00Z',
    dueDate: '2024-01-29T10:00:00Z',
    status: 'active'
  }
];

export const useLibraryData = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize data from localStorage or use mock data
    const savedBooks = localStorage.getItem('library-books');
    const savedRecords = localStorage.getItem('library-borrow-records');
    const savedUsers = localStorage.getItem('library-users');

    setBooks(savedBooks ? JSON.parse(savedBooks) : mockBooks);
    setBorrowRecords(savedRecords ? JSON.parse(savedRecords) : mockBorrowRecords);
    setUsers(savedUsers ? JSON.parse(savedUsers) : []);

    // Save mock data if not exists
    if (!savedBooks) {
      localStorage.setItem('library-books', JSON.stringify(mockBooks));
    }
    if (!savedRecords) {
      localStorage.setItem('library-borrow-records', JSON.stringify(mockBorrowRecords));
    }

    setLoading(false);
  }, []);

  const saveBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    localStorage.setItem('library-books', JSON.stringify(newBooks));
  };

  const saveBorrowRecords = (newRecords: BorrowRecord[]) => {
    setBorrowRecords(newRecords);
    localStorage.setItem('library-borrow-records', JSON.stringify(newRecords));
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedBooks = [...books, newBook];
    saveBooks(updatedBooks);
  };

  const updateBook = async (bookId: string, bookData: Partial<Book>): Promise<void> => {
    const updatedBooks = books.map(book =>
      book.id === bookId
        ? { ...book, ...bookData, updatedAt: new Date().toISOString() }
        : book
    );
    saveBooks(updatedBooks);
  };

  const deleteBook = async (bookId: string): Promise<void> => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    saveBooks(updatedBooks);
  };

  const borrowBook = async (bookId: string, studentId: string, handlerId: string): Promise<void> => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableQuantity <= 0) {
      throw new Error('Book not available');
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + book.loanDurationDays);

    const newRecord: BorrowRecord = {
      id: Date.now().toString(),
      bookId,
      studentId,
      handlerId,
      issueDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'active'
    };

    const updatedRecords = [...borrowRecords, newRecord];
    saveBorrowRecords(updatedRecords);

    // Update book availability
    const updatedBooks = books.map(b =>
      b.id === bookId
        ? { ...b, availableQuantity: b.availableQuantity - 1 }
        : b
    );
    saveBooks(updatedBooks);
  };

  const returnBook = async (recordId: string, handlerId: string): Promise<void> => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) {
      throw new Error('Borrow record not found');
    }

    const updatedRecords = borrowRecords.map(r =>
      r.id === recordId
        ? { ...r, returnDate: new Date().toISOString(), status: 'returned' as const }
        : r
    );
    saveBorrowRecords(updatedRecords);

    // Update book availability
    const updatedBooks = books.map(b =>
      b.id === record.bookId
        ? { ...b, availableQuantity: b.availableQuantity + 1 }
        : b
    );
    saveBooks(updatedBooks);
  };

  const searchBooks = (filters: SearchFilters): Book[] => {
    return books.filter(book => {
      if (filters.query) {
        const query = filters.query.toLowerCase();
        if (!book.title.toLowerCase().includes(query) &&
            !book.author.toLowerCase().includes(query) &&
            !book.isbn.includes(query)) {
          return false;
        }
      }

      if (filters.category && book.category !== filters.category) {
        return false;
      }

      if (filters.author && !book.author.toLowerCase().includes(filters.author.toLowerCase())) {
        return false;
      }

      if (filters.isbn && !book.isbn.includes(filters.isbn)) {
        return false;
      }

      if (filters.availability === 'available' && book.availableQuantity <= 0) {
        return false;
      }

      if (filters.availability === 'borrowed' && book.availableQuantity >= book.totalQuantity) {
        return false;
      }

      return true;
    });
  };

  const getDashboardStats = (): DashboardStats => {
    const totalBooks = books.reduce((sum, book) => sum + book.totalQuantity, 0);
    const availableBooks = books.reduce((sum, book) => sum + book.availableQuantity, 0);
    const booksOnLoan = totalBooks - availableBooks;
    
    const now = new Date();
    const overdueRecords = borrowRecords.filter(record => 
      record.status === 'active' && new Date(record.dueDate) < now
    );

    const categoryStats: CategoryStats[] = [];
    const categories: BookCategory[] = ['Science', 'Arts', 'Engineering', 'Literature', 'Mathematics', 'History', 'Philosophy', 'Computer Science', 'Business', 'Other'];
    
    categories.forEach(category => {
      const categoryBooks = books.filter(book => book.category === category);
      const total = categoryBooks.reduce((sum, book) => sum + book.totalQuantity, 0);
      const available = categoryBooks.reduce((sum, book) => sum + book.availableQuantity, 0);
      
      if (total > 0) {
        categoryStats.push({
          category,
          total,
          available,
          onLoan: total - available
        });
      }
    });

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyTransactions = borrowRecords.filter(record => 
      new Date(record.issueDate) >= thisMonth
    ).length;

    return {
      totalBooks,
      availableBooks,
      booksOnLoan,
      overdueBooks: overdueRecords.length,
      totalStudents: users.filter(u => u.role === 'student').length,
      monthlyTransactions,
      categoryStats
    };
  };

  const getStudentBorrowHistory = (studentId: string): BorrowRecord[] => {
    return borrowRecords.filter(record => record.studentId === studentId);
  };

  const getOverdueBooks = (): (BorrowRecord & { book: Book; student: User })[] => {
    const now = new Date();
    return borrowRecords
      .filter(record => record.status === 'active' && new Date(record.dueDate) < now)
      .map(record => ({
        ...record,
        book: books.find(b => b.id === record.bookId)!,
        student: users.find(u => u.studentId === record.studentId)!
      }))
      .filter(item => item.book && item.student);
  };

  return {
    books,
    borrowRecords,
    users,
    loading,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    searchBooks,
    getDashboardStats,
    getStudentBorrowHistory,
    getOverdueBooks
  };
};