import React, { useState } from 'react';

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setReply(data.success ? data.reply : '❌ Hata: ' + data.message);
      setMessage(''); // temizle ama alanı göster
    } catch (error) {
      setReply('❌ Sunucu hatası: ' + (error as Error).message);
    }
  };

  return (
    <div className="w-full max-h-[90vh] overflow-y-auto">
      <textarea
        className="w-full h-16 resize-none p-2 border rounded-md"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Gönder
      </button>

      {reply && (
        <div className="mt-4 max-h-[300px] overflow-y-auto p-3 bg-gray-100 rounded border text-black whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
