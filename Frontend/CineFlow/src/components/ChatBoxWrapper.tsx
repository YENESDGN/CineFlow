import React, { useState } from 'react';
import ChatBox from './ChatBox';

const ChatBoxWrapper: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleChat = () => {
    setOpen(!open);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-4">
          <ChatBox />
        </div>
      )}
      
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition text-2xl flex items-center justify-center"
        title={open ? 'Kapat' : 'Sohbeti Aç'}
      >
        💬
      </button>
    </div>
  );
};

export default ChatBoxWrapper;
