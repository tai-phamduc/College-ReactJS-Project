import React, { useState, useRef, useEffect } from 'react';
import { InferenceClient } from '@huggingface/inference';

const MovieChatbot = () => {
  // Initialize Hugging Face client with API key from environment variables
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  console.log("Using Hugging Face API key:", apiKey ? "API key is set" : "API key is missing");
  const hf = new InferenceClient(apiKey);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý phim ảnh. Tôi có thể giúp bạn tìm kiếm thông tin về phim, diễn viên, đạo diễn và đưa ra các đề xuất. Tôi có thể giúp gì cho bạn hôm nay?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Phân tích câu hỏi và tạo câu trả lời dựa trên từ khóa - đơn giản hóa
  const getResponse = async (userInput) => {
    const input = userInput.toLowerCase();
    console.log("Processing user input:", input);

    // Xử lý các câu chào hỏi đơn giản
    if (input.includes('xin chào') || input.includes('hello') || input.includes('hi') || input.includes('chào')) {
      return "Xin chào! Tôi có thể giúp gì cho bạn về phim ảnh hôm nay?";
    }

    if (input.includes('cảm ơn') || input.includes('thank')) {
      return "Không có gì! Hãy hỏi tôi bất cứ khi nào bạn cần thông tin về phim ảnh.";
    }

    if (input.includes('tạm biệt') || input.includes('bye') || input.includes('goodbye')) {
      return "Tạm biệt! Chúc bạn xem phim vui vẻ!";
    }

    // Câu trả lời mẫu cho các câu hỏi phổ biến
    if (input.includes('phim hay') || input.includes('đề xuất phim')) {
      return "Một số phim hay đang chiếu: Dune: Part Two, Godzilla x Kong: The New Empire, Kung Fu Panda 4. Bạn thích thể loại phim nào?";
    }

    if (input.includes('giá vé') || input.includes('bao nhiêu tiền')) {
      return "Giá vé xem phim thông thường từ 80.000đ đến 150.000đ tùy vào loại ghế và định dạng phim (2D, 3D, IMAX). Vào cuối tuần và ngày lễ giá có thể cao hơn.";
    }

    if (input.includes('đặt vé') || input.includes('mua vé')) {
      return "Để đặt vé xem phim, bạn có thể chọn phim trong mục 'Now Showing', sau đó nhấn vào nút 'Book Now' và làm theo hướng dẫn để chọn rạp, suất chiếu và ghế ngồi.";
    }

    if (input.includes('lịch chiếu') || input.includes('giờ chiếu')) {
      return "Lịch chiếu phim được cập nhật hàng ngày. Bạn có thể xem lịch chiếu đầy đủ trong mục 'Movies' và chọn phim bạn muốn xem để biết các suất chiếu.";
    }

    if (input.includes('rạp') || input.includes('cinema') || input.includes('theater')) {
      return "Hệ thống rạp chiếu phim của chúng tôi có mặt tại nhiều thành phố lớn với các cụm rạp hiện đại, âm thanh và hình ảnh chất lượng cao.";
    }

    // Tìm kiếm phim theo thể loại
    if (input.includes('hành động') || input.includes('action')) {
      return "Các phim hành động hay: The Dark Knight, Mad Max: Fury Road, John Wick, Mission Impossible và Fast & Furious series. Hiện tại đang chiếu: Godzilla x Kong: The New Empire.";
    }

    if (input.includes('hài') || input.includes('comedy')) {
      return "Các phim hài được yêu thích: The Hangover, Bridesmaids, Superbad, Step Brothers và Dumb and Dumber. Hiện tại đang chiếu: Kung Fu Panda 4.";
    }

    if (input.includes('kinh dị') || input.includes('horror')) {
      return "Phim kinh dị đáng xem: The Shining, Hereditary, Get Out, A Quiet Place và The Conjuring. Hiện tại đang chiếu: Imaginary, Late Night with the Devil.";
    }

    if (input.includes('tình cảm') || input.includes('romance')) {
      return "Các phim tình cảm hay: The Notebook, Titanic, La La Land, Pride and Prejudice và Before Sunrise. Hiện tại đang chiếu: Love Lies Bleeding.";
    }

    if (input.includes('khoa học viễn tưởng') || input.includes('sci-fi')) {
      return "Phim khoa học viễn tưởng nổi bật: Blade Runner 2049, Interstellar, Arrival, The Matrix và Dune. Hiện tại đang chiếu: Dune: Part Two.";
    }

    // Tìm kiếm phim đang chiếu
    if (input.includes('đang chiếu') || input.includes('now playing')) {
      return "Các phim đang chiếu: Dune: Part Two, Godzilla x Kong: The New Empire, Kung Fu Panda 4, Ghostbusters: Frozen Empire, và A Quiet Place: Day One.";
    }

    // Tìm kiếm phim sắp chiếu
    if (input.includes('sắp chiếu') || input.includes('upcoming')) {
      return "Các phim sắp chiếu: Furiosa: A Mad Max Saga (24/5), Inside Out 2 (14/6), Deadpool & Wolverine (26/7), Alien: Romulus (16/8), và Joker: Folie à Deux (4/10).";
    }

    // Tìm kiếm sự kiện
    if (input.includes('sự kiện') || input.includes('event')) {
      return "Các sự kiện sắp tới: Buổi ra mắt phim Furiosa: A Mad Max Saga (22/5), Gặp gỡ đạo diễn Denis Villeneuve (15/6), và Liên hoan phim quốc tế Hà Nội (10/8).";
    }

    // Tìm kiếm tin tức
    if (input.includes('tin tức') || input.includes('news')) {
      return "Tin tức phim mới nhất: Dune: Part Two phá kỷ lục phòng vé, Kung Fu Panda 4 nhận được nhiều lời khen từ giới phê bình, và Liên hoan phim Cannes 2024 công bố danh sách phim tranh giải.";
    }

    // Câu trả lời mặc định nếu không tìm thấy thông tin phù hợp
    return "Xin lỗi, tôi không có thông tin về yêu cầu của bạn. Bạn có thể hỏi về phim đang chiếu, phim sắp chiếu, hoặc các sự kiện và tin tức liên quan đến phim ảnh.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Kiểm tra xem câu hỏi có phải là câu chào không
      const isGreeting = input.toLowerCase().includes('xin chào') ||
                         input.toLowerCase().includes('hello') ||
                         input.toLowerCase().includes('hi') ||
                         input.toLowerCase().includes('chào');

      // Nếu là câu chào và đã có câu chào trước đó, sử dụng câu trả lời khác
      if (isGreeting && messages.length > 1) {
        const assistantMessage = {
          role: 'assistant',
          content: "Tôi vẫn đang ở đây! Bạn muốn biết thông tin gì về phim ảnh?"
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      try {
        console.log("Calling Hugging Face API with prompt:", input);

        // Create a context for the model with previous messages
        const context = messages
          .slice(-4) // Take last 4 messages for context
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n');

        // Create a prompt that focuses on movie-related information
        const prompt = `
Bạn là trợ lý phim ảnh hữu ích cung cấp thông tin về phim, diễn viên, đạo diễn và đưa ra các đề xuất.
Cuộc trò chuyện trước đó:
${context}

User: ${input}

Hãy cung cấp câu trả lời hữu ích và ngắn gọn về phim ảnh bằng tiếng Việt:`;

        // Call Hugging Face model
        const response = await hf.textGeneration({
          model: "mistralai/Mistral-7B-Instruct-v0.2", // Using Mistral model for better responses
          inputs: prompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.15
          }
        });

        console.log("Received response from Hugging Face API:", response);

        // Clean up the response
        let responseText = response.generated_text || "Xin lỗi, tôi không thể tạo câu trả lời.";

        // Remove any "Assistant:" prefix that might be in the response
        responseText = responseText.replace(/^Assistant:\s*/i, '');

        // Add assistant message
        const assistantMessage = {
          role: 'assistant',
          content: responseText
        };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (aiError) {
        console.error('Error calling AI model:', aiError);

        // Nếu gọi AI thất bại, thử sử dụng hàm getResponse để tìm câu trả lời từ dữ liệu mẫu
        const localResponse = await getResponse(input);

        const assistantMessage = {
          role: 'assistant',
          content: localResponse
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error in chatbot response:', error);
      // Fallback to simple response if both API and AI model fail
      const assistantMessage = {
        role: 'assistant',
        content: "Xin lỗi, tôi đang gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Suggested questions for users
  const suggestedQuestions = [
    "Phim hành động đang chiếu?",
    "Phim sắp chiếu tháng này?",
    "Có sự kiện phim nào sắp tới?",
    "Tin tức phim mới nhất?"
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
        aria-label="Open movie chatbot"
        style={{ zIndex: 9999 }}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Trợ lý Phim ảnh
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close chatbot"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-80 overflow-y-auto bg-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : 'bg-gray-700 text-white rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-gray-700 text-white rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length < 3 && (
            <div className="p-3 bg-gray-800 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Thử hỏi:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-gray-700 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về phim ảnh..."
              className="flex-1 bg-gray-600 text-white p-2 rounded-l-lg focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-orange-500 text-white p-2 rounded-r-lg hover:bg-orange-700 transition-colors"
              disabled={isLoading}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MovieChatbot;
