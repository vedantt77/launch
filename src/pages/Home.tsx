import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { StartupCard } from '../components/StartupCard';
import { CountdownTimer } from '../components/CountdownTimer';
import { differenceInDays } from 'date-fns';

type TimeFilter = 'daily' | 'weekly' | 'monthly';

export function Home({ session }) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, [timeFilter]);

  const fetchStartups = async () => {
    try {
      const now = new Date();
      let query = supabase
        .from('startups')
        .select(`
          *,
          profiles:user_id(*),
          upvotes:upvotes(count)
        `)
        .order('launch_date', { ascending: true });

      // Apply time filter
      const filterDate = new Date();
      switch (timeFilter) {
        case 'daily':
          filterDate.setDate(filterDate.getDate() - 1);
          break;
        case 'weekly':
          filterDate.setDate(filterDate.getDate() - 7);
          break;
        case 'monthly':
          filterDate.setDate(filterDate.getDate() - 30);
          break;
      }

      query = query.gte('launch_date', filterDate.toISOString());

      const { data, error } = await query;
      if (error) throw error;

      setStartups(data || []);
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (startupId: string) => {
    if (!session) return;

    try {
      const { error } = await supabase.from('upvotes').insert({
        startup_id: startupId,
        user_id: session.user.id,
      });

      if (error) {
        if (error.code === '23505') {
          // Unique violation - user already upvoted
          return;
        }
        throw error;
      }

      fetchStartups(); // Refresh the list
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const filteredStartups = startups.filter(startup => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      startup.name.toLowerCase().includes(query) ||
      startup.description.toLowerCase().includes(query)
    );
  });

  const renderTabHeading = () => {
    switch (timeFilter) {
      case 'daily':
        return (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Daily Launch - New startups in
            </h2>
            <CountdownTimer />
          </div>
        );
      case 'weekly':
        return (
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Best startup of the week
          </h2>
        );
      case 'monthly':
        return (
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Best startup of the month
          </h2>
        );
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        Startups.ad - Advertise your startup for free
      </h1>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search startups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white shadow-sm"
        />
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          {(['daily', 'weekly', 'monthly'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-6 py-2 rounded-lg text-sm font-medium capitalize ${
                timeFilter === filter
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {renderTabHeading()}

      <AnimatePresence mode="wait">
        <motion.div
          key={timeFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading startups...</p>
            </div>
          ) : filteredStartups.length > 0 ? (
            filteredStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                onUpvote={() => handleUpvote(startup.id)}
                session={session}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No startups found for the selected filter.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}