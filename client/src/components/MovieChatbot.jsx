import React, { useState, useRef, useEffect } from 'react';

const MovieChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your movie assistant. I can help you with movie recommendations, information about actors, directors, and more. How can I help you today?'
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

  // Simple responses based on keywords
  const getResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! How can I help you with movies today?";
    }

    if (input.includes('recommend') || input.includes('suggestion')) {
      if (input.includes('action')) {
        return "For action movies, I recommend: The Dark Knight, Mad Max: Fury Road, John Wick, Die Hard, and Mission Impossible series.";
      }
      if (input.includes('comedy')) {
        return "For comedy, check out: Superbad, The Hangover, Bridesmaids, Anchorman, and Dumb and Dumber.";
      }
      if (input.includes('horror')) {
        return "For horror fans, I suggest: The Shining, Hereditary, Get Out, A Quiet Place, and The Conjuring.";
      }
      if (input.includes('sci-fi') || input.includes('science fiction')) {
        return "Great sci-fi movies include: Blade Runner 2049, Interstellar, Arrival, The Matrix, and Dune.";
      }
      if (input.includes('drama')) {
        return "For drama, I recommend: The Shawshank Redemption, The Godfather, Schindler's List, Forrest Gump, and The Green Mile.";
      }

      return "I can recommend movies in various genres. Try asking for recommendations in a specific genre like action, comedy, horror, sci-fi, or drama.";
    }

    if (input.includes('director')) {
      if (input.includes('spielberg') || input.includes('steven spielberg')) {
        return "Steven Spielberg directed classics like Jurassic Park, E.T., Saving Private Ryan, Schindler's List, and Jaws.";
      }
      if (input.includes('nolan') || input.includes('christopher nolan')) {
        return "Christopher Nolan is known for Inception, The Dark Knight trilogy, Interstellar, Dunkirk, and Memento.";
      }
      if (input.includes('tarantino') || input.includes('quentin tarantino')) {
        return "Quentin Tarantino directed Pulp Fiction, Django Unchained, Kill Bill, Inglourious Basterds, and Once Upon a Time in Hollywood.";
      }
      if (input.includes('scorsese') || input.includes('martin scorsese')) {
        return "Martin Scorsese's films include Goodfellas, The Departed, Taxi Driver, Raging Bull, and The Wolf of Wall Street.";
      }

      return "I can provide information about many directors. Try asking about specific directors like Spielberg, Nolan, Tarantino, or Scorsese.";
    }

    if (input.includes('actor') || input.includes('actress')) {
      if (input.includes('tom hanks')) {
        return "Tom Hanks starred in Forrest Gump, Cast Away, Saving Private Ryan, The Green Mile, and Toy Story series.";
      }
      if (input.includes('meryl streep')) {
        return "Meryl Streep is known for The Devil Wears Prada, Sophie's Choice, The Iron Lady, Mamma Mia!, and Kramer vs. Kramer.";
      }
      if (input.includes('leonardo dicaprio') || input.includes('leo dicaprio')) {
        return "Leonardo DiCaprio starred in Titanic, The Revenant, Inception, The Wolf of Wall Street, and Shutter Island.";
      }
      if (input.includes('denzel washington')) {
        return "Denzel Washington is known for Training Day, Malcolm X, The Equalizer, Remember the Titans, and Fences.";
      }

      return "I can provide information about many actors and actresses. Try asking about specific ones like Tom Hanks, Meryl Streep, Leonardo DiCaprio, or Denzel Washington.";
    }

    if (input.includes('thank')) {
      return "You're welcome! Feel free to ask if you need more movie information.";
    }

    if (input.includes('bye') || input.includes('goodbye')) {
      return "Goodbye! Enjoy your movies!";
    }

    return "I'm not sure how to answer that. Try asking about movie recommendations, directors, or actors.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const responseText = getResponse(input);

      // Add assistant message
      const assistantMessage = {
        role: 'assistant',
        content: responseText
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Suggested questions for users
  const suggestedQuestions = [
    "What are some good action movies?",
    "Who directed The Godfather?",
    "Can you recommend a comedy film?",
    "What are the top movies of 2023?"
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
              Movie Assistant
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
              <p className="text-sm text-gray-400 mb-2">Try asking:</p>
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
              placeholder="Ask about movies..."
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
