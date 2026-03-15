const mongoose = require('mongoose');
const Movie = require('../models/Movie');
require('dotenv').config();

// Tamil movies data
const tamilMovies = [
  {
    title: "Leo",
    year: 2023,
    genre: "Action",
    rating: 4.6,
    poster: "https://picsum.photos/seed/leo/300/450.jpg",
    description: "A mysterious man with a violent past tries to protect his family.",
    duration: "2h 44m",
    director: "Lokesh Kanagaraj",
    cast: [
      { name: "Vijay", character: "Leo Das", image: "https://picsum.photos/seed/vijay/150/150.jpg" },
      { name: "Trisha", character: "Sathya", image: "https://picsum.photos/seed/trisha/150/150.jpg" },
      { name: "Sanjay Dutt", character: "Antony Das", image: "https://picsum.photos/seed/sanjay/150/150.jpg" }
    ]
  },
  {
    title: "Thunivu",
    year: 2023,
    genre: "Action",
    rating: 4.2,
    poster: "https://picsum.photos/seed/thunivu/300/450.jpg",
    description: "A common man rises against corruption in modern society.",
    duration: "2h 28m",
    director: "H. Vinoth",
    cast: [
      { name: "Ajith Kumar", character: "Hero", image: "https://picsum.photos/seed/ajith/150/150.jpg" },
      { name: "Manju Warrier", character: "Heroine", image: "https://picsum.photos/seed/manju/150/150.jpg" }
    ]
  },
  {
    title: "Ponniyin Selvan",
    year: 2022,
    genre: "Drama",
    rating: 4.3,
    poster: "https://picsum.photos/seed/ponniyin/300/450.jpg",
    description: "A tribal warrior leads his people during the colonial era.",
    duration: "2h 47m",
    director: "Mani Ratnam",
    cast: [
      { name: "Vikram", character: "Aditya Karikalan", image: "https://picsum.photos/seed/vikram/150/150.jpg" },
      { name: "Aishwarya Rai", character: "Nandini", image: "https://picsum.photos/seed/aishwarya/150/150.jpg" }
    ]
  },
  {
    title: "Vikram",
    year: 2022,
    genre: "Action",
    rating: 4.4,
    poster: "https://picsum.photos/seed/vikram/300/450.jpg",
    description: "A thrilling action story about survival and revenge.",
    duration: "2h 53m",
    director: "Lokesh Kanagaraj",
    cast: [
      { name: "Kamal Haasan", character: "Vikram", image: "https://picsum.photos/seed/kamal/150/150.jpg" },
      { name: "Fahadh Faasil", character: "Amar", image: "https://picsum.photos/seed/fahadh/150/150.jpg" }
    ]
  },
  {
    title: "Vettaiyan",
    year: 2022,
    genre: "Action",
    rating: 4.5,
    poster: "https://picsum.photos/seed/vettaiyan/300/450.jpg",
    description: "A powerful cop fights against crime and corruption.",
    duration: "2h 45m",
    director: "Bala",
    cast: [
      { name: "Rajinikanth", character: "Vettaiyan", image: "https://picsum.photos/seed/rajini/150/150.jpg" }
    ]
  },
  {
    title: "Kanguva",
    year: 2024,
    genre: "Fantasy",
    rating: 4.1,
    poster: "https://picsum.photos/seed/kanguva/300/450.jpg",
    description: "A warrior's journey across centuries to protect his people.",
    duration: "2h 35m",
    director: "Siva",
    cast: [
      { name: "Suriya", character: "Kanguva", image: "https://picsum.photos/seed/suriya/150/150.jpg" }
    ]
  },
  {
    title: "Dragon",
    year: 2023,
    genre: "Fantasy",
    rating: 3.8,
    poster: "https://picsum.photos/seed/dragon/300/450.jpg",
    description: "A mystical tale of dragons and ancient powers.",
    duration: "2h 20m",
    director: "Ashwath Marimuthu",
    cast: [
      { name: "Pradeep Ranganathan", character: "Dragon", image: "https://picsum.photos/seed/pradeep/150/150.jpg" }
    ]
  },
  {
    title: "Garudan",
    year: 2023,
    genre: "Action",
    rating: 4.0,
    poster: "https://picsum.photos/seed/garudan/300/450.jpg",
    description: "An eagle-eyed vigilante fights for justice.",
    duration: "2h 30m",
    director: "R. S. Durai Senthilkumar",
    cast: [
      { name: "Sasikumar", character: "Garudan", image: "https://picsum.photos/seed/sasikumar/150/150.jpg" }
    ]
  },
  {
    title: "Captain Miller",
    year: 2022,
    genre: "Action",
    rating: 3.9,
    poster: "https://picsum.photos/seed/captainmiller/300/450.jpg",
    description: "A revolutionary leader fights against oppression.",
    duration: "2h 40m",
    director: "Arun Matheswaran",
    cast: [
      { name: "Dhanush", character: "Captain Miller", image: "https://picsum.photos/seed/dhanush/150/150.jpg" }
    ]
  },
  {
    title: "Amaran",
    year: 2022,
    genre: "Biography",
    rating: 4.2,
    poster: "https://picsum.photos/seed/amaran/300/450.jpg",
    description: "Based on the life of a brave soldier.",
    duration: "2h 25m",
    director: "Rajkumar Periasamy",
    cast: [
      { name: "Sivakarthikeyan", character: "Amaran", image: "https://picsum.photos/seed/sivakarthikeyan/150/150.jpg" }
    ]
  },
  {
    title: "Raayan",
    year: 2023,
    genre: "Action",
    rating: 3.7,
    poster: "https://picsum.photos/seed/raayan/300/450.jpg",
    description: "A gangster's journey through the underworld.",
    duration: "2h 15m",
    director: "Dhanush",
    cast: [
      { name: "Dhanush", character: "Raayan", image: "https://picsum.photos/seed/dhanush2/150/150.jpg" }
    ]
  },
  {
    title: "Maharaja",
    year: 2023,
    genre: "Action",
    rating: 4.7,
    poster: "https://picsum.photos/seed/maharaja/300/450.jpg",
    description: "A king's quest to reclaim his throne.",
    duration: "2h 38m",
    director: "Nithilan Saminathan",
    cast: [
      { name: "Vijay Sethupathi", character: "Maharaja", image: "https://picsum.photos/seed/vijaysethupathi/150/150.jpg" }
    ]
  },
  {
    title: "Lubber Pandhu",
    year: 2023,
    genre: "Sports",
    rating: 3.6,
    poster: "https://picsum.photos/seed/lubberpandhu/300/450.jpg",
    description: "A cricket story of passion and perseverance.",
    duration: "2h 10m",
    director: "Tamizharasan Pachamalai",
    cast: [
      { name: "Harish Kalyan", character: "Cricketer", image: "https://picsum.photos/seed/harish/150/150.jpg" }
    ]
  },
  {
    title: "Kudumbasthan",
    year: 2024,
    genre: "Family",
    rating: 3.5,
    poster: "https://picsum.photos/seed/kudumbasthan/300/450.jpg",
    description: "A heartwarming family comedy.",
    duration: "2h 5m",
    director: "R. S. Prasanna",
    cast: [
      { name: "Manikandan", character: "Father", image: "https://picsum.photos/seed/manikandan/150/150.jpg" }
    ]
  },
  {
    title: "Brother",
    year: 2023,
    genre: "Family",
    rating: 3.8,
    poster: "https://picsum.photos/seed/brother/300/450.jpg",
    description: "A story of sibling bonds and family values.",
    duration: "2h 18m",
    director: "M. Rajesh",
    cast: [
      { name: "Jayam Ravi", character: "Brother", image: "https://picsum.photos/seed/jayamravi/150/150.jpg" }
    ]
  },
  {
    title: "Aranmanai 4",
    year: 2023,
    genre: "Horror",
    rating: 3.4,
    poster: "https://picsum.photos/seed/aranmanai4/300/450.jpg",
    description: "A haunted palace with supernatural occurrences.",
    duration: "2h 22m",
    director: "Sundar C",
    cast: [
      { name: "Sundar C", character: "Hero", image: "https://picsum.photos/seed/sundarc/150/150.jpg" }
    ]
  },
  {
    title: "Hit List",
    year: 2024,
    genre: "Thriller",
    rating: 3.9,
    poster: "https://picsum.photos/seed/hitlist/300/450.jpg",
    description: "A crime thriller with unexpected twists.",
    duration: "2h 12m",
    director: "Karthik Dinesh",
    cast: [
      { name: "Vijay Kanishka", character: "Detective", image: "https://picsum.photos/seed/vijaykanishka/150/150.jpg" }
    ]
  },
  {
    title: "Genie",
    year: 2024,
    genre: "Fantasy",
    rating: 3.3,
    poster: "https://picsum.photos/seed/genie/300/450.jpg",
    description: "A magical genie grants three wishes.",
    duration: "2h 8m",
    director: "Bagyaraj Dennis",
    cast: [
      { name: "Kalyan Priyadarshan", character: "Genie", image: "https://picsum.photos/seed/kalyan/150/150.jpg" }
    ]
  },
  {
    title: "Good Night",
    year: 2023,
    genre: "Romance",
    rating: 4.0,
    poster: "https://picsum.photos/seed/goodnight/300/450.jpg",
    description: "A modern love story with realistic challenges.",
    duration: "2h 5m",
    director: "Vinayak Chandrasekaran",
    cast: [
      { name: "Manikandan", character: "Hero", image: "https://picsum.photos/seed/manikandan2/150/150.jpg" }
    ]
  },
  {
    title: "Blue Star",
    year: 2023,
    genre: "Sports",
    rating: 3.7,
    poster: "https://picsum.photos/seed/bluestar/300/450.jpg",
    description: "A cricket team's journey to victory.",
    duration: "2h 15m",
    director: "S. Jayakumar",
    cast: [
      { name: "Ashok Selvan", character: "Cricketer", image: "https://picsum.photos/seed/ashok/150/150.jpg" }
    ]
  },
  {
    title: "Boat",
    year: 2023,
    genre: "Horror",
    rating: 3.2,
    poster: "https://picsum.photos/seed/boat/300/450.jpg",
    description: "A horror story set on a mysterious boat.",
    duration: "2h 0m",
    director: "Chimbudeven",
    cast: [
      { name: "Yogi Babu", character: "Captain", image: "https://picsum.photos/seed/yogibabu/150/150.jpg" }
    ]
  },
  {
    title: "Vanangaan",
    year: 2024,
    genre: "Action",
    rating: 4.1,
    poster: "https://picsum.photos/seed/vanangaan/300/450.jpg",
    description: "A warrior's fight for justice and honor.",
    duration: "2h 42m",
    director: "Bala",
    cast: [
      { name: "Arya", character: "Vanangaan", image: "https://picsum.photos/seed/arya/150/150.jpg" }
    ]
  },
  {
    title: "Rebel",
    year: 2023,
    genre: "Action",
    rating: 3.6,
    poster: "https://picsum.photos/seed/rebel/300/450.jpg",
    description: "A rebel's fight against the system.",
    duration: "2h 28m",
    director: "Nikhil Mahajan",
    cast: [
      { name: "G.V. Prakash Kumar", character: "Rebel", image: "https://picsum.photos/seed/gvprakash/150/150.jpg" }
    ]
  },
  {
    title: "The Greatest of All Time",
    year: 2024,
    genre: "Sci-Fi",
    rating: 4.3,
    poster: "https://picsum.photos/seed/thegoat/300/450.jpg",
    description: "A sci-fi action adventure across time.",
    duration: "2h 55m",
    director: "Venkat Prabhu",
    cast: [
      { name: "Vijay", character: "Hero", image: "https://picsum.photos/seed/vijay2/150/150.jpg" }
    ]
  },
  {
    title: "SK 21",
    year: 2024,
    genre: "Adventure",
    rating: 4.0,
    poster: "https://picsum.photos/seed/sk21/300/450.jpg",
    description: "An adventurous action thriller.",
    duration: "2h 30m",
    director: "Lokesh Kanagaraj",
    cast: [
      { name: "Suriya", character: "Hero", image: "https://picsum.photos/seed/suriya2/150/150.jpg" }
    ]
  },
  {
    title: "Jailer",
    year: 2023,
    genre: "Action",
    rating: 4.6,
    poster: "https://picsum.photos/seed/jailer/300/450.jpg",
    description: "A jailer's unexpected adventure.",
    duration: "2h 40m",
    director: "Nelson Dilipkumar",
    cast: [
      { name: "Rajinikanth", character: "Jailer", image: "https://picsum.photos/seed/rajini2/150/150.jpg" }
    ]
  },
  {
    title: "Retro",
    year: 2024,
    genre: "Action",
    rating: 3.8,
    poster: "https://picsum.photos/seed/retro/300/450.jpg",
    description: "A retro-style action romance.",
    duration: "2h 20m",
    director: "Karthik Subbaraj",
    cast: [
      { name: "Suriya", character: "Hero", image: "https://picsum.photos/seed/suriya3/150/150.jpg" }
    ]
  },
  {
    title: "Demonte Colony 3",
    year: 2024,
    genre: "Horror",
    rating: 3.5,
    poster: "https://picsum.photos/seed/demonte3/300/450.jpg",
    description: "The third installment of the horror franchise.",
    duration: "2h 10m",
    director: "Ajay Gnanamuthu",
    cast: [
      { name: "Arulnithi", character: "Hero", image: "https://picsum.photos/seed/arulnithi/150/150.jpg" }
    ]
  },
  {
    title: "Love Insurance Kompany",
    year: 2024,
    genre: "Romance",
    rating: 3.4,
    poster: "https://picsum.photos/seed/lik/300/450.jpg",
    description: "A romantic comedy about love insurance.",
    duration: "2h 15m",
    director: "Vignesh Karthick",
    cast: [
      { name: "Siddharth", character: "Hero", image: "https://picsum.photos/seed/siddharth/150/150.jpg" }
    ]
  },
  {
    title: "Nesippaya",
    year: 2024,
    genre: "Romance",
    rating: 3.6,
    poster: "https://picsum.photos/seed/nesippaya/300/450.jpg",
    description: "A beautiful romantic story.",
    duration: "2h 8m",
    director: "Vishnuvardhan",
    cast: [
      { name: "Akash Murali", character: "Hero", image: "https://picsum.photos/seed/akash/150/150.jpg" }
    ]
  }
];

// Seed function
const seedMovies = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert new movies
    await Movie.insertMany(tamilMovies);
    console.log('Seeded Tamil movies successfully');

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding movies:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedMovies();
}

module.exports = seedMovies;
