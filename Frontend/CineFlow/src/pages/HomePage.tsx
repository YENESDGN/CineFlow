import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContentList from '../components/Common/ContentList';
import ChatBox from '../components/ChatBoxWrapper';


const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/kategori/all');
  };

  return (
    <div className="container mx-auto py-8 px-4 relative">
      {/* Hero Section */}
      <div className="relative mb-10 rounded-xl overflow-hidden shadow-2xl bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <img 
          src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Hero" 
          className="w-full h-96 object-cover opacity-50"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">
            Film & Dizi Arşiviniz
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-lg">
            En sevdiğiniz filmleri ve dizileri keşfedin, puanlayın ve listenize ekleyin.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={handleExplore}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Hemen Keşfet
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <ContentList 
            title={<span className="bg-[#181e29] px-3 py-1 rounded text-white">IMDB Top 100 Filmler</span>} 
            type="top"
            contentType="movie"
          />
          <ContentList 
            title="Ayın En İyi Filmleri" 
            type="weekly"
            contentType="movie"
          />
        </div>
        
        <div className="space-y-6">
          <ContentList 
            title="Yeni Filmler" 
            type="new"
            contentType="movie"
          />
          <ContentList 
            title="Yeni Diziler" 
            type="new"
            contentType="tv"
          />
        </div>
        
        <div className="space-y-6">
          <ContentList 
            title={<span className="bg-[#181e29] px-3 py-1 rounded text-white">IMDB Top 100 Diziler</span>} 
            type="top"
            contentType="tv"
          />
          <ContentList 
            title="Ayın En İyi Dizileri" 
            type="weekly"
            contentType="tv"
          />
        </div>
      </div>

      {/* ✅ Chat kutusu sabit şekilde sağ alt köşeye ekleniyor */}
      <div className="fixed bottom-4 right-4 w-full max-w-md z-50">
        <ChatBox />
      </div>
    </div>
  );
};

export default HomePage;
