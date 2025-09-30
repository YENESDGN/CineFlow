import React from 'react';
import { Link } from 'react-router-dom';
import { Content } from '../../types';
import { Star, Plus, Check } from 'lucide-react';
import { formatRating, toggleWatchlist } from '../../utils/helpers';

interface CategorySectionProps {
  title: string;
  contents: Content[];
  type: 'movie' | 'series';
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, contents, type }) => {
  const handleWatchlistToggle = (e: React.MouseEvent, id: number, currentStatus: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(id, currentStatus);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] hover:z-10">
      <h2 className="text-lg font-bold mb-4 px-3 py-2 bg-gradient-to-r from-amber-700 to-amber-500 text-white rounded-md shadow-sm">
        {title}
      </h2>
      <div className="space-y-2">
        {contents.map((content) => (
          <Link 
            key={content.id} 
            to={`/${type === 'movie' ? 'film' : 'dizi'}/${content.id}`}
            className="flex items-center p-2 rounded-md transition-all duration-300 hover:bg-gray-700 group"
          >
            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
              <img 
                src={content.posterUrl} 
                alt={content.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 flex-grow overflow-hidden">
              <h3 className="text-white text-sm font-medium truncate">{content.title}</h3>
              <div className="flex items-center text-xs text-gray-400">
                <Star className="w-3 h-3 text-amber-400 mr-1" />
                {formatRating(content.rating)}
                <span className="mx-1">•</span>
                {content.year}
              </div>
            </div>
            <button
              onClick={(e) => handleWatchlistToggle(e, content.id, content.isInWatchlist)}
              className="p-1.5 rounded-full ml-2 bg-gray-700 text-gray-300 hover:bg-amber-500 hover:text-white transition-colors duration-300"
            >
              {content.isInWatchlist ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;