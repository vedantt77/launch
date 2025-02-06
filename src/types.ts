export interface Startup {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website: string;
  launch_date: string;
  user_id: string;
  created_at: string;
  profiles?: {
    username: string;
  };
  upvotes?: Array<{ count: number }>;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}