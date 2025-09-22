export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'handler';
  studentId?: string;
  handlerId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  totalQuantity: number;
  availableQuantity: number;
  shelfLocation: string;
  publicationYear: number;
  publisher: string;
  loanDurationDays: number;
  description?: string;
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  studentId: string;
  handlerId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  lateFee?: number;
  notes?: string;
}

export interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  booksOnLoan: number;
  overdueBooks: number;
  totalStudents: number;
  monthlyTransactions: number;
  categoryStats: CategoryStats[];
}

export interface CategoryStats {
  category: BookCategory;
  total: number;
  available: number;
  onLoan: number;
}

export type BookCategory = 
  | 'Science'
  | 'Arts'
  | 'Engineering'
  | 'Literature'
  | 'Mathematics'
  | 'History'
  | 'Philosophy'
  | 'Computer Science'
  | 'Business'
  | 'Other';

export interface SearchFilters {
  query?: string;
  category?: BookCategory;
  author?: string;
  availability?: 'all' | 'available' | 'borrowed';
  isbn?: string;
}

export interface ReportData {
  type: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalTransactions: number;
  booksIssued: number;
  booksReturned: number;
  overdueItems: number;
  popularBooks: Array<{
    bookId: string;
    title: string;
    borrowCount: number;
  }>;
}