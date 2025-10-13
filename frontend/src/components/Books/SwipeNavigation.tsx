import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';

interface SwipeNavigationProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const SwipeNavigation: React.FC<SwipeNavigationProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  hasNext,
  hasPrevious,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum distance for a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && hasNext) {
      onSwipeLeft();
    }
    if (isRightSwipe && hasPrevious) {
      onSwipeRight();
    }
  };

  return (
    <Box
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      sx={{
        touchAction: 'pan-y pinch-zoom',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {children}
    </Box>
  );
};

export default SwipeNavigation;
