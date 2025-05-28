import React, { useState } from 'react';
import { Star, Filter, SlidersHorizontal } from 'lucide-react';
import { currentUser } from '../data/mockData';
import { movies, series } from '../data/mockData';
import ContentCard from '../components/Common/ContentCard';

const RatingsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [contentType, setContentType] = useState<'all' | 'movie' | 'series'>('all');

  // Get all rated content
  const allContent = [...movies, ...series];
  const ratedContent = allContent
    .filter(item => currentUser.ratings.some(rating => rating.contentId === item.id))
    .map(item => {
      const rating = currentUser.ratings.find(r => r.contentId === item.id);
      return { ...item, userRating: rating?.score };
    });

  // Filter by content type
  let filteredContent = ratedContent;
  if (contentType !== 'all') {
    filteredContent = ratedContent.filter(item =>
      contentType === 'movie' ? 'duration' in item : 'seasons' in item
    );
  }

  // Sort content
  filteredContent.sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.userRating || 0) - (a.userRating || 0);
    } else {
      return b.year - a.year;
    }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
          <Star className="w-8 h-8 mr-2 text-gray-400" />
          Puanladıklarım
        </h1>
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <div className="flex space-x-2">
                <button
                  onClick={() => setContentType('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    contentType === 'all'
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => setContentType('movie')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    contentType === 'movie'
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Filmler
                </button>
                <button
                  onClick={() => setContentType('series')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    contentType === 'series'
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Diziler
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="date">Tarih</option>
                <option value="rating">Puan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredContent.map((content) => (
          <div key={content.id} className="relative">
            <div className="absolute top-2 right-2 z-10 bg-gray-900/90 px-3 py-1 rounded-full flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-white font-medium">{content.userRating}</span>
            </div>
            <ContentCard
              content={content}
              type={'duration' in content ? 'movie' : 'series'}
            />
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Henüz hiçbir içeriği puanlamadınız.
          </p>
        </div>
      )}
    </div>
  );
};

export default RatingsPage;