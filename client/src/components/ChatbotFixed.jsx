import React, { useState } from 'react';

const ChatbotFixed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi có thể giúp gì cho bạn về phim ảnh?' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { role: 'user', content: input }]);
    
    // Simulate response
    setTimeout(() => {
      setMessages([
        ...messages, 
        { role: 'user', content: input },
        { role: 'assistant', content: 'Cảm ơn bạn đã hỏi. Đây là một chatbot đơn giản để demo.' }
      ]);
    }, 500);
    
    setInput('');
  };

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#f97316', // orange-500
    color: 'white',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
    zIndex: 9999
  };

  const chatWindowStyle = {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    width: '300px',
    height: '400px',
    backgroundColor: '#1f2937', // gray-800
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9999,
    border: '1px solid #374151' // gray-700
  };

  const headerStyle = {
    backgroundColor: '#f97316', // orange-500
    color: 'white',
    padding: '10px 15px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const messagesContainerStyle = {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const inputContainerStyle = {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #374151' // gray-700
  };

  const inputStyle = {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '4px 0 0 4px',
    border: 'none',
    backgroundColor: '#374151', // gray-700
    color: 'white'
  };

  const sendButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#f97316', // orange-500
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer'
  };

  const userMessageStyle = {
    alignSelf: 'flex-end',
    backgroundColor: '#f97316', // orange-500
    color: 'white',
    padding: '8px 12px',
    borderRadius: '8px 8px 0 8px',
    maxWidth: '80%'
  };

  const assistantMessageStyle = {
    alignSelf: 'flex-start',
    backgroundColor: '#4b5563', // gray-600
    color: 'white',
    padding: '8px 12px',
    borderRadius: '8px 8px 8px 0',
    maxWidth: '80%'
  };

  return (
    <>
      <button 
        style={buttonStyle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'X' : 'Chat'}
      </button>

      {isOpen && (
        <div style={chatWindowStyle}>
          <div style={headerStyle}>
            <span>Movie Chatbot</span>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              X
            </button>
          </div>

          <div style={messagesContainerStyle}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                style={message.role === 'user' ? userMessageStyle : assistantMessageStyle}
              >
                {message.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={inputContainerStyle}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={inputStyle}
            />
            <button type="submit" style={sendButtonStyle}>Gửi</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotFixed;
