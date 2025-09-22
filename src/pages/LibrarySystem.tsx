import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Sidebar } from '@/components/layout/Sidebar';
import { HandlerDashboard } from '@/components/dashboard/HandlerDashboard';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { BookManagement } from '@/components/books/BookManagement';
import { BookForm } from '@/components/books/BookForm';

export const LibrarySystem = () => {
  const { user, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeItem, setActiveItem] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm onToggleMode={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onToggleMode={() => setAuthMode('login')} />
    );
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return user.role === 'handler' ? <HandlerDashboard /> : <StudentDashboard />;
      case 'books':
        return <BookManagement />;
      case 'add-book':
        return (
          <BookForm
            onSave={() => setActiveItem('books')}
            onCancel={() => setActiveItem('books')}
          />
        );
      case 'browse-books':
        return <StudentDashboard />;
      case 'my-books':
        return <div>My Books Component</div>;
      case 'borrowed-books':
        return <div>Borrowed Books Component</div>;
      case 'students':
        return <div>Students Management Component</div>;
      case 'reports':
        return <div>Reports Component</div>;
      case 'profile':
        return <div>Profile Component</div>;
      default:
        return user.role === 'handler' ? <HandlerDashboard /> : <StudentDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};