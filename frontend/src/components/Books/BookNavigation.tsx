import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { Book } from '@/types/book';

interface BookNavigationProps {
  previousBook?: Book | null;
  nextBook?: Book | null;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const BookNavigation: React.FC<BookNavigationProps> = ({
  previousBook,
  nextBook,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onPrevious}
            disabled={!hasPrevious}
            sx={{
              backgroundColor: hasPrevious ? 'primary.main' : 'grey.300',
              color: hasPrevious ? 'white' : 'grey.500',
              '&:hover': {
                backgroundColor: hasPrevious ? 'primary.dark' : 'grey.300',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Previous
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Next
          </Typography>
          <IconButton
            onClick={onNext}
            disabled={!hasNext}
            sx={{
              backgroundColor: hasNext ? 'primary.main' : 'grey.300',
              color: hasNext ? 'white' : 'grey.500',
              '&:hover': {
                backgroundColor: hasNext ? 'primary.dark' : 'grey.300',
              },
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {previousBook && (
          <Paper
            elevation={1}
            sx={{
              minWidth: 200,
              p: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={onPrevious}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <ArrowBack />
              </Avatar>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Previous Book
              </Typography>
            </Box>
            <Box
              component="img"
              src={previousBook.coverImage || 'https://via.placeholder.com/60x80?text=No+Cover'}
              alt={previousBook.title}
              sx={{
                width: 60,
                height: 80,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 1,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 0.5,
              }}
            >
              {previousBook.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {previousBook.authors?.join(', ') || 'Unknown Author'}
            </Typography>
          </Paper>
        )}

        {nextBook && (
          <Paper
            elevation={1}
            sx={{
              minWidth: 200,
              p: 2,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
              },
            }}
            onClick={onNext}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Next Book
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <ArrowForward />
              </Avatar>
            </Box>
            <Box
              component="img"
              src={nextBook.coverImage || 'https://via.placeholder.com/60x80?text=No+Cover'}
              alt={nextBook.title}
              sx={{
                width: 60,
                height: 80,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 1,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 0.5,
              }}
            >
              {nextBook.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {nextBook.authors?.join(', ') || 'Unknown Author'}
            </Typography>
          </Paper>
        )}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Tip: Use arrow keys or swipe to navigate between books
        </Typography>
      </Box>
    </Box>
  );
};

export default BookNavigation;
