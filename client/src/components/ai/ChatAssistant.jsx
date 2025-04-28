import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane, FaSearch, FaFilm, FaTicketAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { movieService, searchService } from '../../services/api';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý AI của MovieHub. Tôi có thể giúp bạn tìm kiếm phim, đưa ra gợi ý, hoặc trả lời câu hỏi về lịch chiếu. Bạn cần giúp gì?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Process the message and generate a response
    try {
      const response = await processMessage(input);
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error processing message:', error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    }
  };

  // Process user message and generate a response
  const processMessage = async (message) => {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check for search intent
    if (
      lowerMessage.includes('tìm') || 
      lowerMessage.includes('kiếm') || 
      lowerMessage.includes('search') ||
      lowerMessage.includes('phim') ||
      lowerMessage.includes('movie')
    ) {
      // Extract search query
      let searchQuery = message;
      
      // Remove common phrases to get better search results
      const phrasesToRemove = [
        'tìm phim', 'tìm kiếm phim', 'tìm cho tôi phim', 
        'tôi muốn xem phim', 'bạn có thể tìm phim', 
        'search for', 'find me', 'looking for',
        'tìm', 'kiếm', 'search', 'find'
      ];
      
      phrasesToRemove.forEach(phrase => {
        searchQuery = searchQuery.replace(new RegExp(phrase, 'gi'), '');
      });
      
      searchQuery = searchQuery.trim();
      
      // Perform search
      try {
        const results = await searchService.globalSearch(searchQuery);
        const movies = results.movies || [];
        setSearchResults(movies);
        
        if (movies.length > 0) {
          return {
            id: messages.length + 1,
            text: `Tôi đã tìm thấy ${movies.length} phim phù hợp với "${searchQuery}". Đây là một số kết quả:`,
            sender: 'bot',
            timestamp: new Date(),
            searchResults: movies.slice(0, 3) // Show top 3 results
          };
        } else {
          return {
            id: messages.length + 1,
            text: `Tôi không tìm thấy phim nào phù hợp với "${searchQuery}". Vui lòng thử lại với từ khóa khác.`,
            sender: 'bot',
            timestamp: new Date()
          };
        }
      } catch (error) {
        console.error('Search error:', error);
        return {
          id: messages.length + 1,
          text: "Xin lỗi, tôi không thể thực hiện tìm kiếm lúc này. Vui lòng thử lại sau.",
          sender: 'bot',
          timestamp: new Date()
        };
      }
    }
    
    // Check for recommendation intent
    else if (
      lowerMessage.includes('gợi ý') || 
      lowerMessage.includes('đề xuất') || 
      lowerMessage.includes('recommend') ||
      lowerMessage.includes('suggestion')
    ) {
      try {
        // Get featured movies as recommendations
        const featuredMovies = await movieService.getFeaturedMovies();
        
        return {
          id: messages.length + 1,
          text: "Dựa trên xu hướng hiện tại, tôi gợi ý những bộ phim sau:",
          sender: 'bot',
          timestamp: new Date(),
          searchResults: featuredMovies.slice(0, 3) // Show top 3 results
        };
      } catch (error) {
        console.error('Recommendation error:', error);
        return {
          id: messages.length + 1,
          text: "Xin lỗi, tôi không thể đưa ra gợi ý lúc này. Vui lòng thử lại sau.",
          sender: 'bot',
          timestamp: new Date()
        };
      }
    }
    
    // Check for greeting
    else if (
      lowerMessage.includes('xin chào') || 
      lowerMessage.includes('chào') || 
      lowerMessage.includes('hello') || 
      lowerMessage.includes('hi')
    ) {
      return {
        id: messages.length + 1,
        text: "Xin chào! Tôi có thể giúp bạn tìm kiếm phim, đưa ra gợi ý, hoặc trả lời câu hỏi về lịch chiếu. Bạn cần giúp gì?",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Check for help
    else if (
      lowerMessage.includes('giúp') || 
      lowerMessage.includes('help') || 
      lowerMessage.includes('hỗ trợ')
    ) {
      return {
        id: messages.length + 1,
        text: "Tôi có thể giúp bạn:\n1. Tìm kiếm phim (ví dụ: 'Tìm phim hành động')\n2. Đưa ra gợi ý phim (ví dụ: 'Gợi ý phim cho tôi')\n3. Trả lời câu hỏi về lịch chiếu (ví dụ: 'Lịch chiếu phim hôm nay')",
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    // Default response
    else {
      return {
        id: messages.length + 1,
        text: "Tôi không chắc mình hiểu ý bạn. Bạn có thể hỏi về tìm kiếm phim, gợi ý phim, hoặc lịch chiếu phim.",
        sender: 'bot',
        timestamp: new Date()
      };
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg z-50 hover:bg-primary-dark transition-colors duration-300"
        aria-label="Chat with AI Assistant"
      >
        <FaRobot size={24} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-dark border border-gray-700 rounded-lg shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaRobot className="mr-2" size={20} />
              <h3 className="font-bold">AI Movie Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-300"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-secondary text-white rounded-tl-none'
                  }`}
                >
                  <div className="flex items-start">
                    {message.sender === 'bot' && (
                      <FaRobot className="mr-2 mt-1" size={16} />
                    )}
                    <div>
                      <p className="text-sm">{message.text}</p>
                      {message.searchResults && message.searchResults.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.searchResults.map((movie) => (
                            <div key={movie._id} className="bg-gray-800 p-2 rounded flex items-start">
                              {movie.poster && (
                                <img
                                  src={movie.poster}
                                  alt={movie.title}
                                  className="w-12 h-16 object-cover rounded mr-2"
                                />
                              )}
                              <div className="text-left">
                                <h4 className="font-semibold text-sm">{movie.title}</h4>
                                <p className="text-xs text-gray-300">
                                  {movie.genres?.join(', ') || 'N/A'}
                                </p>
                                <div className="mt-1">
                                  <Link
                                    to={`/movies/${movie._id}`}
                                    className="text-xs bg-primary text-white px-2 py-1 rounded inline-flex items-center"
                                  >
                                    <FaFilm className="mr-1" size={10} />
                                    Chi tiết
                                  </Link>
                                  {movie.status === 'Now Playing' && (
                                    <Link
                                      to={`/booking/${movie._id}`}
                                      className="text-xs bg-green-600 text-white px-2 py-1 rounded ml-1 inline-flex items-center"
                                    >
                                      <FaTicketAlt className="mr-1" size={10} />
                                      Đặt vé
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.sender === 'user' && (
                      <FaUser className="ml-2 mt-1" size={16} />
                    )}
                  </div>
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-secondary text-white rounded-tl-none">
                  <div className="flex items-center">
                    <FaRobot className="mr-2" size={16} />
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-800 text-white p-2 rounded-l-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-r-lg hover:bg-primary-dark"
                disabled={isTyping}
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CSS for typing indicator */}
      <style jsx="true">{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #fff;
          border-radius: 50%;
          display: inline-block;
          margin-right: 3px;
          animation: bounce 1.5s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
          margin-right: 0;
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </>
  );
};

export default ChatAssistant;
