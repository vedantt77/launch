import { Startup, Profile } from '../types';

export const mockStartups: Startup[] = [
  {
    id: '1',
    name: 'EcoTrack',
    description: 'AI-powered sustainability tracking for businesses',
    logo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=128&h=128&fit=crop',
    website: 'https://ecotrack.example.com',
    launch_date: new Date().toISOString(),
    user_id: '1',
    created_at: new Date().toISOString(),
    profiles: { username: 'ecodev' },
    upvotes: [{ count: 150 }]
  },
  {
    id: '2',
    name: 'HealthHub',
    description: 'Telemedicine platform with AI diagnostics',
    logo_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=128&h=128&fit=crop',
    website: 'https://healthhub.example.com',
    launch_date: new Date().toISOString(),
    user_id: '2',
    created_at: new Date().toISOString(),
    profiles: { username: 'healthtech' },
    upvotes: [{ count: 120 }]
  },
  {
    id: '3',
    name: 'SmartLearn',
    description: 'Personalized learning paths using machine learning',
    logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&h=128&fit=crop',
    website: 'https://smartlearn.example.com',
    launch_date: new Date().toISOString(),
    user_id: '3',
    created_at: new Date().toISOString(),
    profiles: { username: 'edutech' },
    upvotes: [{ count: 90 }]
  }
];

export const mockProfile: Profile = {
  id: '1',
  username: 'testuser',
  created_at: new Date().toISOString()
};