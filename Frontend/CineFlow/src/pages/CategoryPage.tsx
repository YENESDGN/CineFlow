import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'movie', label: 'Filmler' },
  { key: 'tv', label: 'Diziler' },
];

function normalize(str: string) {
  return str
    .toLowerCase()
    .replace(/[\s-]/g, '') // boşluk ve tireleri kaldır
    .replace(/[ıiİI]/g, 'i') // Türkçe i/ı farkını düzelt
    .replace(/[üuÜU]/g, 'u')
    .replace(/[öoÖO]/g, 'o')
    .replace(/[çcÇC]/g, 'c')
    .replace(/[şsŞS]/g, 's')
    .replace(/[ğgĞG]/g, 'g')
    .replace(/dram$/, 'drama') // Ekstra: "Dram"ı "Drama"ya çevir
    .replace(/aksiyon/, 'action');
}

const CategoryPage: React.FC = () => {
  const { category = 'all' } = useParams<{ category?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv'>(
    queryTab === 'movie' ? 'movie' : queryTab === 'tv' ? 'tv' : 'all'
  );
  const [contentList, setContentList] = useState<any[]>([]);
  const [movieGenres, setMovieGenres] = useState<{ id: number; name: string }[]>([]);
  const [tvGenres, setTvGenres] = useState<{ id: number; name: string }[]>([]);
  const [genreId, setGenreId] = useState<number | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 20; // 5x4

  // Kategorileri çek
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const [movieRes, tvRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/movies/genres'),
          fetch('http://127.0.0.1:5000/api/series/genres')
        ]);
        const [movieData, tvData] = await Promise.all([
          movieRes.json(),
          tvRes.json()
        ]);

        setMovieGenres(movieData.genres || []);
        setTvGenres(tvData.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Genre ID'yi bul
  useEffect(() => {
    if (category === 'all') {
      setGenreId(null);
      return;
    }
    const findGenreId = () => {
      let found = null;
      if (activeTab === 'movie') {
        found = movieGenres.find(g => normalize(g.name) === normalize(category));
      } else if (activeTab === 'tv') {
        found = tvGenres.find(g => normalize(g.name) === normalize(category));
      } else {
        found = movieGenres.find(g => normalize(g.name) === normalize(category)) ||
                tvGenres.find(g => normalize(g.name) === normalize(category));
      }
      setGenreId(found ? found.id : null);
    };
    findGenreId();
  }, [movieGenres, tvGenres, category, activeTab]);

  // Sayfa değiştiğinde sıfırla
  useEffect(() => {
    setPage(1);
  }, [activeTab, category, genreId]);

  // İçerik çek
  useEffect(() => {
    const fetchContent = async () => {
      // Eğer kategori 'all' ise genre parametresi olmadan çek
      if (category === 'all') {
        setIsLoading(true);
        try {
          let results = [];
          if (activeTab === 'all') {
            const [movies, series] = await Promise.all([
              fetch(`http://127.0.0.1:5000/api/category/movie?page=${page}`).then(res => res.json()),
              fetch(`http://127.0.0.1:5000/api/category/tv?page=${page}`).then(res => res.json())
            ]);
            results = [...(movies.results || []), ...(series.results || [])]
              .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
              .slice(0, ITEMS_PER_PAGE);
          } else if (activeTab === 'movie') {
            const data = await fetch(`http://127.0.0.1:5000/api/category/movie?page=${page}`).then(res => res.json());
            results = data.results || [];
          } else if (activeTab === 'tv') {
            const data = await fetch(`http://127.0.0.1:5000/api/category/tv?page=${page}`).then(res => res.json());
            results = data.results || [];
          }
          setContentList(results);
        } catch (error) {
          setContentList([]);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      if (!genreId) {
        setContentList([]);
        return;
      }
      try {
        setIsLoading(true);
        let results = [];
        if (activeTab === 'all') {
          const [movies, series] = await Promise.all([
            fetch(`http://127.0.0.1:5000/api/category/movie?genre=${genreId}&page=${page}`).then(res => res.json()),
            fetch(`http://127.0.0.1:5000/api/category/tv?genre=${genreId}&page=${page}`).then(res => res.json())
          ]);
          results = [...(movies.results || []), ...(series.results || [])]
            .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
            .slice(0, ITEMS_PER_PAGE);
        } else if (activeTab === 'movie') {
          const data = await fetch(`http://127.0.0.1:5000/api/category/movie?genre=${genreId}&page=${page}`).then(res => res.json());
          results = data.results || [];
        } else if (activeTab === 'tv') {
          const data = await fetch(`http://127.0.0.1:5000/api/category/tv?genre=${genreId}&page=${page}`).then(res => res.json());
          results = data.results || [];
        }
        setContentList(results);
      } catch (error) {
        setContentList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [activeTab, category, genreId, page, tvGenres]);

  // location.search değişince activeTab'i güncelle
  useEffect(() => {
    const queryTab = new URLSearchParams(location.search).get('tab');
    setActiveTab(
      queryTab === 'movie' ? 'movie' :
      queryTab === 'tv' ? 'tv' : 'all'
    );
  }, [location.search]);

  // Tab değişiminde URL güncelle
  const handleTabChange = (tab: 'all' | 'movie' | 'tv') => {
    setActiveTab(tab);
    navigate(`/kategori/${category}${tab !== 'all' ? `?tab=${tab}` : ''}`);
  };

  return (
    <div className="bg-[#181e29] min-h-screen py-6 px-1">
      <h1 className="text-3xl font-bold text-white mb-6 ml-4 mt-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      <div className="flex space-x-4 mb-8 ml-4">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key as 'all' | 'movie' | 'tv')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-amber-500 text-white shadow'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 px-1">
            {contentList.slice(0, ITEMS_PER_PAGE).map(item => {
              const inWatchlist = watchlist.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-[#232936] rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col items-center group min-h-[440px] p-0"
                >
                  <Link
                    to={`/${item.title ? 'film' : 'dizi'}/${item.id}`}
                    className="w-full"
                  >
                    <div className="w-full aspect-[2/3] bg-[#181e29] rounded-t-xl overflow-hidden">
                      <img
                        src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://placehold.co/320x480?text=No+Image'}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 text-center line-clamp-2 w-full min-h-[56px] flex items-center justify-center">{item.title || item.name}</h3>
                  </Link>
                  <div className="flex items-center justify-center gap-3 text-base text-white mb-2 w-full">
                    <span className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-amber-400" />
                      {item.vote_average?.toFixed(1) ?? '-'}
                    </span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      {(item.release_date || item.first_air_date || '').split('-')[0]}
                    </span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-5 h-5 text-gray-400" />
                      {item.runtime ? `${item.runtime} dakika` : item.number_of_seasons ? `${item.number_of_seasons} Sezon` : 'Süre bilgisi yok'}
                    </span>
                  </div>
                  <button
                    className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg w-full font-semibold transition-colors shadow min-h-[44px] ${inWatchlist ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#374151] hover:bg-[#475569] text-white'}`}
                    onClick={() => {
                      setWatchlist(prev =>
                        inWatchlist ? prev.filter(id => id !== item.id) : [...prev, item.id]
                      );
                    }}
                  >
                    {inWatchlist ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-5 h-5"><circle cx="8" cy="8" r="7" /><path d="m6 8 1.5 1.5L11 6" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle w-5 h-5"><circle cx="8" cy="8" r="7" /><line x1="8" y1="5" x2="8" y2="11" /><line x1="5" y1="8" x2="11" y2="8" /></svg>
                    )}
                    {inWatchlist ? 'Listede' : 'Listeye Ekle'}
                  </button>
                </div>
              );
            })}
          </div>
          {contentList.length === 0 && !isLoading && (
            <div className="text-center text-gray-400 py-16 text-lg">Bu kategoride içerik bulunamadı.</div>
          )}
        </>
      )}
      {/* Sayfalama */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
        >
          Önceki
        </button>
        <span className="text-gray-300 font-medium">Sayfa {page}</span>
        <button
          onClick={() => setPage(prev => (contentList.length < ITEMS_PER_PAGE ? prev : prev + 1))}
          disabled={contentList.length < ITEMS_PER_PAGE}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
        >
          Sonraki
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
