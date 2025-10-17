import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Book } from '@/types/book';
import { formatBookDescription } from '@/utils/htmlFormatter';

interface BookCardProps {
  book: Book;
  onWishlistToggle?: (bookId: string) => void;
  onClick?: (bookId: string) => void;
  inWishlist?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onWishlistToggle,
  onClick,
  inWishlist = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(book.id);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(book.id);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: 4,
            }
          : {},
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="280"
          image={book.coverImage || 'https://via.placeholder.com/200x280?text=No+Cover'}
          alt={book.title}
          onError={(e) => {
            console.log('Image failed to load:', book.coverImage);
            e.currentTarget.src = 'https://via.placeholder.com/200x280?text=No+Cover';
          }}
          sx={{ objectFit: 'cover' }}
        />
        {onWishlistToggle && (
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
              },
            }}
            onClick={handleWishlistToggle}
          >
            {inWishlist ? (
              <Favorite 
                sx={{ 
                  color: 'primary.main',
                  animation: 'heartBeat 0.6s ease-in-out',
                  '@keyframes heartBeat': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' },
                  }
                }} 
              />
            ) : (
              <FavoriteBorder 
                sx={{ 
                  transition: 'color 0.3s ease',
                  '&:hover': { color: 'primary.main' }
                }} 
              />
            )}
          </IconButton>
        )}
        {(book.availability || book.stock !== undefined) && (
          <Chip
            label={
              book.stock !== undefined 
                ? (book.stock > 0 ? `${book.stock} in stock` : 'Out of stock')
                : book.availability
            }
            size="small"
            color={
              book.stock !== undefined
                ? (book.stock > 0 ? 'success' : 'error')
                : book.availability === 'available'
                ? 'success'
                : book.availability === 'borrowed'
                ? 'error'
                : 'warning'
            }
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              textTransform: 'capitalize',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.6em',
          }}
        >
          {book.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {book.authors?.join(', ') || 'Unknown Author'}
        </Typography>

        {book.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              mb: 1,
            }}
          >
            {formatBookDescription(book.description)}
          </Typography>
        )}

        {book.categories && book.categories.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 1 }}>
            <Chip
              label={book.categories[0]}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard;

