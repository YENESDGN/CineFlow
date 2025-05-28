import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ChevronDown, LogIn, UserPlus, LogOut } from 'lucide-react';
import { searchTMDb } from '../../services/api';

interface ResultItem {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  poster_path?: string;
  release_date?: string;
}

const Navbar: React.FC = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');

  const categories = [
    'Aksiyon',
    'Bilim Kurgu',
    'Drama',
    'Komedi',
    'Macera',
    'Suç',
    'Gerilim',
    'Fantastik'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category: string) => {
    navigate(`/kategori/${category.toLowerCase()}`);
    setShowCategories(false);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      try {
        const searchResults = await searchTMDb(value);
        setResults(searchResults);
      } catch (error) {
        console.error('Arama hatası:', error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/giris";
  };

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-gray-900 shadow-lg">
      <div className="flex space-x-2">
        <Link 
          to="/"
          className="px-6 py-2 rounded-lg bg-gray-800 text-white font-medium transition-all duration-300 hover:bg-gray-700"
        >
          Ana Sayfa
        </Link>
        <Link 
          to="/diziler" 
          className="px-6 py-2 rounded-lg bg-gray-800 text-white font-medium transition-all duration-300 hover:bg-gray-700"
        >
          Dizi
        </Link>
        <Link 
          to="/filmler" 
          className="px-6 py-2 rounded-lg bg-gray-800 text-white font-medium transition-all duration-300 hover:bg-gray-700"
        >
          Film
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="px-6 py-2 rounded-lg bg-gray-800 text-white font-medium transition-all duration-300 hover:bg-gray-700 flex items-center"
          >
            Kategoriler
            <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${showCategories ? 'rotate-180' : ''}`} />
          </button>
          
          {showCategories && (
            <div className="absolute z-50 mt-2 w-48 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-2" role="menu" aria-orientation="vertical">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    role="menuitem"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Ara..."
            value={query}
            onChange={handleSearch}
            className={`py-2 pl-10 pr-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-transparent focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300 ${
              isSearchFocused ? 'w-64 bg-gray-700' : 'w-48'
            }`}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {results.length > 0 && (
            <div className="absolute mt-1 w-full rounded-md bg-gray-800 shadow-lg z-50 text-white max-h-64 overflow-y-auto">
              {results.map((item, index) => (
                <a
                  key={index}
                  href={`/${item.media_type === 'movie' ? 'film' : 'dizi'}/${item.id}`}
                  className="block px-4 py-2 hover:bg-gray-700 transition flex items-center space-x-2"
                >
                  {item.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-8 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <div className="font-medium">{item.title || item.name}</div>
                    <div className="text-sm text-gray-400">
                      {item.media_type === 'movie' ? 'Film' : 'Dizi'} • {item.release_date?.split('-')[0] || 'Tarih yok'}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!isLoggedIn ? (
            <>
              <Link
                to="/giris"
                className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium transition-all duration-300 hover:bg-gray-700 flex items-center"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Giriş Yap
              </Link>
              <Link
                to="/kayit"
                className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium transition-all duration-300 hover:bg-gray-700 flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Üye Ol
              </Link>
            </>
          ) : (
            <>
              <Link to="/profil" className="relative group">
                <div className="rounded-full bg-gray-800 p-2 overflow-hidden transition-all duration-300 transform group-hover:ring-2 group-hover:ring-gray-600">
                  <User className="h-6 w-6 text-white" />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium transition-all duration-300 hover:bg-red-500 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;