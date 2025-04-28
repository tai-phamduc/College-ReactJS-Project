const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://lathanhsi100804:thanhsi1008@movie-booking.xovn2xs.mongodb.net/';
const dbName = 'movie-booking';

// Sample upcoming movies data
const upcomingMovies = [
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    storyLine: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people. As malevolent forces explode into conflict over the planet's exclusive supply of the most precious resource in existence, only those who can conquer their own fear will survive.",
    releaseDate: new Date("2024-03-01"),
    duration: 166,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    director: null,
    directorName: "Denis Villeneuve",
    writer: "Jon Spaihts, Denis Villeneuve, Frank Herbert",
    writers: ["Jon Spaihts", "Denis Villeneuve", "Frank Herbert"],
    cast: [
      {
        name: "Timothée Chalamet",
        character: "Paul Atreides",
        photo: "https://image.tmdb.org/t/p/w500/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
        order: 1
      },
      {
        name: "Zendaya",
        character: "Chani",
        photo: "https://image.tmdb.org/t/p/w500/r3A7ev7QkjOGocVn3kQrJ0eOouk.jpg",
        order: 2
      },
      {
        name: "Rebecca Ferguson",
        character: "Lady Jessica",
        photo: "https://image.tmdb.org/t/p/w500/lJloTOheuQSirSLXNA3ZEMmDLlS.jpg",
        order: 3
      }
    ],
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    trailer: "https://www.youtube.com/watch?v=Way9Dexny3w",
    status: "Coming Soon",
    rating: 8.5,
    language: "English",
    country: "USA",
    ageRating: "PG-13",
    isActive: true,
    isFeatured: true,
    images: [
      "https://image.tmdb.org/t/p/original/qBx97wytqlyPqXATHqRgIVFxJRU.jpg",
      "https://image.tmdb.org/t/p/original/6m4uYFAJwkanZXd0n0HUQ0lYHLl.jpg",
      "https://image.tmdb.org/t/p/original/tLxjbT5ROZRwYcpNT3nfQbqkApk.jpg"
    ]
  },
  {
    title: "Deadpool & Wolverine",
    description: "Wade Wilson's life takes an unexpected turn when the Time Variance Authority recruits him to fix his timeline. He must team up with Wolverine for a mission that will change the Marvel Cinematic Universe forever.",
    storyLine: "After surviving a near fatal bovine attack, a disfigured cafeteria chef (Wade Wilson) struggles to fulfill his dream of becoming Mayberry's hottest bartender while also learning to cope with his lost sense of taste. Searching to regain his spice for life, as well as a flux capacitor, Wade must battle ninjas, the yakuza, and a pack of sexually aggressive canines, as he journeys around the world to discover the importance of family, friendship, and flavor.",
    releaseDate: new Date("2024-07-26"),
    duration: 120,
    genre: ["Action", "Comedy", "Sci-Fi"],
    director: null,
    directorName: "Shawn Levy",
    writer: "Rhett Reese, Paul Wernick, Ryan Reynolds",
    writers: ["Rhett Reese", "Paul Wernick", "Ryan Reynolds"],
    cast: [
      {
        name: "Ryan Reynolds",
        character: "Wade Wilson / Deadpool",
        photo: "https://image.tmdb.org/t/p/w500/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg",
        order: 1
      },
      {
        name: "Hugh Jackman",
        character: "Logan / Wolverine",
        photo: "https://image.tmdb.org/t/p/w500/oOqun0BhA1rLXOi7Q1WdvXAkmW.jpg",
        order: 2
      },
      {
        name: "Emma Corrin",
        character: "Cassandra Nova",
        photo: "https://image.tmdb.org/t/p/w500/1WZkO6w6AJNt4CKrwpYTpRQXKQK.jpg",
        order: 3
      }
    ],
    poster: "https://image.tmdb.org/t/p/w500/kqUNgfbed27TfIYG0C6l7rgDZO5.jpg",
    trailer: "https://www.youtube.com/watch?v=4mCoOGiUE7E",
    status: "Coming Soon",
    rating: 8.0,
    language: "English",
    country: "USA",
    ageRating: "R",
    isActive: true,
    isFeatured: true,
    images: [
      "https://image.tmdb.org/t/p/original/yOm993lsJyPmBodlYjgpPwBjXP9.jpg",
      "https://image.tmdb.org/t/p/original/ixZzr4PyLudDgWiVRZJMjt6GDs.jpg",
      "https://image.tmdb.org/t/p/original/zcS8q2JVEFUvi1j0LJGnAWYLzYh.jpg"
    ]
  },
  {
    title: "Furiosa: A Mad Max Saga",
    description: "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus.",
    storyLine: "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus. Sweeping through the Wasteland, they come across the Citadel presided over by The Immortan Joe. While the two Tyrants war for dominance, Furiosa must survive many trials as she puts together the means to find her way home.",
    releaseDate: new Date("2024-05-24"),
    duration: 150,
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: null,
    directorName: "George Miller",
    writer: "George Miller, Nico Lathouris",
    writers: ["George Miller", "Nico Lathouris"],
    cast: [
      {
        name: "Anya Taylor-Joy",
        character: "Furiosa",
        photo: "https://image.tmdb.org/t/p/w500/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.jpg",
        order: 1
      },
      {
        name: "Chris Hemsworth",
        character: "Dementus",
        photo: "https://image.tmdb.org/t/p/w500/jpurJ9jAcLCYjgHHfYF32m3zJYm.jpg",
        order: 2
      },
      {
        name: "Tom Burke",
        character: "Jack",
        photo: "https://image.tmdb.org/t/p/w500/utEXl9tF5SN3rwhMwLBnGejVMBW.jpg",
        order: 3
      }
    ],
    poster: "https://image.tmdb.org/t/p/w500/kdYW1k5lCVmEzJ21OvaBpXnqgur.jpg",
    trailer: "https://www.youtube.com/watch?v=XdKzUbAiswE",
    status: "Coming Soon",
    rating: 7.8,
    language: "English",
    country: "Australia",
    ageRating: "R",
    isActive: true,
    isFeatured: true,
    images: [
      "https://image.tmdb.org/t/p/original/gCn0IIBn2nZYVwXBTDJnTnuMFG7.jpg",
      "https://image.tmdb.org/t/p/original/vfuzELlU0PQTTrwq10HRYLJjwrl.jpg",
      "https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg"
    ]
  },
  {
    title: "Kingdom of the Planet of the Apes",
    description: "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught about the past and make choices that will define a future for apes and humans alike.",
    storyLine: "Set several generations in the future following Caesar's reign, in which apes are the dominant species living harmoniously and humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all that he has known about the past and to make choices that will define a future for apes and humans alike.",
    releaseDate: new Date("2024-05-10"),
    duration: 145,
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: null,
    directorName: "Wes Ball",
    writer: "Josh Friedman, Rick Jaffa, Amanda Silver",
    writers: ["Josh Friedman", "Rick Jaffa", "Amanda Silver"],
    cast: [
      {
        name: "Owen Teague",
        character: "Noa",
        photo: "https://image.tmdb.org/t/p/w500/5XG8BnNMdQHzxFO6bXJvLgUgJBD.jpg",
        order: 1
      },
      {
        name: "Freya Allan",
        character: "Mae",
        photo: "https://image.tmdb.org/t/p/w500/3BuGv85p2xdAOXdC61irEt0RY6c.jpg",
        order: 2
      },
      {
        name: "Kevin Durand",
        character: "Proximus Caesar",
        photo: "https://image.tmdb.org/t/p/w500/q6yfV7dFBWQlO0RqVZxvLDq1EQP.jpg",
        order: 3
      }
    ],
    poster: "https://image.tmdb.org/t/p/w500/5gzRYcV509QpNzryplirJbWDr62.jpg",
    trailer: "https://www.youtube.com/watch?v=6sxn3kbgEiU",
    status: "Coming Soon",
    rating: 7.5,
    language: "English",
    country: "USA",
    ageRating: "PG-13",
    isActive: true,
    isFeatured: true,
    images: [
      "https://image.tmdb.org/t/p/original/mDeUmPe4MF35WWlAqj4QFX5UauJ.jpg",
      "https://image.tmdb.org/t/p/original/sFaDyM9qe2eZ0Qxde2Wkm1qzgGZ.jpg",
      "https://image.tmdb.org/t/p/original/bGQyu8H6q20ZRzd1Yk5oVUiZZyM.jpg"
    ]
  },
  {
    title: "A Quiet Place: Day One",
    description: "Experience the day the world went quiet.",
    storyLine: "A prequel to the post-apocalyptic horror film 'A Quiet Place', following a new set of characters as they experience the first day of the deadly alien invasion that forces humanity to live in silence.",
    releaseDate: new Date("2024-06-28"),
    duration: 120,
    genre: ["Horror", "Sci-Fi", "Thriller"],
    director: null,
    directorName: "Michael Sarnoski",
    writer: "Michael Sarnoski, John Krasinski",
    writers: ["Michael Sarnoski", "John Krasinski"],
    cast: [
      {
        name: "Lupita Nyong'o",
        character: "Sam",
        photo: "https://image.tmdb.org/t/p/w500/y40Qh1RuYMLUVQvgQuX3Neq0SeB.jpg",
        order: 1
      },
      {
        name: "Joseph Quinn",
        character: "Eric",
        photo: "https://image.tmdb.org/t/p/w500/8J5sXbgUXTqwTVq3FpqcvGKKwaj.jpg",
        order: 2
      },
      {
        name: "Alex Wolff",
        character: "Ethan",
        photo: "https://image.tmdb.org/t/p/w500/mXKlKEU9uoYlCMKu4H4yEfgQEjk.jpg",
        order: 3
      }
    ],
    poster: "https://image.tmdb.org/t/p/w500/qfTVwlX6HLNYiSzVz0cJxgj5NmC.jpg",
    trailer: "https://www.youtube.com/watch?v=EWCgrGQTY98",
    status: "Coming Soon",
    rating: 7.2,
    language: "English",
    country: "USA",
    ageRating: "PG-13",
    isActive: true,
    isFeatured: true,
    images: [
      "https://image.tmdb.org/t/p/original/oBIQDKcqNxKckjugtmzpIIOgoc4.jpg",
      "https://image.tmdb.org/t/p/original/ePwZtriWVewGJUVJPHMxQ7igbD.jpg",
      "https://image.tmdb.org/t/p/original/uxKIjZCzQdaVn3xgGYiGjEU55Le.jpg"
    ]
  }
];

async function addUpcomingMovies() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(dbName);
    const moviesCollection = database.collection('movies');

    // Add release month and year to each movie
    const moviesWithFormattedDates = upcomingMovies.map(movie => {
      const releaseDate = new Date(movie.releaseDate);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      return {
        ...movie,
        releaseMonth: months[releaseDate.getMonth()],
        releaseYear: releaseDate.getFullYear(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Insert the movies
    const result = await moviesCollection.insertMany(moviesWithFormattedDates);
    console.log(`${result.insertedCount} upcoming movies added to the database`);

  } catch (error) {
    console.error('Error adding upcoming movies:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
addUpcomingMovies();
