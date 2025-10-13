import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box,
} from '@mui/material';

const BookCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Skeleton
          variant="rectangular"
          height={280}
          sx={{ width: '100%' }}
        />
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Skeleton
          variant="text"
          height={60}
          sx={{ mb: 1 }}
        />
        
        <Skeleton
          variant="text"
          height={20}
          width="80%"
          sx={{ mb: 1 }}
        />

        <Skeleton
          variant="text"
          height={60}
          sx={{ mb: 1 }}
        />

        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Skeleton
            variant="rounded"
            height={24}
            width={100}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default BookCardSkeleton;
