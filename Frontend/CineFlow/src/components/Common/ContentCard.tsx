import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, CheckCircle, Star, Clock, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatRating } from '../../utils/helpers';
import { addToWatchlist, removeFromWatchlist } from '../../services/api';

interface ContentCardProps {
  content: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    overview?: string;
    runtime?: number;
    number_of_seasons?: number;
  };
  type: 'movie' | 'tv';
  inWatchlist?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, type, inWatchlist: inWatchlistProp }) => {
  const [inWatchlistState, setInWatchlistState] = useState(inWatchlistProp || false);

  useEffect(() => {
    setInWatchlistState(inWatchlistProp || false);
  }, [inWatchlistProp]);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.warning('➕ Listeye eklemek için giriş yapmalısınız.');
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    try {
      let response;
      if (inWatchlistState) {
        response = await removeFromWatchlist(userId, content.id, type);
        if (response.data.success) {
          toast.info('❌ Listeden çıkarıldı');
          setInWatchlistState(false);
        } else {
          throw new Error(response.data.message || 'Listeden çıkarma işlemi başarısız oldu');
        }
      } else {
        response = await addToWatchlist(userId, content.id, type);
        if (response.data.success) {
          toast.success('✅ Listeye eklendi');
          setInWatchlistState(true);
        } else {
          throw new Error(response.data.message || 'Listeye ekleme işlemi başarısız oldu');
        }
      }

      const event = new Event("watchlistUpdated");
      window.dispatchEvent(event);

    } catch (err) {
      console.error('Watchlist toggle error:', err);
      toast.error("🚫 İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const title = content.title || content.name || 'Başlık Bulunamadı';
  const year = new Date(content.release_date || content.first_air_date || '').getFullYear() || 'N/A';
  const posterUrl = content.poster_path
    ? `https://image.tmdb.org/t/p/w500${content.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Görsel+Yok';

  const duration = type === 'movie'
    ? content.runtime ? `${content.runtime} dakika` : 'Süre yok'
    : content.number_of_seasons ? `${content.number_of_seasons} sezon` : 'Sezon yok';

  return (
    <div className="flex flex-col bg-white rounded-xl p-4 h-full min-h-[370px] items-center text-center">
      <div className="w-40 flex-shrink-0">
        <Link to={`/${type === 'movie' ? 'film' : 'dizi'}/${content.id}`}>
          <img src={posterUrl} alt={title} className="w-full h-60 object-cover rounded-lg" loading="lazy" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col w-full mt-2 items-center">
        <h3 className="text-lg font-semibold text-black group-hover:text-amber-400 transition-colors">
          <Link to={`/${type === 'movie' ? 'film' : 'dizi'}/${content.id}`}>
            {title}
          </Link>
        </h3>

        <div className="flex items-center justify-center space-x-3 mt-2 text-sm text-gray-700">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-amber-400 mr-1" />
            <span>{formatRating(content.vote_average)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{year}</span>
          </div>
        </div>

        <div className="flex items-center justify-center mt-1 text-sm text-gray-700">
          <Clock className="w-4 h-4 mr-1" />
          <span>{duration}</span>
        </div>

        {content.overview && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
            {content.overview}
          </p>
        )}

        <div className="mt-4 flex justify-center w-full">
          <button
            onClick={handleWatchlistToggle}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              inWatchlistState
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {inWatchlistState ? (
              <>
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Listemde
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 inline mr-2" />
                Listeye Ekle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
