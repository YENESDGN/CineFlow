import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Clock, Calendar, Plus, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToWatchlist, removeFromWatchlist } from '../services/api';
import ReviewSection from '../components/ReviewSection';

const PosterOnlyCard: React.FC<{ content: any }> = ({ content }) => {
  const contentType = content.title ? 'film' : 'dizi';
  return (
    <a href={`/${contentType}/${content.id}`} className="block group" title={content.title || content.name}>
      <div className="relative rounded-lg overflow-hidden bg-gray-800 shadow hover:shadow-lg transition-shadow duration-200">
        <img
          src={content.poster_path ? `https://image.tmdb.org/t/p/w500${content.poster_path}` : 'https://placehold.co/320x480?text=No+Image'}
          alt={content.title || content.name}
          className="w-full h-72 sm:h-80 md:h-96 object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 py-2 px-1">
          {content.title || content.name}
        </div>
      </div>
    </a>
  );
};

const getRandomPage = (max = 20) => Math.floor(Math.random() * max) + 1;

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [content, setContent] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerError, setTrailerError] = useState<string | null>(null);

  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [topSeries, setTopSeries] = useState<any[]>([]);
  const [newMovies, setNewMovies] = useState<any[]>([]);
  const [newSeries, setNewSeries] = useState<any[]>([]);
  const [weeklyMovies, setWeeklyMovies] = useState<any[]>([]);
  const [weeklySeries, setWeeklySeries] = useState<any[]>([]);

  const isMovie = location.pathname.startsWith('/film');
  const userStr = localStorage.getItem('user');
  const currentUserId = userStr ? JSON.parse(userStr).id : 0;

  useEffect(() => {
    if (!userStr || !id) return;

    const userId = JSON.parse(userStr).id;
    const contentType = isMovie ? 'movie' : 'tv';

    fetch(`http://127.0.0.1:5000/watchlist/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const found = data.watchlist.find(
            (item: any) => item.content_id === Number(id) && item.content_type === contentType
          );
          setInWatchlist(!!found);
        }
      })
      .catch(error => {
        console.error('Error checking watchlist status:', error);
      });
  }, [id, isMovie]);

  const handleWatchlistToggle = async () => {
    if (!userStr) {
      toast.warning('➕ Listeye eklemek için giriş yapmalısınız.');
      return;
    }

    const userId = JSON.parse(userStr).id;
    const contentId = Number(id);
    const contentType = isMovie ? 'movie' : 'tv';

    try {
      let response;
      if (inWatchlist) {
        response = await removeFromWatchlist(userId, contentId, contentType);
        if (response.data.success) {
          toast.info('❌ Listeden çıkarıldı');
          setInWatchlist(false);
        }
      } else {
        response = await addToWatchlist(userId, contentId, contentType);
        if (response.data.success) {
          toast.success('✅ Listeye eklendi');
          setInWatchlist(true);
        }
      }

      window.dispatchEvent(new Event("watchlistUpdated"));
    } catch (err) {
      console.error('Watchlist toggle error:', err);
      toast.error("🚫 İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        const type = isMovie ? 'movie' : 'series';
        const detailRes = await fetch(`http://127.0.0.1:5000/api/${type}/${id}`);
        const detailData = await detailRes.json();
        setContent(detailData);

        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/${id}/credits?api_key=45c39b807f216578a180035495df545e&language=tr-TR`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast?.slice(0, 8) || []);

        const trailerRes = await fetch(`http://127.0.0.1:5000/trailer/${isMovie ? 'movie' : 'tv'}/${id}`);
        const trailerData = await trailerRes.json();
        if (trailerData.key) {
          setTrailerKey(trailerData.key);
          setTrailerError(null);
        } else {
          setTrailerError('Bu içerik için fragman bulunamadı.');
        }
      } catch (e) {
        console.error('Detay verisi alınamadı:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isMovie]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/category/movie?sort_by=imdb&page=${getRandomPage(10)}`)
      .then(res => res.json())
      .then(data => setTopMovies(data.results?.slice(0, 20) || []));
    fetch(`http://127.0.0.1:5000/api/category/tv?sort_by=imdb&page=${getRandomPage(10)}`)
      .then(res => res.json())
      .then(data => setTopSeries(data.results?.slice(0, 20) || []));
    fetch(`http://127.0.0.1:5000/api/category/movie?sort_by=year&page=${getRandomPage(10)}`)
      .then(res => res.json())
      .then(data => setNewMovies(data.results?.slice(0, 20) || []));
    fetch(`http://127.0.0.1:5000/api/category/tv?sort_by=year&page=${getRandomPage(10)}`)
      .then(res => res.json())
      .then(data => setNewSeries(data.results?.slice(0, 20) || []));
    fetch(`http://127.0.0.1:5000/api/category/movie?sort_by=imdb&page=${getRandomPage(10)}`)
      .then(res => res.json())
      .then(data => setWeeklyMovies(data.results?.slice(0, 20) || []));
    fetch(`http://127.0.0.1:5000/api/category/tv?sort_by=imdb&page=${getRandomPage(10)}`)
      .then(res => res.json())
      .then(data => setWeeklySeries(data.results?.slice(0, 20) || []));
  }, []);

  if (loading) return <div className="text-white text-center mt-10">Yükleniyor...</div>;
  if (!content) return (
    <div className="text-white text-center mt-10">
      <h2 className="text-2xl mb-4">İçerik bulunamadı</h2>
      <button onClick={() => navigate(-1)} className="bg-orange-600 px-4 py-2 rounded-lg">Geri Dön</button>
    </div>
  );

  const title = content.title || content.name;
  const posterUrl = content.poster_path
    ? `https://image.tmdb.org/t/p/w500${content.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';
  const year = (content.release_date || content.first_air_date || '').split('-')[0];
  const rating = content.vote_average?.toFixed(1);
  const duration = content.runtime
    ? `${content.runtime} dakika`
    : content.number_of_seasons
      ? `${content.number_of_seasons} Sezon`
      : 'Süre bilgisi yok';
  const director = content.credits?.crew?.find((c: any) => c.job === 'Director')?.name;
  const creator = content.created_by?.[0]?.name;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-gray-900 to-gray-800">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute inset-0 bg-black/50" />
        <img src={posterUrl} alt={title} className="w-full h-full object-cover opacity-40" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <img src={posterUrl} alt={title} className="w-full rounded mb-4" />
              <div className="space-y-2">
                <button
                  onClick={handleWatchlistToggle}
                  className={`w-full py-3 rounded-md flex items-center justify-center font-medium transition-colors duration-150 ${
                    inWatchlist ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {inWatchlist ? <><Check className="w-5 h-5 mr-2" /> Listemde</> : <><Plus className="w-5 h-5 mr-2" /> Listeme Ekle</>}
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <div className="flex items-center gap-4 text-gray-400 mb-4">
                <div className="flex items-center"><Star className="w-4 h-4 text-amber-400 mr-1" /> {rating}/10</div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {year}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {duration}</div>
              </div>

              <p className="text-gray-300 mb-4">
                <strong>Yönetmen:</strong> {isMovie ? (director || 'Bilinmiyor') : (creator || 'Bilinmiyor')}
              </p>

              <h3 className="text-xl font-semibold mb-2">Hikaye</h3>
              <p className="text-gray-400 mb-6">{content.overview}</p>

              {trailerKey ? (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Fragman</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      className="w-full rounded-lg shadow-lg"
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      title="Fragman"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              ) : trailerError ? (
                <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">{trailerError}</p>
                </div>
              ) : null}

              <h3 className="text-xl font-semibold mb-2 mt-10">Oyuncular</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cast.map((actor, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Image'}
                      alt={actor.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                    />
                    <p className="text-gray-300 font-medium">{actor.name}</p>
                    <p className="text-gray-500 text-sm">{actor.character}</p>
                  </div>
                ))}
              </div>

              {/* ✅ Yorumlar Bileşeni — HER ZAMAN GÖRÜNSÜN */}
              <div className="mt-12">
                <ReviewSection
                  contentId={parseInt(id || '0')}
                  contentType={isMovie ? 'movie' : 'tv'}
                  currentUserId={currentUserId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Öneri Kartları */}
      <div className="container mx-auto px-4 mt-16 space-y-12">
        <Section title="IMDB Top 100 Filmler" items={topMovies} />
        <Section title="IMDB Top 100 Diziler" items={topSeries} />
        <Section title="Yeni Filmler" items={newMovies} />
        <Section title="Yeni Diziler" items={newSeries} />
        <Section title="Ayın En İyi Filmleri" items={weeklyMovies} />
        <Section title="Ayın En İyi Dizileri" items={weeklySeries} />
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; items: any[] }> = ({ title, items }) => (
  <div className="rounded-xl bg-[#181e29] p-6 mb-8 shadow-md">
    <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.slice(0, 20).map((item) => (
        <PosterOnlyCard key={item.id} content={item} />
      ))}
    </div>
  </div>
);

export default DetailPage;
