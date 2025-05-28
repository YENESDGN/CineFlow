import React, { useEffect, useState } from 'react';
import { User, Settings, Trash2, Edit3, Star, X } from 'lucide-react';
import { getUserWatchlist, fetchContentDetails } from '../services/api';
import ContentCard from '../components/Common/ContentCard';

interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'puanlamalar' | 'izlemeListem' | 'ayarlar'>('puanlamalar');
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string; email: string; profileImage?: string } | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [watchlist, setWatchlist] = useState<{ content: any; type: 'movie' | 'tv' }[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const parsed = JSON.parse(userData);
    setCurrentUser(parsed);
    setUsernameInput(parsed.username);
    setEmailInput(parsed.email);

    const loadWatchlist = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getUserWatchlist(parsed.id);
        if (res.data.success) {
          const items: WatchlistItem[] = res.data.watchlist.map((item: any) => ({
            id: Number(item.content_id),
            type: item.content_type,
          }));

          const detailedItems = await Promise.all(
            items.map(async (item) => {
              try {
                const details = await fetchContentDetails(String(item.id), item.type);
                return { content: details, type: item.type };
              } catch (error) {
                console.error(`Error fetching details for ${item.type} ${item.id}:`, error);
                return null;
              }
            })
          );

          const validItems = detailedItems.filter(Boolean);
          setWatchlist(validItems as any);
        } else {
          throw new Error(res.data.message || 'İzleme listesi yüklenemedi');
        }
      } catch (error) {
        console.error('Error loading watchlist:', error);
        setError('İzleme listesi yüklenirken bir hata oluştu.');
        setWatchlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    const loadUserReviews = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user/reviews/${parsed.id}`);
        const data = await res.json();
        if (data.success) {
          setUserReviews(data.reviews);
          setReviewCount(data.reviews.length);
        }
      } catch (error) {
        console.error('Yorumlar yüklenemedi:', error);
      }
    };

    const handleEvent = () => {
      console.log('🔄 watchlistUpdated event yakalandı, liste yeniden çekiliyor...');
      setTimeout(loadWatchlist, 100);
    };

    window.addEventListener("watchlistUpdated", handleEvent);
    loadWatchlist();
    loadUserReviews();
    return () => window.removeEventListener("watchlistUpdated", handleEvent);
  }, []);

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm("Yorumu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`http://127.0.0.1:5000/reviews/delete/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setUserReviews((prev) => prev.filter((r) => r.id !== id));
      setReviewCount((prev) => prev - 1);
    } else {
      alert('Silme işlemi başarısız');
    }
  };

  const handleEditSubmit = async () => {
    if (!editingReview) return;
    const res = await fetch(`http://127.0.0.1:5000/reviews/update/${editingReview.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: editRating, comment: editComment })
    });
    const data = await res.json();
    if (data.success) {
      setUserReviews((prev) => prev.map((r) => r.id === editingReview.id ? { ...r, rating: editRating, comment: editComment } : r));
      setEditingReview(null);
    } else {
      alert('Güncelleme başarısız');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`http://127.0.0.1:5000/user/upload-photo/${currentUser.id}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setCurrentUser((prev) => prev ? { ...prev, profileImage: data.imagePath } : prev);
      localStorage.setItem('user', JSON.stringify({ ...currentUser, profileImage: data.imagePath }));
    } else {
      alert('Fotoğraf yükleme başarısız');
    }
  };

  const handleProfileUpdate = async () => {
    if (!currentUser) return;
    const res = await fetch(`http://127.0.0.1:5000/user/update/${currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, email: emailInput }),
    });

    const data = await res.json();
    if (data.success) {
      setCurrentUser({ ...currentUser, username: usernameInput, email: emailInput });
      localStorage.setItem('user', JSON.stringify({ ...currentUser, username: usernameInput, email: emailInput }));
    } else {
      alert('Bilgiler güncellenemedi');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Giriş yapmamışsınız.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 relative">
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setEditingReview(null)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-white text-lg font-bold mb-4">Yorumu Düzenle</h2>
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-1 block">Puan</label>
              <input
                type="number"
                min={1}
                max={10}
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-1 block">Yorum</label>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 rounded"
              ></textarea>
            </div>
            <button
              onClick={handleEditSubmit}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded w-full"
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
            <div className="flex flex-col items-center">
              {currentUser.profileImage ? (
                <img
                  src={`http://127.0.0.1:5000${currentUser.profileImage}`}
                  key={currentUser.profileImage}
                  alt={currentUser.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-amber-500 mb-4 shadow"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <User className="w-16 h-16 text-gray-500" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-white">{currentUser.username}</h2>
              <p className="text-gray-400 mt-1">Film & Dizi Tutkunu</p>
            </div>

            <div className="mt-8">
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex">
                  {['puanlamalar', 'izlemeListem', 'ayarlar'].map((tab) => (
                    <button
                      key={tab}
                      className={`flex-1 py-3 px-2 text-center font-medium text-sm transition-colors duration-300 ${
                        activeTab === tab ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab as any)}
                    >
                      {tab === 'puanlamalar' ? 'Puanlamalar ve Yorumlar' : tab === 'izlemeListem' ? 'İzleme Listem' : 'Ayarlar'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{watchlist.length}</p>
                <p className="text-xs text-gray-400 mt-1">İzleme Listesi</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">0</p>
                <p className="text-xs text-gray-400 mt-1">İzlenme</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-white">{reviewCount}</p>
                <p className="text-xs text-gray-400 mt-1">Değerlendirme</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-gray-900 rounded-lg p-6 shadow-lg h-full">
            <h2 className="text-2xl font-bold text-white mb-6">
              {activeTab === 'puanlamalar' ? 'Yorumlarım' : 'Listem'}
            </h2>

            {activeTab === 'puanlamalar' && (
              <div className="space-y-4">
                {userReviews.length === 0 ? (
                  <p className="text-gray-400">Hiç yorum yapılmamış.</p>
                ) : (
                  userReviews.map((review) => (
                    <div key={review.id} className="bg-gray-800 text-white rounded-lg p-4">
                      <div className="flex gap-4">
                        <img
                          src={review.poster_path ? `https://image.tmdb.org/t/p/w92${review.poster_path}` : 'https://placehold.co/92x138?text=No+Image'}
                          alt={review.title}
                          className="w-[92px] rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{review.title}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(10)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" />
                            ))}
                          </div>
                          {review.comment && <p className="mt-1">{review.comment}</p>}
                          <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleString('tr-TR')}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => {
                                setEditingReview(review);
                                setEditRating(review.rating);
                                setEditComment(review.comment);
                              }}
                              className="text-blue-400 hover:underline text-sm flex items-center gap-1"
                            >
                              <Edit3 className="w-4 h-4" /> Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-red-400 hover:underline text-sm flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Sil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'izlemeListem' && (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">İzleme listesi yükleniyor...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500"
                    >
                      Yeniden Dene
                    </button>
                  </div>
                ) : watchlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {watchlist.map((item) => (
                      <ContentCard
                        key={`${item.type}-${item.content.id}`}
                        content={item.content}
                        type={item.type}
                        inWatchlist={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">İzleme listeniz boş.</p>
                    <p className="text-gray-500 mt-2">
                      Film ve dizileri izleme listenize ekleyerek burada görüntüleyebilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ayarlar' && (
              <div className="bg-gray-800 p-5 rounded-lg">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" /> Hesap Ayarları
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Kullanıcı Adı</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">E-posta</label>
                    <input
                      type="email"
                      className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Profil Fotoğrafı</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-amber-600 file:text-white hover:file:bg-amber-500"
                    />
                  </div>
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded transition-colors duration-300"
                  >
                    Bilgilerimi Güncelle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
