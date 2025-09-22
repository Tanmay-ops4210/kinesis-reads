import { useState, useEffect } from 'react';
import { supabase, Book } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch books
  const fetchBooks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add book
  const addBook = async (bookData: Omit<Book, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            ...bookData,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  // Update book
  const updateBook = async (id: string, bookData: Partial<Book>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('books')
        .update({
          ...bookData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  // Delete book
  const deleteBook = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchBooks();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('books_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'books',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBooks(prev => [payload.new as Book, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBooks(prev => prev.map(book => 
              book.id === payload.new.id ? payload.new as Book : book
            ));
          } else if (payload.eventType === 'DELETE') {
            setBooks(prev => prev.filter(book => book.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refetch: fetchBooks,
  };
};