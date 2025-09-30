import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = "https://api.themoviedb.org/3";
const FLASK_API = (import.meta.env.VITE_BACKEND_URL as string) || 'http://127.0.0.1:5000';

export interface TMDBResponse {
  results: any[];
  page: number;
  total_pages: number;
  total_results: number;
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'tr-TR',
  },
});

export const fetchWeeklyMovies = (page = 1) => api.get<TMDBResponse>('/trending/movie/week', { params: { page } });
export const fetchWeeklyTVShows = (page = 1) => api.get<TMDBResponse>('/trending/tv/week', { params: { page } });
export const fetchNewMovies = (page = 1) => api.get<TMDBResponse>('/movie/now_playing', { params: { page } });
export const fetchNewTVShows = (page = 1) => api.get<TMDBResponse>('/tv/on_the_air', { params: { page } });
export const fetchTopMovies = (page = 1) => api.get<TMDBResponse>('/movie/top_rated', { params: { page } });
export const fetchTopTVShows = (page = 1) => api.get<TMDBResponse>('/tv/top_rated', { params: { page } });

export const fetchContentDetails = async (id: string, type: 'movie' | 'tv') => {
  const [details, credits, videos] = await Promise.all([
    api.get(`/${type}/${id}`),
    api.get(`/${type}/${id}/credits`),
    api.get(`/${type}/${id}/videos`)
  ]);

  return {
    ...details.data,
    credits: credits.data,
    videos: videos.data
  };
};

export const searchContent = async (query: string, page = 1) => {
  return api.get<TMDBResponse>('/search/multi', {
    params: { query, page }
  });
};

// Route category fetches through backend API; do not expose DB creds in frontend
export const fetchContentByCategory = async (categoryId: number) => {
  try {
    const response = await axios.get(`${FLASK_API}/api/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category content:', error);
    throw error;
  }
};

export const searchTMDb = async (query: string) => {
  try {
    const response = await fetch(`${FLASK_API}/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.success) {
      return data.results;
    }
    return [];
  } catch (error) {
    console.error('Arama hatası:', error);
    return [];
  }
};

// ✅ WATCHLIST API'LERİ
export const addToWatchlist = async (userId: number, contentId: number, contentType: 'movie' | 'tv') => {
  return axios.post(`${FLASK_API}/watchlist/add`, {
    user_id: userId,
    content_id: contentId,
    content_type: contentType,
  });
};

export const removeFromWatchlist = async (userId: number, contentId: number, contentType: 'movie' | 'tv') => {
  return axios.post(`${FLASK_API}/watchlist/remove`, {
    user_id: userId,
    content_id: contentId,
    content_type: contentType,
  });
};

export const getUserWatchlist = async (userId: number) => {
  return axios.get(`${FLASK_API}/watchlist/${userId}`);
};
