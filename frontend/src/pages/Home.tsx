import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Alert,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import SearchBar from '@/components/Books/SearchBar';
import BookCard from '@/components/Books/BookCard';
import BookCardSkeleton from '@/components/Books/BookCardSkeleton';
import { Book } from '@/types/book';
import apiService from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState({
    query: '',
    category: '',
    sortBy: 'newest',
  });

  const itemsPerPage = 20;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.searchBooks({
        ...searchParams,
        maxResults: itemsPerPage,
        startIndex: (page - 1) * itemsPerPage,
      });
      setBooks(response.items || []);
      setTotalPages(Math.ceil((response.totalItems || 0) / itemsPerPage));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [page, searchParams, itemsPerPage]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (params: { query: string; category: string; sortBy: string }) => {
    setSearchParams(params);
    setPage(1);
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const handleWishlistToggle = async (bookId: string) => {    
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      // Try to add to wishlist first, if it fails, try to remove
      await apiService.addToWishlist(bookId);
      console.log('Book added to wishlist:', bookId);
    } catch (err: any) {
      console.error('Failed to add to wishlist, trying to remove:', err);
      try {
        await apiService.removeFromWishlist(bookId);
        console.log('Book removed from wishlist:', bookId);
      } catch (removeErr) {
        console.error('Failed to remove from wishlist:', removeErr);
      }
    }
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
          {searchParams.query || searchParams.category ? 'Search Results' : 'Newest Books'}
        </Typography>

        <SearchBar onSearch={handleSearch} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {books.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No books found. Try a different search.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {loading ? (
                Array.from({ length: 12 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <BookCardSkeleton />
                  </Grid>
                ))
              ) : (
                books.map((book: Book) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                    <BookCard
                      book={book}
                      onClick={handleBookClick}
                      onWishlistToggle={handleWishlistToggle}
                    />
                  </Grid>
                ))
              )}
            </Grid>

            {totalPages > 1 && !loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.min(totalPages, 10)}
                  page={page}
                  onChange={(_: React.ChangeEvent<unknown>, value: number) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Home;

