import { motion } from 'framer-motion';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { Startup } from '../types';

interface StartupCardProps {
  startup: Startup;
  onUpvote: (id: string) => void;
  session: any;
  isOwner?: boolean;
}

export function StartupCard({ startup, onUpvote, session, isOwner }: StartupCardProps) {
  const upvoteCount = startup.upvotes?.[0]?.count || 0;
  const launchDate = new Date(startup.launch_date);
  const isLaunched = launchDate <= new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <img
          src={startup.logo_url}
          alt={`${startup.name} logo`}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {startup.name}
              </h3>
              <p className="text-gray-600 line-clamp-2">{startup.description}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>
                  By {startup.profiles?.username || 'Anonymous'}
                </span>
                <span>
                  {isLaunched
                    ? `Launched ${format(launchDate, 'PPP')}`
                    : `Launches ${format(launchDate, 'PPP')}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {!isOwner && (
                <button
                  onClick={() => onUpvote(startup.id)}
                  disabled={!session}
                  title={!session ? 'Login to upvote' : undefined}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    session
                      ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>{upvoteCount}</span>
                </button>
              )}
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}