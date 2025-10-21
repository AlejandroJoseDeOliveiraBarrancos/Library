import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Checkbox,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Delete,
  SelectAll,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import BookCard from '@/components/Books/BookCard';
import SwipeNavigation from '@/components/Books/SwipeNavigation';
import { WishListItem, Book } from '@/types/book';
import apiService from '@/services/api';

const WishList: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<Array<{ item: WishListItem; book: Book }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const wishlistData = await apiService.getWishlist();
      
      const itemsWithBooks = await Promise.all(
        wishlistData.map(async (item: WishListItem) => {
          try {
            const book = await apiService.getBook(item.bookId);
            return { item, book };
          } catch (err) {
            console.error(`Failed to fetch book details for ${item.bookId}:`, err);
            return null;
          }
        })
      );
      
      const validItems = itemsWithBooks.filter((item): item is { item: WishListItem; book: Book } => item !== null);
      setWishlistItems(validItems);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wishlist';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistItemId: string) => {
    try {
      await apiService.removeFromWishlist(wishlistItemId);
      fetchWishlist();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from wishlist';
      alert(errorMessage);
    }
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === wishlistItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(wishlistItems.map(item => item.item.id)));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const itemId of selectedItems) {
        await apiService.removeFromWishlist(itemId);
      }
      setSelectedItems(new Set());
      setSelectionMode(false);
      fetchWishlist();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove selected items';
      alert(errorMessage);
    }
  };

  const handleSwipeLeft = () => {
    if (currentIndex < wishlistItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const hasNext = currentIndex < wishlistItems.length - 1;
  const hasPrevious = currentIndex > 0;

  if (loading) {
    return (
      <Layout>
        <SwipeNavigation
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </SwipeNavigation>
      </Layout>
    );
  }

  return (
    <Layout>
      <SwipeNavigation
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            My Wish List
          </Typography>
          
          {wishlistItems.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={selectionMode ? "contained" : "outlined"}
                onClick={() => setSelectionMode(!selectionMode)}
                startIcon={selectionMode ? <CheckBoxOutlineBlank /> : <SelectAll />}
              >
                {selectionMode ? 'Cancel' : 'Select'}
              </Button>
              
              {selectionMode && (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleSelectAll}
                    disabled={wishlistItems.length === 0}
                  >
                    {selectedItems.size === wishlistItems.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.size === 0}
                    startIcon={<Delete />}
                  >
                    Delete ({selectedItems.size})
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {wishlistItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Your wishlist is empty.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Discover Books
            </Button>
          </Box>
        ) : (
          <>
            {wishlistItems.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={handleSwipeRight}
                    disabled={!hasPrevious}
                    sx={{
                      backgroundColor: hasPrevious ? 'primary.main' : 'grey.300',
                      color: hasPrevious ? 'white' : 'grey.500',
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {currentIndex + 1} of {wishlistItems.length}
                  </Typography>
                  <IconButton
                    onClick={handleSwipeLeft}
                    disabled={!hasNext}
                    sx={{
                      backgroundColor: hasNext ? 'primary.main' : 'grey.300',
                      color: hasNext ? 'white' : 'grey.500',
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </Box>
              </Box>
            )}

            <Grid container spacing={3}>
              {wishlistItems.map((itemWithBook) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={itemWithBook.item.id}>
                  <Box sx={{ position: 'relative' }}>
                    {selectionMode && (
                      <Checkbox
                        checked={selectedItems.has(itemWithBook.item.id)}
                        onChange={() => handleSelectItem(itemWithBook.item.id)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          zIndex: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 1,
                        }}
                      />
                    )}
                    <BookCard
                      book={itemWithBook.book}
                      onClick={handleBookClick}
                      onWishlistToggle={() => handleRemove(itemWithBook.item.id)}
                      inWishlist={true}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </SwipeNavigation>
    </Layout>
  );
};

export default WishList;

