import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Books API
  async searchBooks(params: {
    query?: string;
    author?: string;
    category?: string;
    sortBy?: string;
    maxResults?: number;
    startIndex?: number;
  }) {
    const response = await this.api.get('/api/books/search', { params });
    return response.data;
  }

  async getBook(bookId: string) {
    const response = await this.api.get(`/api/books/${bookId}`);
    return response.data;
  }

  // Loans API
  async getMyLoans() {
    const response = await this.api.get('/api/loans');
    return response.data;
  }

  async borrowBook(bookId: string) {
    const response = await this.api.post('/api/loans', { book_id: bookId });
    return response.data;
  }

  async returnBook(loanId: string) {
    const response = await this.api.put(`/api/loans/${loanId}/return`);
    return response.data;
  }

  // Wishlist API
  async getWishlist() {
    const response = await this.api.get('/api/wishlist');
    return response.data;
  }

  async checkIfInWishlist(bookId: string) {
    const response = await this.api.get(`/api/wishlist/check/${bookId}`);
    return response.data.in_wishlist;
  }

  async addToWishlist(bookId: string, notifyWhenAvailable = true) {
    const response = await this.api.post('/api/wishlist', {
      book_id: bookId,
      notify_when_available: notifyWhenAvailable,
    });
    return response.data;
  }

  async removeFromWishlist(bookId: string) {
    const response = await this.api.delete(`/api/wishlist/${bookId}`);
    return response.data;
  }

  // Reading Status API
  async updateReadingStatus(bookId: string, status: string) {
    const response = await this.api.put(`/api/books/${bookId}/status`, { status });
    return response.data;
  }

  // Admin API
  async getAllActiveLoans() {
    const response = await this.api.get('/api/admin/loans');
    return response.data;
  }

  async adminReturnBook(loanId: string) {
    const response = await this.api.put(`/api/admin/loans/${loanId}/return`);
    return response.data;
  }
}

export default new ApiService();

