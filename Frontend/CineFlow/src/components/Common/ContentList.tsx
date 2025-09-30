import React, { useState, ReactNode } from 'react';
import { useContent } from '../../hooks/useContent';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HomeContentCard from './HomeContentCard';

interface ContentListProps {
  title: ReactNode;
  type: 'weekly' | 'new' | 'top';
  contentType: 'movie' | 'tv';
  className?: string;
}

const ContentList: React.FC<ContentListProps> = ({ title, type, contentType, className = '' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: contents, loading, error, totalPages } = useContent(type, contentType, currentPage);

  if (loading) {
    return (
      <div className={`${className} space-y-4`}>
        <div className="h-8 bg-gray-700 rounded w-1/3 animate-pulse"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4 bg-gray-800 p-4 rounded-lg animate-pulse">
            <div className="w-32 h-48 bg-gray-700 rounded"></div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-gray-800 p-6 rounded-lg text-center`}>
        <p className="text-red-400">Üzgünüz, içerik yüklenirken bir hata oluştu.</p>
        <p className="text-gray-400 mt-2">Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <div className={`${className} bg-gray-800 p-6 rounded-lg text-center`}>
        <p className="text-gray-400">Bu kategoride henüz içerik bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-6`}>
      <h2 className="text-xl font-bold px-4 py-2 text-white bg-[#181e29] rounded-md shadow-md">
        {title}
      </h2>
      
      <div className="space-y-4">
        {contents.map((content) => (
          <div key={content.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300">
            <HomeContentCard content={content} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-gray-400">
            Sayfa {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentList;