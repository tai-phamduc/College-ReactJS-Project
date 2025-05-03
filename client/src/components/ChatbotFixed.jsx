import React, { useState, useRef, useEffect } from 'react';

const ChatbotFixed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi là trợ lý phim ảnh. Tôi có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested questions
  const suggestedQuestions = [
    "Phim hành động hay nhất?",
    "Phim chiếu rạp mới nhất?",
    "Giá vé xem phim?",
    "Lịch chiếu cuối tuần?"
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simple responses based on keywords
  const getResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('xin chào') || input.includes('hello') || input.includes('hi') || input.includes('chào')) {
      return "Xin chào! Tôi có thể giúp gì cho bạn về phim ảnh hôm nay?";
    }

    if (input.includes('phim hành động') || input.includes('action')) {
      return "Một số phim hành động hay nhất hiện nay: The Dark Knight, Mad Max: Fury Road, John Wick, Mission Impossible và Fast & Furious series.";
    }

    if (input.includes('phim hài') || input.includes('comedy')) {
      return "Các phim hài được yêu thích: The Hangover, Bridesmaids, Superbad, Step Brothers và Dumb and Dumber.";
    }

    if (input.includes('phim kinh dị') || input.includes('horror')) {
      return "Phim kinh dị đáng xem: The Shining, Hereditary, Get Out, A Quiet Place và The Conjuring.";
    }

    if (input.includes('phim mới') || input.includes('new movies')) {
      return "Các phim mới đang chiếu: Dune: Part Two, Godzilla x Kong: The New Empire và Ghostbusters: Frozen Empire. Bạn có thể xem lịch chiếu đầy đủ trong mục 'Now Showing'.";
    }

    if (input.includes('giá vé') || input.includes('price')) {
      return "Giá vé xem phim: 90.000đ cho suất chiếu thường, 120.000đ cho suất chiếu 3D, 150.000đ cho IMAX. Chúng tôi có giảm giá cho học sinh, sinh viên và người cao tuổi.";
    }

    if (input.includes('lịch chiếu') || input.includes('schedule')) {
      return "Lịch chiếu phim được cập nhật hàng ngày. Bạn có thể xem lịch chiếu đầy đủ trong mục 'Movies' và chọn phim bạn muốn xem.";
    }

    if (input.includes('đặt vé') || input.includes('booking')) {
      return "Để đặt vé, bạn có thể chọn phim trong mục 'Now Showing', sau đó chọn 'Book Now'. Bạn sẽ được hướng dẫn chọn ngày, giờ, rạp và ghế ngồi.";
    }

    if (input.includes('cảm ơn') || input.includes('thank')) {
      return "Không có gì! Rất vui được giúp đỡ bạn. Bạn có câu hỏi nào khác không?";
    }

    if (input.includes('tạm biệt') || input.includes('bye')) {
      return "Tạm biệt! Chúc bạn xem phim vui vẻ!";
    }

    return "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về phim đang chiếu, lịch chiếu, giá vé hoặc cách đặt vé.";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate response with typing effect
    setTimeout(() => {
      const responseText = getResponse(input);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    }, 1500);
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  // Styles with improved aesthetics
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
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    border: 'none',
    cursor: 'pointer',
    zIndex: 9999,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: isOpen ? 'scale(0.9)' : 'scale(1)'
  };

  const chatWindowStyle = {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    width: '350px',
    height: '500px',
    backgroundColor: '#1a1a1a', // Darker background
    borderRadius: '12px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9999,
    border: '1px solid #333333',
    overflow: 'hidden',
    animation: 'slideIn 0.3s ease-out'
  };

  const headerStyle = {
    background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)', // Gradient orange
    color: 'white',
    padding: '15px 20px',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  };

  const messagesContainerStyle = {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#1a1a1a',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23222222" fill-opacity="0.4" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
    backgroundSize: '20px 20px'
  };

  const inputContainerStyle = {
    display: 'flex',
    padding: '12px 15px',
    borderTop: '1px solid #333333',
    backgroundColor: '#222222'
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '20px 0 0 20px',
    border: 'none',
    backgroundColor: '#333333',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'background-color 0.3s ease'
  };

  const sendButtonStyle = {
    padding: '0 20px',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '0 20px 20px 0',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    height: '44px',
    minWidth: '70px'
  };

  const userMessageStyle = {
    alignSelf: 'flex-end',
    background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '18px 18px 0 18px',
    maxWidth: '80%',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    marginBottom: '8px',
    wordBreak: 'break-word',
    fontSize: '14px',
    lineHeight: '1.5'
  };

  const assistantMessageStyle = {
    alignSelf: 'flex-start',
    backgroundColor: '#333333',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '18px 18px 18px 0',
    maxWidth: '80%',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    marginBottom: '8px',
    wordBreak: 'break-word',
    fontSize: '14px',
    lineHeight: '1.5'
  };

  const suggestedQuestionsStyle = {
    padding: '10px 15px',
    backgroundColor: '#222222',
    borderTop: '1px solid #333333',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  };

  const questionBubbleStyle = {
    backgroundColor: '#333333',
    color: '#f97316',
    border: '1px solid #444444',
    borderRadius: '15px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    whiteSpace: 'nowrap'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    transition: 'background-color 0.2s ease'
  };

  const typingIndicatorStyle = {
    alignSelf: 'flex-start',
    backgroundColor: '#333333',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '18px 18px 18px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#f97316',
    borderRadius: '50%',
    opacity: 0.7
  };

  return (
    <>
      <button
        style={buttonStyle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {isOpen && (
        <div style={chatWindowStyle}>
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: '16px' }}>Trợ lý phim ảnh</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={closeButtonStyle}
              aria-label="Close chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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

            {isTyping && (
              <div style={typingIndicatorStyle}>
                <div style={{...dotStyle, animation: 'bounce 0.8s infinite'}}></div>
                <div style={{...dotStyle, animation: 'bounce 0.8s infinite 0.2s'}}></div>
                <div style={{...dotStyle, animation: 'bounce 0.8s infinite 0.4s'}}></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length < 3 && (
            <div style={suggestedQuestionsStyle}>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  style={questionBubbleStyle}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} style={inputContainerStyle}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              style={inputStyle}
              disabled={isTyping}
            />
            <input
              type="submit"
              value="Gửi"
              style={sendButtonStyle}
              disabled={isTyping || !input.trim()}
            />
          </form>

          <style>
            {`
              @keyframes slideIn {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }

              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-4px); }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default ChatbotFixed;
