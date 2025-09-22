import { Button } from '@/components/ui/button';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Book Management</h1>
            <p className="text-xs text-muted-foreground">Personal Collection</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <p className="font-medium">{user?.email}</p>
            <p className="text-muted-foreground text-xs">Signed in</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};