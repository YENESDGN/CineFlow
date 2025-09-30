import { useState, useEffect } from 'react';
import * as api from '../services/api';

interface ContentHookResult {
  data: any[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

export function useContent(type: 'weekly' | 'new' | 'top', contentType: 'movie' | 'tv', page: number = 1): ContentHookResult {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;
        switch (type) {
          case 'weekly':
            response = await (contentType === 'movie' ? api.fetchWeeklyMovies(page) : api.fetchWeeklyTVShows(page));
            break;
          case 'new':
            response = await (contentType === 'movie' ? api.fetchNewMovies(page) : api.fetchNewTVShows(page));
            break;
          case 'top':
            response = await (contentType === 'movie' ? api.fetchTopMovies(page) : api.fetchTopTVShows(page));
            break;
        }
        setData(response.data.results);
        setTotalPages(response.data.total_pages);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, contentType, page]);

  return { data, loading, error, totalPages };
}

export function useSearch(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchContent = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.searchContent(query);
        setResults(response.data.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Arama sırasında bir hata oluştu');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchContent, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading, error };
}