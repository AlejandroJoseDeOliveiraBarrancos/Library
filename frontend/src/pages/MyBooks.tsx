import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Alert,
  Chip,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  MenuBook,
  CheckCircle,
  PlayArrow,
} from '@mui/icons-material';
import Layout from '@/components/Layout/Layout';
import BookCard from '@/components/Books/BookCard';
import BookCardSkeleton from '@/components/Books/BookCardSkeleton';
import SwipeNavigation from '@/components/Books/SwipeNavigation';
import { Book } from '@/types/book';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';


const MyBooks: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchMyBooks = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const loans = await apiService.getMyLoans();
      
      const booksWithStatus: Book[] = await Promise.all(
        loans.map(async (loan: any) => {
          try {
            const bookDetails = await apiService.getBook(loan.book_id);
            return {
              ...bookDetails,
              readingStatus: 'reading' as const,
              availability: 'borrowed' as const,
            };
          } catch (err) {
            console.error(`Failed to fetch book details for ${loan.book_id}:`, err);
            return null;
          }
        })
      );
      
      const validBooks = booksWithStatus.filter((book): book is Book => book !== null);
      setBooks(validBooks);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch your books');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyBooks();
  }, [fetchMyBooks]);

  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setCurrentIndex(0);
  };

  const handleSwipeLeft = () => {
    const filteredBooks = getFilteredBooks();
    if (currentIndex < filteredBooks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getFilteredBooks = () => {
    switch (activeTab) {
      case 0: 
        return books.filter(book => book.readingStatus === 'reading');
      case 1:
        return books.filter(book => book.readingStatus === 'completed');
      default:
        return books;
    }
  };

  const getReadingStatusChip = (book: Book) => {
    switch (book.readingStatus) {
      case 'reading':
        return (
          <Chip
            icon={<PlayArrow />}
            label={`${book.progressPercentage || 0}%`}
            color="primary"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        );
      case 'completed':
        return (
          <Chip
            icon={<CheckCircle />}
            label="Completed"
            color="success"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8 }}
          />
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Layout>
        <Alert severity="info">
          Please log in to view your books.
        </Alert>
      </Layout>
    );
  }

  const filteredBooks = getFilteredBooks();
  const hasNext = currentIndex < filteredBooks.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <Layout>
      <SwipeNavigation
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      >
        <Box>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            My Books
          </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              label="Currently Reading (Loaned)" 
              icon={<MenuBook />}
              iconPosition="start"
            />
            <Tab 
              label="Completed" 
              icon={<CheckCircle />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <BookCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : filteredBooks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {activeTab === 0 && 'No books currently being read (loaned)'}
              {activeTab === 1 && 'No completed books'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              startIcon={<MenuBook />}
            >
              Discover Books
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
            </Typography>
            
            <Grid container spacing={3}>
              {filteredBooks.map((book) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                  <Box sx={{ position: 'relative' }}>
                    <BookCard
                      book={book}
                      onClick={handleBookClick}
                    />
                    {getReadingStatusChip(book)}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        </Box>
      </SwipeNavigation>
    </Layout>
  );
};

export default MyBooks;
