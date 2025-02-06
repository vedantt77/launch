import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { StartupCard } from '../components/StartupCard';

export function Profile({ session }) {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchUserStartups();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('startups')
        .select(`
          *,
          profiles:user_id(*),
          upvotes:upvotes(count)
        `)
        .eq('user_id', session.user.id)
        .order('launch_date', { ascending: false });

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      console.error('Error fetching user startups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
        {profile && (
          <div>
            <p className="text-gray-600">Username: {profile.username}</p>
            <p className="text-gray-600">Email: {session.user.email}</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Startups</h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your startups...</p>
          </div>
        ) : startups.length > 0 ? (
          <div className="space-y-4">
            {startups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                onUpvote={() => {}}
                session={session}
                isOwner
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't submitted any startups yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}