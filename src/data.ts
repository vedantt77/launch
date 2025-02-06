import { Startup } from './types';

export const startups: Startup[] = [
  {
    id: 1,
    name: "EcoTrack",
    description: "AI-powered sustainability tracking for businesses",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=128&h=128&fit=crop",
    website: "https://ecotrack.example.com",
    upvotes: 150,
    createdAt: new Date('2024-03-10')
  },
  {
    id: 2,
    name: "HealthHub",
    description: "Telemedicine platform with AI diagnostics",
    logo: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=128&h=128&fit=crop",
    website: "https://healthhub.example.com",
    upvotes: 120,
    createdAt: new Date('2024-03-12')
  },
  {
    id: 3,
    name: "SmartLearn",
    description: "Personalized learning paths using machine learning",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&h=128&fit=crop",
    website: "https://smartlearn.example.com",
    upvotes: 90,
    createdAt: new Date('2024-03-15')
  },
  {
    id: 4,
    name: "DevFlow",
    description: "Streamlined development workflow automation",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&h=128&fit=crop",
    website: "https://devflow.example.com",
    upvotes: 80,
    createdAt: new Date('2024-03-16')
  }
];