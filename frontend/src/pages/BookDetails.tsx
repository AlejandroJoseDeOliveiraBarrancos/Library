import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  LibraryAdd,
  Star,
  CheckCircle,
} from '@mui/icons-material';
import Layout from '@/components/Layout/Layout';
import BookDetailsSkeleton from '@/components/Books/BookDetailsSkeleton';
import BookNavigation from '@/components/Books/BookNavigation';
import SwipeNavigation from '@/components/Books/SwipeNavigation';
import SnackbarNotification from '@/components/UI/SnackbarNotification';
import { BookDetails as BookDetailsType } from '@/types/book';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useBookNavigation } from '@/contexts/BookNavigationContext';
import { formatBookDescription } from '@/utils/htmlFormatter';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    previousBook, 
    nextBook, 
    hasPrevious, 
    hasNext, 
    setCurrentBookId
  } = useBookNavigation();
  
  const [book, setBook] = useState<BookDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [readingStatus, setReadingStatus] = useState<'reading' | 'completed' | 'not_started'>('not_started');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    title?: string;
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handlePreviousBook = useCallback(() => {
    if (previousBook) {
      navigate(`/books/${previousBook.id}`);
    }
  }, [previousBook, navigate]);

  const handleNextBook = useCallback(() => {
    if (nextBook) {
      navigate(`/books/${nextBook.id}`);
    }
  }, [nextBook, navigate]);

  useEffect(() => {
    if (id) {
      setCurrentBookId(id);
      fetchBookDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setCurrentBookId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && hasPrevious) {
        handlePreviousBook();
      } else if (event.key === 'ArrowRight' && hasNext) {
        handleNextBook();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevious, hasNext, handlePreviousBook, handleNextBook]);

  const fetchBookDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getBook(id!);
      setBook(response);
      
      if (user) {
        try {
          const isInWishlist = await apiService.checkIfInWishlist(id!);
          setInWishlist(isInWishlist);
        } catch (err) {
          console.error('Failed to check wishlist status:', err);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await apiService.borrowBook(id!);
      setNotification({
        open: true,
        message: 'Book borrowed successfully! You can find it in "My Books".',
        severity: 'success',
        title: 'Borrowed!',
      });
      fetchBookDetails();
      setTimeout(() => {
        navigate('/my-books');
      }, 2000);
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.response?.data?.detail || 'Failed to borrow book',
        severity: 'error',
        title: 'Borrow Failed',
      });
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (inWishlist) {
        await apiService.removeFromWishlist(id!);
        setInWishlist(false);
        setNotification({
          open: true,
          message: 'Book removed from wishlist',
          severity: 'info',
          title: 'Wishlist Updated',
        });
      } else {
        await apiService.addToWishlist(id!);
        setInWishlist(true);
        setNotification({
          open: true,
          message: 'Book added to wishlist',
          severity: 'success',
          title: 'Added to Wishlist!',
        });
      }
    } catch (err: any) {
      console.error('Failed to toggle wishlist:', err);
      setNotification({
        open: true,
        message: err.response?.data?.detail || 'Failed to update wishlist',
        severity: 'error',
        title: 'Wishlist Error',
      });
    }
  };

  const handleReadingStatusChange = async (status: 'reading' | 'completed') => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setReadingStatus(status);
    } catch (err) {
      console.error('Failed to update reading status:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <SwipeNavigation
          onSwipeLeft={handleNextBook}
          onSwipeRight={handlePreviousBook}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3 }}
          >
            Back
          </Button>
          <BookDetailsSkeleton />
        </SwipeNavigation>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <SwipeNavigation
          onSwipeLeft={handleNextBook}
          onSwipeRight={handlePreviousBook}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        >
          <Alert severity="error">{error || 'Book not found'}</Alert>
        </SwipeNavigation>
      </Layout>
    );
  }

  return (
    <Layout>
      <SwipeNavigation
        onSwipeLeft={handleNextBook}
        onSwipeRight={handlePreviousBook}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={book.coverImage || 'https://via.placeholder.com/400x600?text=No+Cover'}
              alt={book.title}
              onError={(e) => {
                console.log('Image failed to load:', book.coverImage);
                e.currentTarget.src = 'https://via.placeholder.com/400x600?text=No+Cover';
              }}
              sx={{
                width: '100%',
                maxWidth: 400,
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
              {book.title}
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              by {book.authors?.join(', ') || 'Unknown Author'}
            </Typography>

            {book.averageRating && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star sx={{ color: '#F39C12', mr: 0.5 }} />
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {book.averageRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({book.ratingsCount} ratings from Google Books)
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {typeof book.popularity !== 'undefined' && (
                <Chip 
                  label={`${book.popularity} loans`} 
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
              )}
              {typeof book.stock !== 'undefined' && (
                <Chip 
                  label={book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'} 
                  color={book.stock > 0 ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {book.categories?.map((category) => (
                <Chip key={category} label={category} variant="outlined" />
              ))}
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<LibraryAdd />}
                onClick={handleBorrow}
                disabled={book.availability === 'borrowed'}
              >
                {book.availability === 'borrowed' ? 'Not Available' : 'Borrow Book'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={inWishlist ? <Favorite /> : <FavoriteBorder />}
                onClick={handleWishlistToggle}
              >
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              {readingStatus === 'reading' && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CheckCircle />}
                  onClick={() => handleReadingStatusChange('completed')}
                >
                  Mark as Completed
                </Button>
              )}
              {readingStatus === 'completed' && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CheckCircle />}
                  disabled
                >
                  Completed
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              About this book
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                lineHeight: 1.8,
                whiteSpace: 'pre-line'
              }}
            >
              {formatBookDescription(book.description)}
            </Typography>

            <Grid container spacing={2}>
              {book.publisher && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Publisher
                  </Typography>
                  <Typography variant="body1">{book.publisher}</Typography>
                </Grid>
              )}
              {book.publishedDate && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Published Date
                  </Typography>
                  <Typography variant="body1">{book.publishedDate}</Typography>
                </Grid>
              )}
              {book.pageCount && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pages
                  </Typography>
                  <Typography variant="body1">{book.pageCount}</Typography>
                </Grid>
              )}
              {book.language && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Language
                  </Typography>
                  <Typography variant="body1">
                    {book.language.toUpperCase()}
                  </Typography>
                </Grid>
              )}
            </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Book Navigation */}
        <BookNavigation
          previousBook={previousBook}
          nextBook={nextBook}
          onPrevious={handlePreviousBook}
          onNext={handleNextBook}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
        />
      </SwipeNavigation>

      {/* Custom Notification */}
      <SnackbarNotification
        open={notification.open}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        message={notification.message}
        severity={notification.severity}
        title={notification.title}
      />
    </Layout>
  );
};

export default BookDetails;

