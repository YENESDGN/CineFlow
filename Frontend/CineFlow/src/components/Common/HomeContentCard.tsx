import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HomeContentCardProps {
  content: any;
}

const HomeContentCard: React.FC<HomeContentCardProps> = ({ content }) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [runtime, setRuntime] = useState(content.runtime);
  const [numberOfSeasons, setNumberOfSeasons] = useState(content.number_of_seasons);
  const contentType = content.title ? 'film' : 'dizi';
  
  useEffect(() => {
    // Eğer runtime veya number_of_seasons yoksa detaydan çek
    if (runtime === undefined && numberOfSeasons === undefined) {
      const type = content.title ? 'movie' : 'series';
      fetch(`http://127.0.0.1:5000/api/${type}/${content.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.runtime) setRuntime(data.runtime);
          if (data.number_of_seasons) setNumberOfSeasons(data.number_of_seasons);
        });
    }
  }, [content.id]);

  return (
    <Link 
      to={`/${contentType}/${content.id}`}
      className="block transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="bg-[#232936] border border-gray-700 rounded-lg p-4 flex flex-row items-center min-h-[170px] max-w-xl w-full shadow-sm">
        <img
          src={content.poster_path ? `https://image.tmdb.org/t/p/w500${content.poster_path}` : 'https://placehold.co/240x340?text=No+Image'}
          alt={content.title || content.name}
          className="w-32 h-44 object-cover rounded-lg mr-6 flex-shrink-0 shadow-md"
        />
        <div className="flex flex-col justify-between flex-1 min-w-0 h-full">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-white line-clamp-1">{content.title || content.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-200 mb-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-4 h-4 text-amber-400 mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>{content.vote_average?.toFixed(1) ?? '-'}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4 mr-1"><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                <span>{(content.release_date || content.first_air_date || '').split('-')[0]}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>
                  {runtime
                    ? `${runtime} dakika`
                    : numberOfSeasons
                      ? `${numberOfSeasons} Sezon`
                      : 'Süre bilgisi yok'}
                </span>
              </div>
            </div>
            {content.overview && (
              <p className="text-sm text-gray-200 line-clamp-2 mb-3">{content.overview}</p>
            )}
          </div>
          <button
            className={`px-4 py-1.5 rounded text-xs font-medium w-fit self-start mt-2 shadow transition-colors duration-150 flex items-center min-w-[120px] overflow-hidden ${inWatchlist ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#374151] hover:bg-[#475569] text-white'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setInWatchlist(!inWatchlist);
            }}
          >
            {inWatchlist ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-4 h-4 mr-2"><circle cx="8" cy="8" r="7"/><path d="m6 8 1.5 1.5L11 6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle w-4 h-4 mr-2"><circle cx="8" cy="8" r="7"/><line x1="8" y1="5" x2="8" y2="11"/><line x1="5" y1="8" x2="11" y2="8"/></svg>
            )}
            {inWatchlist ? 'Listemde' : 'Listeye Ekle'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HomeContentCard; 