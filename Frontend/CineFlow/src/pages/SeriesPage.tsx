import React, { useState, useEffect } from 'react';
import ContentCard from '../components/Common/ContentCard';

const SeriesPage: React.FC = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'vote_average' | 'year'>('vote_average');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dizileri çek (sayfalı)
  useEffect(() => {
    let url = `http://127.0.0.1:5000/api/category/tv?page=${page}`;
    if (selectedGenre !== 'all') {
      url += `&genre=${selectedGenre}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("✅ Dizi verisi:", data?.results?.length);
        setSeries(data.results || []);
        setTotalPages(data.total_pages || 10); // varsayılan 10
      })
      .catch(err => console.error('❌ Dizi verisi alınamadı:', err));
  }, [page, selectedGenre]);

  // Türleri çek
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/series/genres')
      .then(res => res.json())
      .then(data => setGenres(data.genres || []))
      .catch(err => console.error('❌ Tür verisi alınamadı:', err));
  }, []);

  // Filtrele
  let filteredSeries = [...series];
  if (selectedGenre !== 'all') {
    const selectedId = parseInt(selectedGenre);
    filteredSeries = series.filter(s => Array.isArray(s.genre_ids) && s.genre_ids.includes(selectedId));
  }

  // Sıralama
  filteredSeries.sort((a, b) => {
    if (sortBy === 'vote_average') {
      return b.vote_average - a.vote_average;
    } else {
      return parseInt((b.first_air_date || '0').slice(0, 4)) -
             parseInt((a.first_air_date || '0').slice(0, 4));
    }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-black mb-4 md:mb-0">Diziler</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* FİLTRE */}
        <div className="md:block">
          <div className="bg-gray-900 p-5 rounded-lg shadow-md sticky top-20">
            <h3 className="text-lg font-semibold text-white mb-4">Filtreler</h3>
            <h4 className="text-gray-300 font-medium mb-2">Tür</h4>
            <div className="space-y-2 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="genre"
                  checked={selectedGenre === 'all'}
                  onChange={() => setSelectedGenre('all')}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="ml-2 text-sm text-gray-300">Tümü</span>
              </label>
              {genres.map((g) => (
                <label key={g.id} className="flex items-center">
                  <input
                    type="radio"
                    name="genre"
                    checked={selectedGenre === g.id.toString()}
                    onChange={() => setSelectedGenre(g.id.toString())}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span className="ml-2 text-sm text-gray-300">{g.name}</span>
                </label>
              ))}
            </div>

            <h4 className="text-gray-300 font-medium mb-2">Sırala</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'vote_average'}
                  onChange={() => setSortBy('vote_average')}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="ml-2 text-sm text-gray-300">IMDB Puanı</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === 'year'}
                  onChange={() => setSortBy('year')}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="ml-2 text-sm text-gray-300">Yıl</span>
              </label>
            </div>
          </div>
        </div>

        {/* LİSTE */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSeries.slice(0, 22).map((serie) => (
              <ContentCard
                key={serie.id}
                content={{
                  id: serie.id,
                  title: serie.name,
                  vote_average: serie.vote_average,
                  release_date: serie.first_air_date,
                  poster_path: serie.poster_path,
                  number_of_seasons: serie.number_of_seasons,
                }}
                type="tv"
              />
            ))}
            {Array.from({ length: 22 - filteredSeries.slice(0, 22).length }).map((_, idx) => (
              <div key={"placeholder-" + idx} className="bg-transparent rounded-lg" />
            ))}
          </div>

          {filteredSeries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Aradığınız kriterlere uygun dizi bulunamadı.
              </p>
            </div>
          )}

          {/* 📄 Sayfalama Butonları */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
            >
              Önceki
            </button>
            <span className="text-gray-700 font-medium">
              {`Sayfa ${page} / ${totalPages.toLocaleString('tr-TR')}`}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;
