import React, { useState } from 'react';

const SimpleMovieChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
      >
        {isOpen ? (
          <span>X</span>
        ) : (
          <span>Chat</span>
        )}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          <div className="bg-orange-500 text-white p-4">
            <h3 className="font-bold">Simple Movie Chatbot</h3>
          </div>
          <div className="p-4 h-40 bg-gray-800 text-white">
            This is a simple chatbot for testing purposes.
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMovieChatbot;
