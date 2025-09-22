# Real-time Book Management Dashboard

A modern, real-time book management application built with Vite, React, TypeScript, and Supabase.

## Features

- **Authentication**: Secure user registration and login with Supabase Auth
- **Real-time Updates**: Changes appear instantly across all connected clients
- **CRUD Operations**: Create, read, update, and delete books
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with shadcn/ui components

## Tech Stack

- **Frontend**: Vite, React 18, TypeScript
- **Backend**: Supabase (Database, Auth, Real-time)
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React hooks with Supabase real-time subscriptions

## Database Schema

The application uses a single `books` table with the following structure:

```sql
books (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  genre text NOT NULL,
  publication_year integer NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd book-management-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Run the SQL migration in `supabase/migrations/create_books_table.sql` in your Supabase SQL editor

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

### Deployment to Vercel

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com) and import your repository

2. **Configure environment variables in Vercel**
   - In your Vercel project settings, add the environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel will automatically build and deploy your application
   - The build command is `npm run build` and output directory is `dist`

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with your existing credentials
2. **Add Books**: Click "Add Book" to add new books to your collection
3. **Manage Books**: Edit or delete books using the action buttons on each book card
4. **Search**: Use the search bar to find books by title, author, or genre
5. **Real-time Updates**: Changes made by any user are instantly reflected across all connected clients

## Security

- **Row Level Security (RLS)**: Enabled on all tables to ensure users can only access their own data
- **Authentication**: Secure user authentication handled by Supabase Auth
- **Environment Variables**: Sensitive configuration stored securely in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.