import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
}

// Mock API functions
const mockLogin = (email: string, password: string): Promise<User> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'user@example.com' && password === 'password') {
        resolve({ id: '1', name: 'John Doe', email });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });

const mockFetchUsers = (): Promise<User[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
      ]);
    }, 1500);
  });

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  users: [],
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await mockLogin(email, password);
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  logout: () => set({ user: null }),
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await mockFetchUsers();
      set({ users, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
