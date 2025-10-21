import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '@/types/book';

interface BookNavigationContextType {
  currentBookId: string | null;
  previousBook: Book | null;
  nextBook: Book | null;
  hasPrevious: boolean;
  hasNext: boolean;
  setCurrentBookId: (bookId: string) => void;
  navigateToPrevious: () => void;
  navigateToNext: () => void;
  loading: boolean;
}

const BookNavigationContext = createContext<BookNavigationContextType | undefined>(undefined);

interface BookNavigationProviderProps {
  children: ReactNode;
}

export const BookNavigationProvider: React.FC<BookNavigationProviderProps> = ({ children }) => {
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [previousBook, setPreviousBook] = useState<Book | null>(null);
  const [nextBook, setNextBook] = useState<Book | null>(null);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRelatedBooks = async (bookId: string) => {
    setLoading(true);
    try {
      const mockBooks: Book[] = [
        {
          id: '1',
          title: 'The Great Gatsby',
          authors: ['F. Scott Fitzgerald'],
          description: 'A story of the fabulously wealthy Jay Gatsby.',
          coverImage: 'https://books.google.com/books/content?id=example1',
          categories: ['Fiction', 'Classics'],
        },
        {
          id: '2',
          title: 'To Kill a Mockingbird',
          authors: ['Harper Lee'],
          description: 'The story of young Scout Finch.',
          coverImage: 'https://books.google.com/books/content?id=example2',
          categories: ['Fiction', 'Classics'],
        },
        {
          id: '3',
          title: '1984',
          authors: ['George Orwell'],
          description: 'A dystopian social science fiction novel.',
          coverImage: 'https://books.google.com/books/content?id=example3',
          categories: ['Fiction', 'Dystopian'],
        },
      ];

      const currentIndex = mockBooks.findIndex(book => book.id === bookId);
      
      if (currentIndex === -1) {
        setPreviousBook(null);
        setNextBook(null);
        setHasPrevious(false);
        setHasNext(false);
        return;
      }

      setPreviousBook(currentIndex > 0 ? mockBooks[currentIndex - 1] : null);
      setNextBook(currentIndex < mockBooks.length - 1 ? mockBooks[currentIndex + 1] : null);
      setHasPrevious(currentIndex > 0);
      setHasNext(currentIndex < mockBooks.length - 1);

    } catch (error) {
      console.error('Failed to fetch related books:', error);
      setPreviousBook(null);
      setNextBook(null);
      setHasPrevious(false);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentBookId) {
      fetchRelatedBooks(currentBookId);
    }
  }, [currentBookId]);

  const navigateToPrevious = () => {
    if (previousBook) {
      setCurrentBookId(previousBook.id);
    }
  };

  const navigateToNext = () => {
    if (nextBook) {
      setCurrentBookId(nextBook.id);
    }
  };

  const value: BookNavigationContextType = {
    currentBookId,
    previousBook,
    nextBook,
    hasPrevious,
    hasNext,
    setCurrentBookId,
    navigateToPrevious,
    navigateToNext,
    loading,
  };

  return (
    <BookNavigationContext.Provider value={value}>
      {children}
    </BookNavigationContext.Provider>
  );
};

export const useBookNavigation = (): BookNavigationContextType => {
  const context = useContext(BookNavigationContext);
  if (!context) {
    throw new Error('useBookNavigation must be used within a BookNavigationProvider');
  }
  return context;
};
