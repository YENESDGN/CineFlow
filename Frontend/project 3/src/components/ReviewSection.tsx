import React, { useEffect, useState } from "react";
import axios from "axios";

interface Review {
  id: number;
  user_id: number;
  content_id: number;
  content_type: string;
  rating: number;
  comment: string;
  username: string;
  profile_image: string;
  created_at: string;
}

interface Props {
  contentId: number;
  contentType: "movie" | "tv";
  currentUserId: number; // giriş yapılmadıysa 0 geliyor
}

const ReviewSection: React.FC<Props> = ({ contentId, contentType, currentUserId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const fetchReviews = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/reviews/${contentType}/${contentId}`);
    setReviews(res.data.reviews || []);
  };

  const handleAddReview = async () => {
    if (currentUserId === 0) {
      alert("Yorum yapabilmek için giriş yapmalısınız.");
      return;
    }
    if (!newComment || newRating === 0) return;

    await axios.post("http://127.0.0.1:5000/reviews/add", {
      user_id: currentUserId,
      content_id: contentId,
      content_type: contentType,
      rating: newRating,
      comment: newComment,
    });

    setNewComment("");
    setNewRating(0);
    fetchReviews();
  };

  const handleDeleteReview = async (id: number) => {
    await axios.delete(`http://127.0.0.1:5000/reviews/delete/${id}`);
    fetchReviews();
  };

  const handleUpdateReview = async (review: Review) => {
    const updatedComment = prompt("Yeni yorum:", review.comment);
    const updatedRating = parseFloat(prompt("Yeni puan (1–10):", review.rating.toString()) || "0");
    if (!updatedComment || updatedRating < 1 || updatedRating > 10) return;

    await axios.put(`http://127.0.0.1:5000/reviews/update/${review.id}`, {
      comment: updatedComment,
      rating: updatedRating,
    });

    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, [contentId]);

  return (
    <div className="p-4 border-t mt-6 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-white">Yorumlar</h3>

      <div className="flex flex-col gap-2 mb-4">
        {currentUserId === 0 && (
          <div className="text-yellow-400 font-medium text-sm">
            Yorum yapabilmek için giriş yapmalısınız.
          </div>
        )}

        <textarea
          placeholder="Yorumunuzu yazın..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={currentUserId === 0}
          className="border p-2 rounded text-black disabled:opacity-50"
        />

        {/* ⭐ Yıldızlı Puanlama */}
        <div className="flex gap-1 items-center">
          {[...Array(10)].map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={starValue}
                onClick={() => {
                  if (currentUserId !== 0) setNewRating(starValue);
                }}
                className={`cursor-pointer text-2xl ${
                  starValue <= newRating ? "text-yellow-400" : "text-gray-500"
                } ${currentUserId === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                ★
              </span>
            );
          })}
          <span className="ml-2 text-white">{newRating}/10</span>
        </div>

        <button
          onClick={handleAddReview}
          disabled={currentUserId === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Yorum Ekle
        </button>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-300">Henüz yorum yok.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="border border-gray-700 p-3 rounded mb-3 bg-gray-900">
            <div className="flex items-center gap-3">
              <img
                src={`http://127.0.0.1:5000${r.profile_image}`}
                alt={r.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <strong className="text-white">{r.username}</strong>{" "}
                <span className="text-sm text-gray-400">· {r.created_at.split("T")[0]}</span>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-yellow-400 font-semibold">Puan: {r.rating}/10</p>
              <p className="text-gray-200">{r.comment}</p>
              {r.user_id === currentUserId && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateReview(r)}
                    className="text-blue-400 underline text-sm"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="text-red-400 underline text-sm"
                  >
                    Sil
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewSection;
