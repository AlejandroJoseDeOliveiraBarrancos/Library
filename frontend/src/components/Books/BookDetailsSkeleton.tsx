import React from 'react';
import {
  Box,
  Skeleton,
  Grid,
  Paper,
} from '@mui/material';

const BookDetailsSkeleton: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left side - Book cover */}
        <Grid item xs={12} md={4}>
          <Skeleton
            variant="rectangular"
            height={600}
            sx={{ width: '100%', borderRadius: 2 }}
          />
        </Grid>

        {/* Right side - Book details */}
        <Grid item xs={12} md={8}>
          {/* Title */}
          <Skeleton
            variant="text"
            height={60}
            sx={{ mb: 2, width: '90%' }}
          />

          {/* Authors */}
          <Skeleton
            variant="text"
            height={30}
            sx={{ mb: 2, width: '70%' }}
          />

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={20} height={20} sx={{ mr: 0.5 }} />
            <Skeleton variant="text" height={20} width={40} sx={{ mr: 1 }} />
            <Skeleton variant="text" height={20} width={80} />
          </Box>

          {/* Categories */}
          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Skeleton variant="rounded" height={32} width={100} />
            <Skeleton variant="rounded" height={32} width={120} />
            <Skeleton variant="rounded" height={32} width={90} />
          </Box>

          {/* Action buttons */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Skeleton variant="rounded" height={48} width={160} />
            <Skeleton variant="rounded" height={48} width={160} />
          </Box>

          {/* Divider */}
          <Skeleton variant="rectangular" height={1} sx={{ my: 3 }} />

          {/* About this book section */}
          <Skeleton
            variant="text"
            height={30}
            sx={{ mb: 2, width: '40%' }}
          />
          
          {/* Description paragraphs */}
          <Skeleton variant="text" height={20} sx={{ mb: 1, width: '100%' }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1, width: '95%' }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1, width: '100%' }} />
          <Skeleton variant="text" height={20} sx={{ mb: 1, width: '85%' }} />
          <Skeleton variant="text" height={20} sx={{ mb: 3, width: '90%' }} />

          {/* Publication metadata */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Skeleton variant="text" height={16} width={80} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" height={20} width={120} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="text" height={16} width={100} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" height={20} width={80} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="text" height={16} width={50} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" height={20} width={60} />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="text" height={16} width={70} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" height={20} width={40} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookDetailsSkeleton;
