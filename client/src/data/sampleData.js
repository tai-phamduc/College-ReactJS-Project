// Sample movie data
export const sampleMovies = [
  {
    _id: '1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseDate: '2010-07-16',
    duration: 148,
    genre: ['Action', 'Adventure', 'Sci-Fi', 'Thriller'],
    directorName: 'Christopher Nolan',
    cast: [
      {
        name: 'Leonardo DiCaprio',
        character: 'Cobb',
        photo: 'https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
        order: 1
      },
      {
        name: 'Joseph Gordon-Levitt',
        character: 'Arthur',
        photo: 'https://image.tmdb.org/t/p/w500/zSuJ3r5zr5T26tTxyygH3Qe4eYG.jpg',
        order: 2
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    rating: 8.8,
    isActive: true,
    isFeatured: true,
    mpaaRating: 'PG-13',
    language: 'English',
    status: 'Now Playing'
  },
  {
    _id: '2',
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    releaseDate: '1994-10-14',
    duration: 142,
    genre: ['Drama'],
    directorName: 'Frank Darabont',
    cast: [
      {
        name: 'Tim Robbins',
        character: 'Andy Dufresne',
        photo: 'https://image.tmdb.org/t/p/w500/A4fMRuZDlb5zCWGGNYr3vRYdQm3.jpg',
        order: 1
      },
      {
        name: 'Morgan Freeman',
        character: 'Ellis Boyd "Red" Redding',
        photo: 'https://image.tmdb.org/t/p/w500/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg',
        order: 2
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    rating: 9.3,
    isActive: true,
    isFeatured: true,
    mpaaRating: 'R',
    language: 'English',
    status: 'Now Playing'
  },
  {
    _id: '3',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseDate: '2008-07-18',
    duration: 152,
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    directorName: 'Christopher Nolan',
    cast: [
      {
        name: 'Christian Bale',
        character: 'Bruce Wayne / Batman',
        photo: 'https://image.tmdb.org/t/p/w500/qCpZn2e3dimwbryLnqxZuI88PTi.jpg',
        order: 1
      },
      {
        name: 'Heath Ledger',
        character: 'Joker',
        photo: 'https://image.tmdb.org/t/p/w500/5Y9HnYYa9jF4NunY9lSgJGjSe8Z.jpg',
        order: 2
      }
    ],
    poster: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    rating: 9.0,
    isActive: true,
    isFeatured: true,
    mpaaRating: 'PG-13',
    language: 'English',
    status: 'Now Playing'
  }
];

// Sample event data
export const sampleEvents = [
  {
    _id: '1',
    title: 'Marvel Movie Marathon',
    description: 'Experience the entire Marvel Cinematic Universe in one epic weekend! Join us for a back-to-back screening of all Marvel films, with special themed food, costume contests, and exclusive merchandise.',
    startDate: '2025-05-15T10:00:00.000Z',
    endDate: '2025-05-16T23:00:00.000Z',
    location: 'Grand Cinema',
    address: '123 Main Street, Downtown, New York, NY 10001',
    city: 'New York',
    featuredImage: 'https://example.com/events/marvel-marathon.jpg',
    ticketPrice: 49.99,
    isActive: true,
    isFeatured: true,
    status: 'upcoming',
    type: 'screening'
  },
  {
    _id: '2',
    title: 'Director\'s Talk: Christopher Nolan',
    description: 'Join us for an exclusive evening with acclaimed director Christopher Nolan as he discusses his filmmaking process, creative vision, and answers audience questions about his iconic works.',
    startDate: '2025-05-05T19:00:00.000Z',
    endDate: '2025-05-05T21:30:00.000Z',
    location: 'Landmark Theatres',
    address: '101 Market Street, San Francisco, CA 94105',
    city: 'San Francisco',
    featuredImage: 'https://example.com/events/nolan-talk.jpg',
    ticketPrice: 75.00,
    isActive: true,
    isFeatured: true,
    status: 'upcoming',
    type: 'talk'
  },
  {
    _id: '3',
    title: 'Oscar Nominees Showcase',
    description: 'Catch up on all the Best Picture nominees before the Academy Awards! This week-long event features screenings of each nominated film, panel discussions with film critics, and Oscar prediction contests.',
    startDate: '2025-02-20T12:00:00.000Z',
    endDate: '2025-02-26T23:00:00.000Z',
    location: 'AMC Southcenter 16',
    address: '2200 Southcenter Mall, Seattle, WA 98188',
    city: 'Seattle',
    featuredImage: 'https://example.com/events/oscar-nominees.jpg',
    ticketPrice: 39.99,
    isActive: true,
    isFeatured: true,
    status: 'past',
    type: 'festival'
  }
];

// Sample news data
export const sampleNews = [
  {
    _id: '1',
    title: 'Christopher Nolan\'s Next Film Announced',
    content: `<p>Acclaimed director Christopher Nolan has officially announced his next project, a historical thriller set during the Cold War. The film, currently titled "Oppenheimer," will focus on J. Robert Oppenheimer and his role in the development of the atomic bomb.</p>
    <p>Universal Pictures has won the bidding war for the project, marking Nolan's first film not made with Warner Bros. in nearly two decades. The film is scheduled to begin production in early 2022 with a planned release date of July 2023.</p>`,
    excerpt: 'Christopher Nolan has officially announced his next project, a historical thriller about J. Robert Oppenheimer and the development of the atomic bomb.',
    featuredImage: 'https://example.com/news/nolan-next-film.jpg',
    status: 'published',
    publishedAt: '2023-06-15T14:30:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    _id: '2',
    title: 'Top 10 Summer Blockbusters to Watch This Season',
    content: `<p>Summer is here, and that means it's time for the biggest blockbusters of the year to hit theaters. From superhero epics to action-packed adventures, this summer's lineup promises something for everyone.</p>
    <h2>1. "Fast X"</h2>
    <p>The tenth installment in the Fast & Furious saga brings back the entire family for another high-octane adventure. With new villain Jason Momoa joining the cast, this promises to be the most explosive entry yet.</p>`,
    excerpt: 'From superhero epics to action-packed adventures, this summer\'s movie lineup promises something for everyone. Check out our top 10 must-see blockbusters.',
    featuredImage: 'https://example.com/news/summer-blockbusters.jpg',
    status: 'published',
    publishedAt: '2023-06-01T10:15:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    _id: '3',
    title: 'Oscar Nominations Announced: Full List and Surprises',
    content: `<p>The Academy of Motion Picture Arts and Sciences has announced the nominations for the 95th Academy Awards, with several surprises and snubs making headlines.</p>
    <p>"Everything Everywhere All at Once" leads the pack with 11 nominations, including Best Picture, Best Director for Daniel Kwan and Daniel Scheinert, Best Actress for Michelle Yeoh, and Best Supporting Actor and Actress for Ke Huy Quan and Jamie Lee Curtis, respectively.</p>`,
    excerpt: 'The Academy has announced nominations for the 95th Oscars, with "Everything Everywhere All at Once" leading with 11 nominations. See the full list and biggest surprises.',
    featuredImage: 'https://example.com/news/oscar-nominations.jpg',
    status: 'published',
    publishedAt: '2023-01-24T18:45:00.000Z',
    isActive: true,
    isFeatured: false
  }
];
