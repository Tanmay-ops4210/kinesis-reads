import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { useLibraryData } from '@/hooks/useLibraryData';
import { DashboardStats } from '@/types/library';

export const HandlerDashboard = () => {
  const { getDashboardStats, getOverdueBooks } = useLibraryData();
  const stats = getDashboardStats();
  const overdueBooks = getOverdueBooks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Library Dashboard</h1>
        <p className="text-muted-foreground">Overview of library operations and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableBooks} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books on Loan</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.booksOnLoan}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.booksOnLoan / stats.totalBooks) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdueBooks}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyTransactions}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Book Inventory by Category</CardTitle>
          <CardDescription>Current availability status across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.categoryStats.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {category.available}/{category.total}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(category.available / category.total) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{category.available} available</span>
                  <span>{category.onLoan} on loan</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overdue Books Alert */}
      {overdueBooks.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Overdue Books Alert
            </CardTitle>
            <CardDescription>
              The following books are overdue and require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueBooks.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                  <div>
                    <p className="font-medium">{item.book.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Student: {item.student.name} ({item.student.studentId})
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="mb-1">
                      <Clock className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {overdueBooks.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {overdueBooks.length - 5} more overdue books...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest library transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New book added to catalog</p>
                <p className="text-xs text-muted-foreground">Introduction to Computer Science - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Book returned</p>
                <p className="text-xs text-muted-foreground">Advanced Mathematics by Jane Doe - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Book issued</p>
                <p className="text-xs text-muted-foreground">Modern Literature Anthology - 6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};