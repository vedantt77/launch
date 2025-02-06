import { mockStartups, mockProfile } from './mockData';

let mockSession = null;
let mockUserStartups = [];

// Mock Supabase client for development
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: mockSession } }),
    onAuthStateChange: (callback) => {
      // Immediately trigger with current session
      callback('SIGNED_IN', mockSession);
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: ({ email, password }) => {
      // Mock successful login
      mockSession = {
        user: {
          id: '1',
          email,
        }
      };
      return Promise.resolve({ data: { session: mockSession }, error: null });
    },
    signUp: ({ email, password }) => {
      // Mock successful signup
      mockSession = {
        user: {
          id: '1',
          email,
        }
      };
      return Promise.resolve({ 
        data: { 
          user: mockSession.user
        }, 
        error: null 
      });
    },
    signOut: () => {
      mockSession = null;
      return Promise.resolve({ error: null });
    }
  },
  from: (table: string) => ({
    select: (query = '*') => ({
      eq: (field: string, value: any) => ({
        single: () => {
          if (table === 'profiles') {
            return Promise.resolve({ data: mockProfile, error: null });
          }
          return Promise.resolve({ data: null, error: null });
        },
        order: () => {
          if (table === 'startups') {
            return Promise.resolve({ 
              data: mockUserStartups.filter(s => s.user_id === value), 
              error: null 
            });
          }
          return Promise.resolve({ data: [], error: null });
        }
      }),
      order: () => ({
        ascending: () => Promise.resolve({ data: mockStartups, error: null })
      }),
      gte: () => Promise.resolve({ data: mockStartups, error: null })
    }),
    insert: (data: any) => {
      if (table === 'startups') {
        const newStartup = {
          ...data,
          id: String(mockStartups.length + 1),
          created_at: new Date().toISOString(),
          profiles: { username: mockProfile.username },
          upvotes: [{ count: 0 }]
        };
        mockUserStartups.push(newStartup);
        mockStartups.push(newStartup);
        return Promise.resolve({ error: null });
      }
      return Promise.resolve({ error: null });
    })
  })
};