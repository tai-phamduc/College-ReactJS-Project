import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
  // Slide data
  const slides = [
    {
      id: 1,
      title: "Experience the Magic of Cinema",
      subtitle: "Your premier destination for movies and entertainment",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
      cta: { text: "Browse Movies", link: "/movies" },
      secondaryCta: { text: "Upcoming Events", link: "/events" }
    },
    {
      id: 2,
      title: "Discover New Releases",
      subtitle: "The latest blockbusters and indie gems all in one place",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1770&auto=format&fit=crop",
      cta: { text: "View Schedule", link: "/schedule" },
      secondaryCta: { text: "Latest News", link: "/news" }
    },
    {
      id: 3,
      title: "Special Events & Premieres",
      subtitle: "Be the first to experience exclusive screenings and events",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1770&auto=format&fit=crop",
      cta: { text: "View Events", link: "/events" },
      secondaryCta: { text: "Book Tickets", link: "/movies" }
    }
  ];

  // State for current slide
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle slide transition
  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 700); // Match this with CSS transition time
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 700); // Match this with CSS transition time
    }
  };

  // Go to specific slide
  const goToSlide = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 700); // Match this with CSS transition time
    }
  };

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark to-transparent z-10"></div>

          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-10000 scale-105 hover:scale-100"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>

          {/* Content */}
          <div className="container relative z-20 flex flex-col justify-center h-full">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-primary">{slide.title.split(' ')[0]}</span> {slide.title.split(' ').slice(1).join(' ')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">{slide.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a href={slide.cta.link} className="btn btn-primary">{slide.cta.text}</a>
              <a href={slide.secondaryCta.link} className="btn btn-outline">{slide.secondaryCta.text}</a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
        onClick={prevSlide}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
        onClick={nextSlide}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
