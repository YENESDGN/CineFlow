import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Tv, Heart, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-500">Film & Dizi Arşivi</h3>
            <p className="text-sm">
              En sevdiğiniz film ve dizileri keşfedin, değerlendirin ve kişisel listenizi oluşturun.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-3 text-amber-500">Keşfet</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/filmler" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Film size={16} className="mr-2" /> Filmler
                </Link>
              </li>
              <li>
                <Link to="/diziler" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Tv size={16} className="mr-2" /> Diziler
                </Link>
              </li>
              <li>
                <Link to="/top-100" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Heart size={16} className="mr-2" /> IMDB Top 100
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-3 text-amber-500">Kategoriler</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/kategori/aksiyon" className="text-gray-400 hover:text-white transition-colors">
                  Aksiyon
                </Link>
              </li>
              <li>
                <Link to="/kategori/bilim-kurgu" className="text-gray-400 hover:text-white transition-colors">
                  Bilim Kurgu
                </Link>
              </li>
              <li>
                <Link to="/kategori/drama" className="text-gray-400 hover:text-white transition-colors">
                  Drama
                </Link>
              </li>
              <li>
                <Link to="/kategori/komedi" className="text-gray-400 hover:text-white transition-colors">
                  Komedi
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-3 text-amber-500">Hesap</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profil" className="text-gray-400 hover:text-white transition-colors">
                  Profilim
                </Link>
              </li>
              <li>
                <Link to="/izleme-listem" className="text-gray-400 hover:text-white transition-colors">
                  İzleme Listem
                </Link>
              </li>
              <li>
                <Link to="/puanlamalarim" className="text-gray-400 hover:text-white transition-colors">
                  Puanlamalarım
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© 2025 Film & Dizi Arşivi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;