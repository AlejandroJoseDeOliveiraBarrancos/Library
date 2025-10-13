export interface Book {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  coverImage?: string;
  categories?: string[];
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  publisher?: string;
  isbn?: string;
  averageRating?: number;
  ratingsCount?: number;
  availability?: 'available' | 'borrowed' | 'reserved';
  readingStatus?: 'reading' | 'completed' | 'not_started';
  progressPercentage?: number;
  popularity?: number;
  stock?: number;
}

export interface BookDetails extends Book {
  previewLink?: string;
  infoLink?: string;
}

export interface SearchParams {
  query?: string;
  author?: string;
  category?: string;
  sortBy?: 'relevance' | 'newest' | 'title';
  maxResults?: number;
  startIndex?: number;
}

export interface Loan {
  id: string;
  bookId: string;
  book?: Book;
  userId: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface WishListItem {
  id: string;
  bookId: string;
  book?: Book;
  userId: string;
  addedDate: string;
  notifyWhenAvailable: boolean;
}

export enum ReadingStatus {
  READING = 'reading',
  COMPLETED = 'completed',
  WISH_LIST = 'wishlist',
}

